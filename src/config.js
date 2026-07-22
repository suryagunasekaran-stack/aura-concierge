import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const PORT = Number(process.env.PORT) || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "";

const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_MESSAGES = 20;
const SESSION_TTL_MS = 30 * 60 * 1000;
const MAX_TOOL_LOOP_ITERATIONS = 5;
const DEFAULT_SESSION_ID = "+6591234567";
const MAX_TRAINING_BYTES = 100 * 1024;

/** Fixed intent taxonomy for classifier + dashboard filters */
const INTENT_LABELS = [
  "greeting",
  "booking",
  "reschedule_cancel",
  "service_inquiry",
  "product_inquiry",
  "pricing_promo",
  "aftercare_faq",
  "consultation",
  "feedback",
  "escalation",
  "off_topic",
  "other",
];

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
  DATABASE_URL,
  MAX_MESSAGE_LENGTH,
  MAX_HISTORY_MESSAGES,
  SESSION_TTL_MS,
  MAX_TOOL_LOOP_ITERATIONS,
  DEFAULT_SESSION_ID,
  MAX_TRAINING_BYTES,
  INTENT_LABELS,
  requireApiKey,
};
