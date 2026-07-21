import { describe, it, expect, beforeAll } from "vitest";
import { runTurn, withRetry } from "./helpers/runTurn.js";

const hasKey = Boolean(process.env.OPENAI_API_KEY);

describe.skipIf(!hasKey)("Singlish scenarios (live LLM)", () => {
  beforeAll(() => {
    if (!hasKey) {
      console.warn("OPENAI_API_KEY missing — skipping Singlish live LLM tests");
    }
  });

  it('12: "eh can book facial for me tmr ah" → check_availability', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "eh can book facial for me tmr ah"
      );
      expect(toolCalls).toContain("check_availability");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('13: "how much the laser one leh" → get_service_info', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "how much the laser one leh"
      );
      expect(toolCalls).toContain("get_service_info");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('14: "my appt still on or not" → get_my_appointments', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn("my appt still on or not");
      expect(toolCalls).toContain("get_my_appointments");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('15: price complaint — list/get service info, no invented discount', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "wah your service damn ex sia, got cheaper anot"
      );
      const grounded =
        toolCalls.includes("list_services") ||
        toolCalls.includes("get_service_info");
      expect(grounded).toBe(true);
      expect(toolCalls).not.toContain("reject_request");
      expect(reply.length).toBeGreaterThan(0);
      // Must not promise unauthorized discounts
      expect(reply.toLowerCase()).not.toMatch(
        /\b(50%|half price|free treatment|i('ll| will) give you .* off)\b/
      );
    });
  }, 20000);
});
