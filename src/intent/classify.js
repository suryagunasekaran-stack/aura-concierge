import { INTENT_LABELS, OPENAI_MODEL } from "../config.js";
import { getOpenAIClient } from "../llm/client.js";
import { logger } from "../util/logger.js";

const SYSTEM = `You classify customer messages for an aesthetic clinic AI concierge.
Return ONLY valid JSON: {"intent":"<label>","confidence":0.0-1.0}
Choose exactly one intent from: ${INTENT_LABELS.join(", ")}.
Use tool call names (if any) as hints. Prefer aftercare_faq for prep/downtime/aftercare questions.`;

/**
 * @param {string} userText
 * @param {string[]} toolCalls
 * @returns {Promise<{ intent: string, confidence: number }>}
 */
export async function classifyIntent(userText, toolCalls = []) {
  try {
    const client = getOpenAIClient();
    const toolsHint =
      Array.isArray(toolCalls) && toolCalls.length > 0
        ? `Tools used this turn: ${toolCalls.join(", ")}`
        : "No tools used this turn.";

    const completion = await client.chat.completions.create({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Customer message:\n${userText}\n\n${toolsHint}`,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const intent = INTENT_LABELS.includes(parsed.intent)
      ? parsed.intent
      : "other";
    const confidence =
      typeof parsed.confidence === "number" &&
      parsed.confidence >= 0 &&
      parsed.confidence <= 1
        ? parsed.confidence
        : 0.5;

    return { intent, confidence };
  } catch (err) {
    logger.error("Intent classification failed:", err);
    return { intent: "other", confidence: 0 };
  }
}
