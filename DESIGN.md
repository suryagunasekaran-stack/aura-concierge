# Aura Aesthetic Clinic — AI Concierge (MVP) — Design Spec

> This document is written to give an LLM coding agent everything it needs to build the MVP. It specifies scope, architecture, file layout, the LLM tool-calling loop, every tool's contract, the system prompt, guardrails, mock data, and the test strategy. Build to this spec. Where a detail is marked **(MVP)**, keep it deliberately simple; where marked **(prod note)**, it is out of scope for now but the code should not make it hard to add later.

---

## 1. Goal & scope

Build a **Node.js + Express** backend that powers an **AI concierge** for **Aura Aesthetic Clinic**. A customer types a message in natural language; the assistant understands intent, calls the right internal tool(s), and replies conversationally.

For this MVP:

- **Input is the terminal.** A CLI dev harness reads a line of text from stdin and treats it as one inbound customer message. This stands in for the WhatsApp webhook that will replace it later. The Express server still exists and exposes the same processing pipeline over an HTTP route, so the CLI and a future webhook share one code path.
- **LLM provider is OpenAI**, using **function calling** (tools).
- **Tools are simulated** but behave realistically: the calendar-booking tool returns an artificial confirmation link; the customer-info tool reads from a local mock "database"; escalation records a hand-off.
- **The API key is supplied via environment variable.** Never hardcode it.
- **The assistant must understand Singlish** as well as standard English (e.g. "eh can book facial for me tmr ah", "how much for the laser one leh", "my appt still on or not").

### Non-goals (MVP)
- No real WhatsApp / Meta webhook wiring yet (structure the code so it slots in — see §12).
- No real database, calendar API, or payment.
- No persistent session store across process restarts (in-memory is fine — see §6).
- No auth/user accounts beyond identifying a customer by a phone-number-like key.

---

## 2. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Runtime | Node.js ≥ 20 | Uses built-in `fetch`, ESM modules |
| Framework | Express 4 | One processing route + health check |
| LLM | OpenAI SDK (`openai`) | Function calling / tools |
| Config | `dotenv` | Reads `OPENAI_API_KEY`, `OPENAI_MODEL` |
| CLI | Node `readline` | Dev harness reading stdin |
| Tests | **Vitest** | Scenario tests that call the **real** LLM live |
| Lint/format | (optional) ESLint + Prettier | Not required for MVP |

Use **ESM** (`"type": "module"` in `package.json`).

---

## 3. High-level architecture

```
Terminal (dev harness)  ──┐
                          ├──►  processMessage(sessionId, text)  ──►  reply text
Express POST /message  ───┘            │
                                       ├─ load session (in-memory)
                                       ├─ build messages[] (system + history + user)
                                       ├─ OpenAI call WITH tools
                                       ├─ tool-loop:  while the model returns tool_calls:
                                       │      run each tool → append tool result → call again
                                       ├─ final assistant text
                                       ├─ output validation
                                       └─ save session
```

The **same** `processMessage()` function is called by both the CLI and the HTTP route. This is the seam a real webhook later plugs into.

---

## 4. Project structure

```
aura-concierge/
├── package.json
├── .env.example
├── DESIGN.md
├── src/
│   ├── index.js            # boots Express server
│   ├── cli.js              # dev harness: reads stdin, calls processMessage
│   ├── config.js           # loads + validates env
│   ├── pipeline.js         # processMessage(): the orchestrator (§5)
│   ├── llm/
│   │   ├── client.js       # OpenAI client init
│   │   └── loop.js         # the tool-calling loop
│   ├── prompt/
│   │   └── systemPrompt.js # system prompt builder (§8)
│   ├── session/
│   │   └── store.js        # in-memory session store (§6)
│   ├── tools/
│   │   ├── registry.js     # array of tool defs + name→handler map (§7)
│   │   ├── schemas.js      # OpenAI-format function schemas
│   │   ├── listServices.js
│   │   ├── getServiceInfo.js
│   │   ├── checkAvailability.js
│   │   ├── bookAppointment.js
│   │   ├── confirmBooking.js
│   │   ├── getCustomerInfo.js
│   │   ├── getMyAppointments.js
│   │   ├── cancelAppointment.js
│   │   ├── getClinicInfo.js
│   │   └── escalateToHuman.js
│   ├── data/
│   │   ├── services.js     # mock service catalog
│   │   ├── customers.js    # mock customer DB
│   │   └── appointments.js # in-memory appointment store
│   └── util/
│       ├── logger.js
│       └── validateOutput.js
└── test/
    ├── toolSelection.test.js   # asserts correct tool chosen per scenario (§11)
    ├── singlish.test.js        # Singlish scenarios
    └── helpers/
        └── runTurn.js          # helper: run one message, capture tool calls + reply
```

