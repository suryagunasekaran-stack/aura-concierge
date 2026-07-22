# Aura Aesthetic Clinic — AI Concierge (MVP)

Node.js + Express AI concierge that understands English and Singlish, calls internal tools for services, availability, booking (name + email required), customer info, feedback/surveys, and escalation. A CLI harness stands in for the future WhatsApp webhook; both share `processMessage()`.

The Next.js UI includes chat plus a `/dashboard` for **intent classification** analytics and **knowledge training** (upload `.txt` files that get injected into the system prompt).

## Setup

```bash
cp .env.example .env
# Add your OpenAI API key and DATABASE_URL to .env
npm install
```

### Database (Postgres)

Local Docker:

```bash
npm run db:up
# DATABASE_URL=postgresql://aura:aura@localhost:5432/aura_concierge
npm run db:migrate
```

Or point `DATABASE_URL` at Neon (Vercel Marketplace) / any Postgres and run `npm run db:migrate`.

Without `DATABASE_URL`, chat still works; intent logging and `/training` APIs return 503.

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

- `GET /health` — health check (`database: true|false`)
- `POST /message` — body `{ "sessionId": "+6591234567", "text": "What treatments do you offer?" }`
- `GET /intents`, `GET /intents/stats` — classified turns
- `GET|POST|DELETE /training`, `DELETE /training/:id` — knowledge docs

**Web UI:**

```bash
npm run web:dev
```

- `/` — chat
- `/dashboard` — intents + knowledge (upload `samples/aftercare.txt`)

## Test

Live LLM tests (requires `OPENAI_API_KEY`):

```bash
npm test
```

Tests assert **tool selection**, not exact wording. They call the real OpenAI API.

## Project layout

See [DESIGN.md](./DESIGN.md) for the full spec: tools, system prompt, guardrails, and scenario matrix.
