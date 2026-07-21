import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const PORT = Number(process.env.PORT) || 3000;

const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_MESSAGES = 20;
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_TOOL_LOOP_ITERATIONS = 5;
const DEFAULT_SESSION_ID = "+6591234567";

function requireApiKey() {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required. Copy .env.example to .env and set your key."
    );
  }
  return OPENAI_API_KEY;
}

export {
  OPENAI_API_KEY,
  OPENAI_MODEL,
  PORT,
  MAX_MESSAGE_LENGTH,
  MAX_HISTORY_MESSAGES,
  SESSION_TTL_MS,
  MAX_TOOL_LOOP_ITERATIONS,
  DEFAULT_SESSION_ID,
  requireApiKey,
};
