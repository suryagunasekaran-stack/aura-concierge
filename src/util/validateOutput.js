import { MAX_MESSAGE_LENGTH } from "../config.js";
import { escalateToHuman } from "../tools/escalateToHuman.js";
import { logger } from "./logger.js";

const LEAK_PATTERNS = [
  /"role"\s*:\s*"system"/i,
  /You are the AI concierge for Aura Aesthetic Clinic/i,
  /"type"\s*:\s*"function"/i,
  /"parameters"\s*:\s*\{\s*"type"\s*:\s*"object"/i,
];

/**
 * Soft output validation before returning a reply to the customer.
 *
 * @param {string} text
 * @param {{ sessionId: string, customerKey: string }} ctx
 * @param {{ escalateOnEmpty?: boolean }} [opts]
 * @returns {Promise<{ text: string, escalated: boolean }>}
 */
export async function validateOutput(text, ctx, opts = {}) {
  let out = typeof text === "string" ? text : "";
  let escalated = false;

  if (!out.trim()) {
    logger.warn("Empty assistant reply — substituting fallback");
    out =
      "Sorry, something went wrong on my end — let me get a team member to help.";
    if (opts.escalateOnEmpty !== false) {
      await escalateToHuman(
        {
          reason: "empty_assistant_reply",
          customerKey: ctx.customerKey,
        },
        ctx
      );
      escalated = true;
    }
  }

  for (const pattern of LEAK_PATTERNS) {
    if (pattern.test(out)) {
      logger.warn("Possible prompt/tool leak in output — softening reply");
      out =
        "Sorry, I hit a snag formatting that reply. How else can I help with Aura's services or bookings?";
      break;
    }
  }

  if (out.length > MAX_MESSAGE_LENGTH) {
    out =
      out.slice(0, MAX_MESSAGE_LENGTH - 3).trimEnd() +
      "...";
  }

  return { text: out, escalated };
}