---

## 5. The orchestrator — `processMessage()`

Signature: `async processMessage(sessionId, userText) → { reply, toolCalls }`

`toolCalls` (the ordered list of tool names invoked this turn) is returned **so tests can assert on it** and for logging. Steps:

1. **Input guard (MVP):** trim; reject empty; enforce a max length (e.g. 1500 chars); per-session simple rate check (e.g. max N messages/minute — can be a no-op stub in MVP but leave the hook).
2. **Load session** by `sessionId` (§6). Detect an explicit reset phrase (`"start over"`, `"reset"`, `"new booking"`, plus Singlish `"restart lah"`) → clear history before proceeding.
3. **Build `messages[]`:** `[systemPrompt, ...history, { role: "user", content: userText }]`.
4. **Run the tool loop** (§5.1) → final assistant text + captured `toolCalls`.
5. **Validate output** (§9).
6. **Append** the user message and final assistant message to history; **save session**.
7. Return `{ reply, toolCalls }`.

### 5.1 Tool-calling loop (`llm/loop.js`)

```
loop (max 5 iterations to prevent runaway):
  response = openai.chat.completions.create({ model, messages, tools, tool_choice: "auto" })
  msg = response.choices[0].message
  append msg to messages
  if msg.tool_calls is empty:
      return { text: msg.content, toolCalls }
  for each call in msg.tool_calls:
      record call.function.name in toolCalls
      args = JSON.parse(call.function.arguments)   # wrap in try/catch
      result = await registry.handlers[call.function.name](args, ctx)
      append { role: "tool", tool_call_id: call.id, content: JSON.stringify(result) }
  # loop continues; model now sees tool results
if loop exceeds max iterations:
      return a safe fallback + escalate
```

`ctx` carries `{ sessionId, customerKey }` so handlers can scope data to the current customer. Every handler returns a **plain JSON-serializable object** (never throws to the loop — catch internally and return `{ ok: false, error }`).

---

## 6. Session management (MVP)

