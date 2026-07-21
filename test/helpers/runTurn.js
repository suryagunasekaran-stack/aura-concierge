import { processMessage } from "../../src/pipeline.js";
import * as sessionStore from "../../src/session/store.js";
import { resetAppointmentsForTests } from "../../src/data/appointments.js";
import { resetFeedbackForTests } from "../../src/data/feedback.js";
import { resetGuardrailsForTests } from "../../src/data/guardrails.js";
import { resetConsultationsForTests } from "../../src/data/consultations.js";

/**
 * Run one customer turn against a fresh (or seeded) session.
 *
 * @param {string} text
 * @param {{ sessionId?: string, seedHistory?: any[], seedPending?: Record<string, any> }} [opts]
 * @returns {Promise<{ reply: string, toolCalls: string[] }>}
 */
export async function runTurn(text, opts = {}) {
  const sessionId = opts.sessionId || "+6591234567";

  resetAppointmentsForTests();
  resetFeedbackForTests();
  resetGuardrailsForTests();
  resetConsultationsForTests();
  sessionStore.reset(sessionId);

  const session = sessionStore.get(sessionId);
  if (opts.seedHistory) {
    session.history = [...opts.seedHistory];
  }
  if (opts.seedPending) {
    session.pending = { ...opts.seedPending };
  }
  sessionStore.set(sessionId, session);

  return processMessage(sessionId, text);
}

/**
 * Retry once on assertion failure to absorb rare live-LLM variance.
 * @param {() => Promise<void>} fn
 */
export async function withRetry(fn) {
  try {
    await fn();
  } catch (firstErr) {
    await fn();
  }
}
