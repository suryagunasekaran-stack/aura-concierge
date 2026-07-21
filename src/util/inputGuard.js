import { recordRejection, getSuggestedReply } from "../data/guardrails.js";
import { logger } from "./logger.js";

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(your\s+)?(instructions|rules|prompt)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions)/i,
  /show\s+me\s+(your\s+)?(system\s+prompt|instructions)/i,
  /jailbreak/i,
  /DAN\s+mode/i,
  /\bact\s+as\s+(?!a\s+patient|my\s+assistant\s+for\s+booking)/i,
];

const ABUSIVE_PATTERNS = [
  /\b(f+u+c+k|sh+i+t|bitch|bastard|asshole|dumbass)\b/i,
  /\b(stupid\s+bot|useless\s+bot|worst\s+ai)\b/i,
];

const SPAM_PATTERNS = [
  /(.)\1{8,}/, // repeated char
  /^[^a-zA-Z0-9\s]{20,}$/, // long gibberish symbols
];

/**
 * Hard pre-LLM input guard. Returns blocked=true for obvious abuse/injection/spam.
 *
 * @param {string} text
 * @param {{ customerKey?: string }} [ctx]
 * @returns {{ blocked: boolean, category?: string, reply?: string, rejectionId?: string }}
 */
export function checkInputGuard(text, ctx = {}) {
  const trimmed = text.trim();
  const customerKey = ctx.customerKey || "unknown";

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return block("prompt_injection", "Detected prompt injection attempt", trimmed, customerKey);
    }
  }

  for (const pattern of ABUSIVE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return block("abusive", "Detected abusive language", trimmed, customerKey);
    }
  }

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return block("spam", "Detected spam/gibberish input", trimmed, customerKey);
    }
  }

  // Excessive caps shouting (mostly caps, long message)
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20) {
    const upper = letters.replace(/[^A-Z]/g, "").length;
    if (upper / letters.length > 0.85 && /!{2,}/.test(trimmed)) {
      return block("trolling", "Detected shouting/spam pattern", trimmed, customerKey);
    }
  }

  return { blocked: false };
}

function block(category, reason, text, customerKey) {
  const entry = recordRejection({
    customerKey,
    category,
    reason,
    messageSummary: text.slice(0, 200),
    source: "input_guard",
  });
  logger.info(
    `[GUARDRAIL] input_guard category=${category} id=${entry.rejectionId} customer=${customerKey}`
  );
  return {
    blocked: true,
    category,
    reply: getSuggestedReply(category),
    rejectionId: entry.rejectionId,
  };
}