- **Store:** a `Map` keyed by `sessionId` (the customer's phone-number-like key). Each value: `{ history: [...], createdAt, lastActiveAt, pending: {...} }`.
- **`history`** holds prior `user` / `assistant` / `tool` turns. **Cap** to the last ~20 messages before sending to the LLM (drop oldest, but always keep the system prompt which is added fresh each turn, not stored).
- **`pending`** holds staged state for a two-step confirm flow (e.g. a booking awaiting "yes" — see §7 `bookAppointment` / `confirmBooking`).
- **TTL/reset:** if `lastActiveAt` is older than 30 min, treat as a new session (clear history). Also clear on explicit reset phrase.
- **(prod note)** Swap this `Map` for Redis (hot state) + Supabase/Postgres (durable log) without changing the interface. Keep the store behind `session/store.js` with `get`, `set`, `reset`.

---

## 7. Tools

Design principle: **tools are narrow and specific**, never a generic "run query." The tool *descriptions* are the intent classifier — write them clearly, state when to use and when NOT to use each. All tools return JSON. Below, each tool lists: purpose, parameters, behavior, and simulated data source.

### 7.1 `list_services`
- **Purpose:** list treatments the clinic offers so the model never invents services or prices.
- **Params:** none (optionally `{ category?: string }`).
- **Behavior:** return array from `data/services.js` (`id`, `name`, `category`, `durationMin`, `priceSGD`).
- **Use when:** customer asks what's offered / "what can you do".

### 7.2 `get_service_info`
- **Purpose:** details/price/duration for one service.
- **Params:** `{ serviceId?: string, query?: string }` — `query` lets the model pass a fuzzy name ("the laser one", "hydrafacial").
- **Behavior:** resolve by id or fuzzy-match name against the catalog; return the service or `{ ok: false, reason: "not_found" }`.

### 7.3 `check_availability`
- **Purpose:** find open slots before booking.
- **Params:** `{ serviceId: string, date: string (YYYY-MM-DD), partOfDay?: "morning"|"afternoon"|"evening" }`.
- **Behavior:** **simulated** — deterministically generate a few plausible slots for the date (e.g. skip past times, return 3–4 slots). Return `{ date, slots: ["10:30","14:00","16:15"] }`.

### 7.4 `book_appointment` (staged — does NOT finalize)
- **Purpose:** stage a booking and produce a summary for the customer to confirm.
- **Params:** `{ serviceId, date, time, customerName, customerKey }`.
- **Behavior:** validate the slot; write a `pending.booking` object into the session; return `{ ok: true, needsConfirmation: true, summary: {...} }`. **Do not** create the final appointment here.
- **Why:** booking is a sensitive action — see §10. The model is instructed to read the summary back and wait for an explicit "yes".

### 7.5 `confirm_booking` (finalizes)
- **Purpose:** finalize the staged booking after the customer confirms.
- **Params:** `{ customerKey: string }` (reads `pending.booking` from session).
- **Behavior:** create the appointment in `data/appointments.js`, clear `pending.booking`, return `{ ok: true, bookingId, confirmationLink: "https://aura-clinic.example/booking/<bookingId>" }`. **This artificial link is the "calendar booking link" requirement.**
- **Guard:** if there is no `pending.booking`, return `{ ok: false, reason: "nothing_to_confirm" }`.

### 7.6 `get_customer_info`
- **Purpose:** look up the customer's profile (the "customer info, simulated but checks DB" requirement).
- **Params:** `{ customerKey: string }`.
- **Behavior:** read from `data/customers.js`; return profile (`name`, `memberTier`, `lastVisit`, `notes`) or `{ ok: false, reason: "not_found" }` for a new/unknown customer.
- **Scope guard:** only ever return the record matching `ctx.customerKey`. The model must not be able to fetch *another* customer's data — ignore/override any `customerKey` in args that doesn't match `ctx`.

### 7.7 `get_my_appointments`
- **Purpose:** list the current customer's upcoming appointments ("is my appt still on").
- **Params:** `{ customerKey }`.
- **Behavior:** filter `data/appointments.js` by customer; return array.

### 7.8 `cancel_appointment` (sensitive — confirm)
- **Purpose:** cancel an existing appointment.
- **Params:** `{ bookingId, customerKey }`.
- **Behavior:** stage-then-confirm like booking, OR require the model to confirm in-turn before calling. Mark cancelled in the store; return `{ ok: true }`.

### 7.9 `get_clinic_info`
- **Purpose:** hours, address, phone, parking — grounds FAQ answers.
- **Params:** `{ topic?: "hours"|"location"|"contact"|"parking" }`.
- **Behavior:** return static facts from a small object.

### 7.10 `escalate_to_human`
- **Purpose:** hand off to real staff (the "escalation to real user" requirement).
- **Params:** `{ reason: string, customerKey: string, transcriptSummary?: string }`.
- **Behavior:** append to an in-memory `escalations` list and **log clearly to the terminal** (e.g. `[ESCALATION] ...`). Return `{ ok: true, ticketId }`. The model should tell the customer a human will follow up.
- **Use when:** the request is out of scope, the customer is upset, a tool repeatedly fails, or the customer explicitly asks for a person.

> **Suggested additional tools (beyond what you asked for), included above because they materially improve a clinic concierge:** `list_services`, `get_service_info`, and `get_clinic_info` keep the model grounded so it never invents treatments, prices, or opening hours; `get_my_appointments` and `cancel_appointment` round out the appointment lifecycle; the staged `book_appointment` + `confirm_booking` split is what makes bookings safe. Keep them all narrow.

### 7.11 Registry (`tools/registry.js`)
Exports:
- `toolSchemas` — array in OpenAI `tools` format (`{ type: "function", function: { name, description, parameters } }`).
- `handlers` — `{ [name]: async (args, ctx) => result }`.

Keeping schema + handler names in one registry guarantees they never drift apart.

---

## 8. System prompt (`prompt/systemPrompt.js`)

Build the system prompt to enforce **role, scope, grounding, language, and the confirmation contract**. It must include, in substance:

- **Identity & role:** "You are the AI concierge for Aura Aesthetic Clinic. You help customers with clinic services, prices, availability, booking / rescheduling / cancelling appointments, their own account info, and general clinic info (hours, location)."
- **Scope limit:** "If a request is unrelated to the clinic (medical diagnosis, anything outside our services, general chit-chat that goes nowhere useful), politely say you can only help with Aura's services and bookings. Do not attempt to answer out-of-scope questions."
- **No medical advice:** "You are not a doctor. Do not diagnose, recommend treatments for medical conditions, or give clinical/medical advice. For medical concerns, use `escalate_to_human`."
- **Grounding rule:** "Never state a price, duration, service, or opening hour from memory. Always get it from a tool (`list_services`, `get_service_info`, `get_clinic_info`). If a tool has no answer, say so — do not guess."
- **Booking confirmation contract:** "To book, first call `check_availability`, propose slots, then `book_appointment` to stage it. Read the summary back to the customer and wait for an explicit yes before calling `confirm_booking`. Never finalize without confirmation."
- **Customer data scope:** "Only ever discuss the current customer's own information."
- **Language / Singlish:** "Customers may write in English or Singlish (e.g. 'can book facial tmr ah', 'how much the laser one leh', 'my appt still on or not'). Understand Singlish naturally. Reply in clear, warm, friendly English (you may mirror a light, professional Singaporean tone), but keep replies easy to understand. Do not mock the customer's language."
- **Tone:** concise, warm, professional; short messages suitable for chat.
- **Escalation:** "If unsure, if the customer is upset, or if a tool keeps failing, use `escalate_to_human` rather than guessing."

Keep the prompt a single composed string/const so tests can import and (later) snapshot it.

---

## 9. Output validation (`util/validateOutput.js`)

Before returning a reply:
- Enforce a max length (e.g. truncate/soften > ~1500 chars).
- Strip any accidental leak of the system prompt or raw tool JSON (simple checks: no `"role":"system"`, no raw stringified schema).
- If the final content is empty (model returned only tool calls with no text), substitute a safe fallback ("Sorry, something went wrong on my end — let me get a team member to help." + trigger escalation).
- This is a soft catch-all, not the security boundary — the real boundary is the tool set (§10).

---

## 10. Guardrails summary

Layered; distinguish **hard** (structurally enforced) from **soft** (instruction-steered):

1. **Input filtering (soft):** length cap, empty check, per-session rate hook.
2. **System prompt scope (soft):** role, out-of-scope refusal, no-medical-advice, grounding, Singlish handling.
3. **Tool permissioning (HARD):** the model can only ever invoke the ~11 defined handlers with schema-shaped args. No arbitrary DB/query access. Customer-data handlers ignore any `customerKey` that doesn't match `ctx.customerKey`.
4. **Confirmation for sensitive actions (HARD):** booking and cancellation use stage → explicit yes → confirm. A single model turn cannot finalize.
5. **Output validation (soft):** last check before send.

---

## 11. Testing (Vitest, live LLM)

**Objective:** verify that, for a given customer message, the assistant **selects the correct tool(s)**. Tests call the **real OpenAI API** (live), so they require `OPENAI_API_KEY` in the environment and are somewhat non-deterministic — assert on **tool selection**, not exact wording.

### 11.1 Test helper (`test/helpers/runTurn.js`)
`runTurn(text, { sessionId, seedHistory?, seedPending? })` → `{ reply, toolCalls }`. It spins up a fresh session, optionally seeds history/pending state, runs `processMessage`, and returns the captured `toolCalls` array.

### 11.2 What to assert
- `expect(toolCalls).toContain("check_availability")` etc. — the **primary** assertion.
- For multi-step flows, assert order or membership (e.g. booking flow includes `check_availability` before `book_appointment`).
- Assert that sensitive flows do **not** jump straight to `confirm_booking` without a staged `pending.booking`.
- For out-of-scope inputs, assert **no** action tool is called (and ideally `escalate_to_human` or a plain refusal).
- Keep wording assertions loose (e.g. reply is non-empty, or contains a link for a confirmed booking) since the LLM phrasing varies.

### 11.3 Robustness for live tests
- Set a per-test timeout (LLM latency), e.g. 20s.
- Allow a small retry (1 retry) to absorb rare model variance, but if a scenario needs many retries, the prompt/description needs fixing — that's a signal, not a flake.
- Use a cheaper/faster model via `OPENAI_MODEL` for tests if desired.

### 11.4 Scenario matrix (implement each as a test case)

| # | Customer message | Expected tool(s) | Notes |
|---|---|---|---|
| 1 | "What treatments do you offer?" | `list_services` | grounding |
| 2 | "How much is the HydraFacial?" | `get_service_info` | price from tool, not memory |
| 3 | "Can I book a facial for tomorrow?" | `check_availability` (→ then `book_appointment` after slot chosen) | multi-step |
| 4 | "Yes confirm the 2pm one" (with staged `pending.booking`) | `confirm_booking` | returns artificial link |
| 5 | "Is my appointment still on?" | `get_my_appointments` | scoped to customer |
| 6 | "What's on my account?" | `get_customer_info` | checks mock DB |
| 7 | "I want to cancel my appointment" | `cancel_appointment` (staged/confirm) | sensitive |
| 8 | "What time do you close today?" | `get_clinic_info` | FAQ grounding |
| 9 | "I want to speak to a real person" | `escalate_to_human` | explicit ask |
| 10 | "Can you diagnose why my skin is peeling?" | `escalate_to_human` or refusal, **no** service tool | no medical advice |
| 11 | "What's the weather today?" | none (polite out-of-scope refusal) | scope limit |
| 12 (Singlish) | "eh can book facial for me tmr ah" | `check_availability` | Singlish→booking |
| 13 (Singlish) | "how much the laser one leh" | `get_service_info` | Singlish→price |
| 14 (Singlish) | "my appt still on or not" | `get_my_appointments` | Singlish→lookup |
| 15 (Singlish) | "wah your service damn ex sia, got cheaper anot" | `list_services`/`get_service_info`, **no** invented discount | must not promise unauthorized discounts |

Put 1–11 in `toolSelection.test.js`, 12–15 in `singlish.test.js`.

---

## 12. Future / production notes (do not build now, don't block later)
- Replace CLI with the **WhatsApp Cloud API webhook**: webhook handler validates + enqueues + acks fast; a worker runs `processMessage`; reply goes out via the WhatsApp send API. `processMessage` stays unchanged.
- Add a **per-customer queue** (e.g. BullMQ keyed by phone number) so rapid successive messages from one customer process in order while different customers run in parallel.
- Swap in **Redis** (hot session) + **Supabase/Postgres** (durable transcript + real appointments/customers).
- Replace simulated tools with real calendar (Google Calendar / clinic PMS) and real customer DB.

---

## 13. Deliverables checklist for the coding agent
- [ ] `package.json` (ESM, scripts: `start`, `dev` (CLI), `test`).
- [ ] `.env.example` with `OPENAI_API_KEY=`, `OPENAI_MODEL=gpt-4o-mini` (or chosen model).
- [ ] Express server (`/message` POST, `/health` GET) + CLI harness, both calling `processMessage`.
- [ ] All ~11 tools with schemas + handlers wired through the registry.
- [ ] Mock data files (services, customers, appointments).
- [ ] System prompt per §8 (incl. Singlish + grounding + confirmation contract).
- [ ] Staged booking/cancel confirmation flow.
- [ ] Output validation.
- [ ] Vitest scenario suite per §11 calling the live LLM, asserting tool selection.
- [ ] README-level run instructions (how to set env, run `dev`, run `test`).
