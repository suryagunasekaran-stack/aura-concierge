import { MAX_MESSAGE_LENGTH, MAX_HISTORY_MESSAGES } from "./config.js";
import * as sessionStore from "./session/store.js";
import { systemPrompt } from "./prompt/systemPrompt.js";
import { runToolLoop } from "./llm/loop.js";
import { validateOutput } from "./util/validateOutput.js";
import { checkInputGuard } from "./util/inputGuard.js";
import { logger } from "./util/logger.js";
import { classifyIntent } from "./intent/classify.js";
import { logIntentAsync } from "./intent/store.js";
import {
  buildKnowledgeBlock,
  listTrainingDocumentsFull,
} from "./training/store.js";
import { noTrainingKnowledgeBlock } from "./training/noTrainingBlock.js";

const RESET_PHRASES = ["start over", "reset", "new booking", "restart lah"];

/**
 * Per-session rate check hook (MVP stub — always allows).
 * @param {string} _sessionId
 * @returns {{ ok: boolean, error?: string }}
 */
function checkRateLimit(_sessionId) {
  return { ok: true };
}

/**
 * Orchestrator: process one customer message and return reply + toolCalls.
 *
 * @param {string} sessionId
 * @param {string} userText
 * @param {{ knowledgeDocs?: { filename: string, content: string }[] }} [options]
 * @returns {Promise<{ reply: string, toolCalls: string[] }>}
 */
export async function processMessage(sessionId, userText, options = {}) {
  const trimmed = typeof userText === "string" ? userText.trim() : "";

  if (!trimmed) {
    return { reply: "Please send a message and I'll be happy to help.", toolCalls: [] };
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      reply: `That message is a bit long — please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
      toolCalls: [],
    };
  }

  const rate = checkRateLimit(sessionId);
  if (!rate.ok) {
    return { reply: rate.error || "Please slow down a little and try again.", toolCalls: [] };
  }

  const inputGuard = checkInputGuard(trimmed, { customerKey: sessionId });
  if (inputGuard.blocked) {
    logIntentAsync({
      sessionId,
      userText: trimmed,
      toolCalls: ["input_guard"],
      reply: inputGuard.reply,
      classify: classifyIntent,
    });
    return {
      reply: inputGuard.reply,
      toolCalls: ["input_guard"],
    };
  }

  let session = sessionStore.get(sessionId);
  const lower = trimmed.toLowerCase();
  if (RESET_PHRASES.some((p) => lower === p || lower.includes(p))) {
    session = sessionStore.reset(sessionId);
    logger.info(`Session ${sessionId} reset`);
  }

  const ctx = { sessionId, customerKey: sessionId };

  const history = Array.isArray(session.history) ? session.history : [];
  const cappedHistory = history.slice(-MAX_HISTORY_MESSAGES);

  /** Prefer Mindboxs per-client knowledge when provided; else DB training. */
  const overrideDocs = Array.isArray(options.knowledgeDocs)
    ? options.knowledgeDocs.filter(
        (d) => d && typeof d.content === "string" && d.content.trim(),
      )
    : null;

  const trainingDocs =
    overrideDocs && overrideDocs.length > 0
      ? overrideDocs.map((d) => ({
          filename: d.filename || "knowledge.txt",
          content: d.content,
        }))
      : await listTrainingDocumentsFull();

  const knowledgeBlock = buildKnowledgeBlock(trainingDocs);
  const effectiveSystem =
    trainingDocs.length > 0
      ? `${systemPrompt}${knowledgeBlock}`
      : `${systemPrompt}${noTrainingKnowledgeBlock}`;
  if (trainingDocs.length > 0) {
    logger.info(
      `Loaded ${trainingDocs.length} training document(s) for session ${sessionId}` +
        (overrideDocs ? " (client override)" : ""),
    );
  }

  const messages = [
    { role: "system", content: effectiveSystem },
    ...cappedHistory,
    { role: "user", content: trimmed },
  ];

  const { text, toolCalls } = await runToolLoop(messages, ctx);
  const { text: reply, escalated } = await validateOutput(text, ctx);
  const finalToolCalls = escalated
    ? [...toolCalls, "escalate_to_human"]
    : toolCalls;

  session.history = [
    ...history,
    { role: "user", content: trimmed },
    { role: "assistant", content: reply },
  ].slice(-MAX_HISTORY_MESSAGES);

  sessionStore.set(sessionId, session);

  logIntentAsync({
    sessionId,
    userText: trimmed,
    toolCalls: finalToolCalls,
    reply,
    classify: classifyIntent,
  });

  return { reply, toolCalls: finalToolCalls };
}
