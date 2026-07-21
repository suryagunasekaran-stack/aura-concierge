import { getOpenAIClient } from "./client.js";
import { OPENAI_MODEL, MAX_TOOL_LOOP_ITERATIONS } from "../config.js";
import { toolSchemas, handlers } from "../tools/registry.js";
import { escalateToHuman } from "../tools/escalateToHuman.js";
import { logger } from "../util/logger.js";

/**
 * Run the OpenAI tool-calling loop until the model returns a final text reply
 * or max iterations are exceeded.
 *
 * @param {Array<object>} messages - mutable message array (system + history + user)
 * @param {{ sessionId: string, customerKey: string }} ctx
 * @returns {Promise<{ text: string, toolCalls: string[] }>}
 */
export async function runToolLoop(messages, ctx) {
  const openai = getOpenAIClient();
  const toolCalls = [];

  for (let i = 0; i < MAX_TOOL_LOOP_ITERATIONS; i++) {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      tools: toolSchemas,
      tool_choice: "auto",
    });

    const msg = response.choices[0]?.message;
    if (!msg) {
      logger.warn("Empty LLM response");
      return {
        text: "Sorry, something went wrong on my end — let me get a team member to help.",
        toolCalls,
      };
    }

    messages.push(msg);

    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      return { text: msg.content || "", toolCalls };
    }

    for (const call of msg.tool_calls) {
      const name = call.function?.name;
      toolCalls.push(name);

      let args = {};
      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch (err) {
        logger.warn(`Failed to parse args for ${name}:`, err.message);
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify({
            ok: false,
            error: "invalid_json_arguments",
          }),
        });
        continue;
      }

      const handler = handlers[name];
      let result;
      if (!handler) {
        result = { ok: false, error: `unknown_tool:${name}` };
      } else {
        // Always scope customerKey to session; ignore model-supplied foreign keys
        const scopedArgs = { ...args, customerKey: ctx.customerKey };
        result = await handler(scopedArgs, ctx);
      }

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  // Runaway loop — escalate
  logger.warn("Tool loop exceeded max iterations");
  await escalateToHuman(
    {
      reason: "tool_loop_exceeded_max_iterations",
      customerKey: ctx.customerKey,
      transcriptSummary: "Assistant hit max tool-loop iterations without a final reply.",
    },
    ctx
  );
  toolCalls.push("escalate_to_human");

  return {
    text: "Sorry, something went wrong on my end — let me get a team member to help.",
    toolCalls,
  };
}
