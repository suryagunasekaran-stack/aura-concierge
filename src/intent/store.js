import { isDbConfigured, query } from "../db/client.js";
import { logger } from "../util/logger.js";

/**
 * @param {{
 *   sessionId: string,
 *   userText: string,
 *   intent: string,
 *   confidence: number,
 *   toolCalls: string[],
 *   replyPreview?: string,
 * }} event
 */
export async function insertIntentEvent(event) {
  if (!isDbConfigured()) return;

  const {
    sessionId,
    userText,
    intent,
    confidence,
    toolCalls,
    replyPreview = null,
  } = event;

  await query(
    `INSERT INTO intent_events
      (session_id, user_text, intent, confidence, tool_calls, reply_preview)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [
      sessionId,
      userText,
      intent,
      confidence,
      JSON.stringify(toolCalls ?? []),
      replyPreview,
    ]
  );
}

/**
 * Fire-and-forget classify + persist. Never throws to callers.
 * @param {{
 *   sessionId: string,
 *   userText: string,
 *   toolCalls: string[],
 *   reply: string,
 *   classify: (text: string, tools: string[]) => Promise<{ intent: string, confidence: number }>,
 * }} args
 */
export function logIntentAsync(args) {
  const { sessionId, userText, toolCalls, reply, classify } = args;
  void (async () => {
    try {
      if (!isDbConfigured()) return;
      const { intent, confidence } = await classify(userText, toolCalls);
      await insertIntentEvent({
        sessionId,
        userText,
        intent,
        confidence,
        toolCalls,
        replyPreview: typeof reply === "string" ? reply.slice(0, 280) : null,
      });
    } catch (err) {
      logger.error("Failed to log intent event:", err);
    }
  })();
}

/**
 * @param {{ limit?: number, intent?: string }} opts
 */
export async function listIntentEvents({ limit = 50, intent } = {}) {
  const capped = Math.min(Math.max(Number(limit) || 50, 1), 200);
  if (intent) {
    const result = await query(
      `SELECT id, session_id, user_text, intent, confidence, tool_calls, reply_preview, created_at
       FROM intent_events
       WHERE intent = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [intent, capped]
    );
    return result.rows;
  }
  const result = await query(
    `SELECT id, session_id, user_text, intent, confidence, tool_calls, reply_preview, created_at
     FROM intent_events
     ORDER BY created_at DESC
     LIMIT $1`,
    [capped]
  );
  return result.rows;
}

export async function getIntentStats() {
  const result = await query(
    `SELECT intent, COUNT(*)::int AS count
     FROM intent_events
     GROUP BY intent
     ORDER BY count DESC`
  );
  const totalResult = await query(`SELECT COUNT(*)::int AS total FROM intent_events`);
  return {
    total: totalResult.rows[0]?.total ?? 0,
    byIntent: result.rows,
  };
}

export async function deleteAllIntentEvents() {
  const result = await query(`DELETE FROM intent_events RETURNING id`);
  return { deleted: result.rowCount ?? 0 };
}
