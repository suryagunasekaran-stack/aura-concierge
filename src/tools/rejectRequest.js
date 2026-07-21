import {
  recordRejection,
  getSuggestedReply,
} from "../data/guardrails.js";
import { logger } from "../util/logger.js";

const VALID_CATEGORIES = [
  "out_of_scope",
  "trolling",
  "abusive",
  "spam",
  "prompt_injection",
  "off_topic",
];

/**
 * Log and handle out-of-scope, trolling, or inappropriate requests.
 * @param {{ category: string, reason: string, messageSummary?: string }} args
 * @param {{ customerKey: string }} ctx
 */
export async function rejectRequest(args = {}, ctx) {
  try {
    const { category, reason, messageSummary } = args;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return {
        ok: false,
        error: "category is required",
        validCategories: VALID_CATEGORIES,
      };
    }
    if (!reason || !reason.trim()) {
      return { ok: false, error: "reason is required" };
    }

    const entry = recordRejection({
      customerKey: ctx.customerKey,
      category,
      reason: reason.trim(),
      messageSummary: messageSummary?.slice(0, 300),
      source: "reject_request",
    });

    logger.info(
      `[GUARDRAIL] reject_request category=${category} id=${entry.rejectionId} customer=${ctx.customerKey} reason=${reason.trim()}`
    );

    return {
      ok: true,
      rejectionId: entry.rejectionId,
      category,
      suggestedReply: getSuggestedReply(category),
      message:
        "Request rejected and logged. Use suggestedReply as the basis for your response — stay polite and redirect to clinic services.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
