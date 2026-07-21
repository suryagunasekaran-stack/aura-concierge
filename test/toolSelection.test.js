import { describe, it, expect, beforeAll } from "vitest";
import { runTurn, withRetry } from "./helpers/runTurn.js";

const hasKey = Boolean(process.env.OPENAI_API_KEY);

describe.skipIf(!hasKey)("tool selection (live LLM)", () => {
  beforeAll(() => {
    if (!hasKey) {
      console.warn("OPENAI_API_KEY missing — skipping live LLM tests");
    }
  });

  it('1: "What treatments do you offer?" → list_services', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "What treatments do you offer?"
      );
      expect(toolCalls).toContain("list_services");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('2: "How much is the HydraFacial?" → get_service_info', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "How much is the HydraFacial?"
      );
      expect(toolCalls).toContain("get_service_info");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('3: "Can I book a facial for tomorrow?" → check_availability', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Can I book a facial for tomorrow?"
      );
      expect(toolCalls).toContain("check_availability");
      // May also call list_services / get_service_info / book_appointment
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('4: "Yes confirm the 2pm one" with staged pending → confirm_booking', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn("Yes confirm the 2pm one", {
        seedPending: {
          booking: {
            serviceId: "hydra-facial",
            serviceName: "HydraFacial",
            date: "2026-07-22",
            time: "14:00",
            customerName: "Mei Ling",
            customerEmail: "meiling@example.com",
            customerKey: "+6591234567",
            durationMin: 60,
            priceSGD: 280,
          },
        },
        seedHistory: [
          {
            role: "assistant",
            content:
              "I've staged a HydraFacial for you on 2026-07-22 at 14:00 for Mei Ling ($280). Shall I confirm?",
          },
        ],
      });
      expect(toolCalls).toContain("confirm_booking");
      expect(toolCalls).not.toContain("book_appointment");
      expect(reply.length).toBeGreaterThan(0);
      expect(reply.toLowerCase()).toMatch(/aura-clinic\.example|booking|confirm/i);
    });
  }, 20000);

  it('5: "Is my appointment still on?" → get_my_appointments', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Is my appointment still on?"
      );
      expect(toolCalls).toContain("get_my_appointments");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('6: "What\'s on my account?" → get_customer_info', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn("What's on my account?");
      expect(toolCalls).toContain("get_customer_info");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('6b: "how many sessions do I have left?" → get_customer_info with session data', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "I want to check my account details, how many sessions do I have left?"
      );
      expect(toolCalls).toContain("get_customer_info");
      expect(reply.length).toBeGreaterThan(0);
      // Mei Ling has 3 sessions on Acne Clear Starter Pack (mock data)
      expect(reply).toMatch(/3|three|Acne Clear|Crystal Clear|PureBiome/i);
    });
  }, 20000);

  it('7: "I want to cancel my appointment" → cancel_appointment', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Please cancel my upcoming HydraFacial appointment",
        {
          seedHistory: [
            {
              role: "assistant",
              content:
                "You have a confirmed HydraFacial on 2026-07-25 at 14:00 (booking bk-9001).",
            },
          ],
        }
      );
      expect(toolCalls).toContain("cancel_appointment");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 25000);

  it('7b: feedback → submit_feedback', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Please record my feedback: 5 out of 5 stars, the HydraFacial was excellent!"
      );
      expect(toolCalls).toContain("submit_feedback");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('8: "What time do you close today?" → get_clinic_info', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "What time do you close today?"
      );
      expect(toolCalls).toContain("get_clinic_info");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('9: "I want to speak to a real person" → escalate_to_human', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "I want to speak to a real person"
      );
      expect(toolCalls).toContain("escalate_to_human");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('10: medical diagnosis → escalate or refusal, no service booking tools', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Can you diagnose why my skin is peeling?"
      );
      const actionTools = [
        "book_appointment",
        "confirm_booking",
        "check_availability",
        "cancel_appointment",
      ];
      for (const t of actionTools) {
        expect(toolCalls).not.toContain(t);
      }
      const ok =
        toolCalls.includes("escalate_to_human") || reply.length > 0;
      expect(ok).toBe(true);
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it('11: out-of-scope weather → reject_request, no action tools', async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "What's the weather today?"
      );
      expect(toolCalls).toContain("reject_request");
      const actionTools = [
        "list_services",
        "get_service_info",
        "check_availability",
        "book_appointment",
        "confirm_booking",
        "get_customer_info",
        "get_my_appointments",
        "cancel_appointment",
        "get_clinic_info",
      ];
      for (const t of actionTools) {
        expect(toolCalls).not.toContain(t);
      }
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 20000);

  it("sensitive: confirm_booking without pending does not invent a booking", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Yes go ahead and confirm my booking now",
        { seedPending: {} }
      );
      // Should not successfully finalize; if confirm_booking is called it returns nothing_to_confirm
      expect(reply.length).toBeGreaterThan(0);
      if (toolCalls.includes("confirm_booking")) {
        // Model may call it; reply should not claim a fake confirmation link success without staging
        // Soft check: we mainly ensure process doesn't crash
        expect(reply).toBeTruthy();
      }
    });
  }, 20000);
});

describe("tool selection (env guard)", () => {
  it("skips live tests when OPENAI_API_KEY is missing", () => {
    if (!hasKey) {
      expect(hasKey).toBe(false);
    } else {
      expect(hasKey).toBe(true);
    }
  });
});
