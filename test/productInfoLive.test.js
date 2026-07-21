import { describe, it, expect, beforeAll } from "vitest";
import { runTurn, withRetry } from "./helpers/runTurn.js";

const hasKey = Boolean(process.env.OPENAI_API_KEY);

describe.skipIf(!hasKey)("product recommendations (live LLM)", () => {
  beforeAll(() => {
    if (!hasKey) {
      console.warn("OPENAI_API_KEY missing — skipping product live LLM tests");
    }
  });

  it("acne + age recommendation → get_product_info, NOT reject_request", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "which facial package do you recommend, i am 25 and my face has lots of acne"
      );
      expect(toolCalls).toContain("get_product_info");
      expect(toolCalls).not.toContain("reject_request");
      expect(reply.length).toBeGreaterThan(0);
      // Should mention at least one AURA acne treatment from mock catalogue
      expect(reply).toMatch(/Crystal Clear|PureBiome|Emerald Peel|Hydrafacial|Acne/i);
    });
  }, 25000);

  it("compare treatments → get_product_info compare mode", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Can you compare Crystal Clear and PureBiome Purifying for acne?"
      );
      expect(toolCalls).toContain("get_product_info");
      expect(toolCalls).not.toContain("reject_request");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 25000);
});
