# Aura Aesthetic Clinic — AI Concierge (MVP)

Node.js + Express AI concierge that understands English and Singlish, calls internal tools for services, availability, booking (name + email required), customer info, feedback/surveys, and escalation. A CLI harness stands in for the future WhatsApp webhook; both share `processMessage()`.

## Setup

```bash
cp .env.example .env
# Add your OpenAI API key to .env
npm install
```

## Run

**CLI (dev harness):**

```bash
npm run dev
```

Type a message and press Enter. Default session id is `+6591234567` (a seeded customer). Type `exit` to quit.

**HTTP server:**

```bash
npm start
```

- `GET /health` — health check
- `POST /message` — body `{ "sessionId": "+6591234567", "text": "What treatments do you offer?" }`

## Test

Live LLM tests (requires `OPENAI_API_KEY`):

```bash
npm test
```

Tests assert **tool selection**, not exact wording. They call the real OpenAI API.

## Project layout

See [DESIGN.md](./DESIGN.md) for the full spec: tools, system prompt, guardrails, and scenario matrix.
