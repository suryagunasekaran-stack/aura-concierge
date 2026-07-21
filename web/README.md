# AURA Concierge — Web MVP

WhatsApp-style chat UI for the Aura Aesthetic Clinic AI concierge demo.

## Local development

Run both processes:

```bash
# Terminal 1 — Express backend (port 3000)
npm start

# Terminal 2 — Next.js frontend (port 3001)
npm run web:dev
```

Open [http://localhost:3001](http://localhost:3001).

The frontend proxies chat requests to the backend via `POST /api/chat`, so no CORS setup is needed on Express.

## Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:3000` | Express API base URL |

## Demo session

The UI uses the seeded Gold member **Mei Ling** (`+6591234567`) so package lookup, booking, and customer tools work out of the box.

## Deploy to Vercel

1. Set **Root Directory** to `web`.
2. Add environment variable `BACKEND_URL` pointing to your deployed Express API.
3. Deploy.

The Express backend is not deployed by this app — host it separately (Railway, Render, Fly.io, etc.) and point `BACKEND_URL` at it.
