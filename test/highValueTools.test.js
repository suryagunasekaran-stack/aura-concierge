import { describe, it, expect, beforeEach } from "vitest";
import { rescheduleAppointmentTool } from "../src/tools/rescheduleAppointment.js";
import { getPromotions } from "../src/tools/getPromotions.js";
import { getFaq } from "../src/tools/getFaq.js";
import { requestConsultation } from "../src/tools/requestConsultation.js";
import {
  getAppointment,
  resetAppointmentsForTests,
} from "../src/data/appointments.js";
import { resetConsultationsForTests } from "../src/data/consultations.js";
import * as sessionStore from "../src/session/store.js";
import { runTurn, withRetry } from "./helpers/runTurn.js";

const ctx = { sessionId: "+6591234567", customerKey: "+6591234567" };
const hasKey = Boolean(process.env.OPENAI_API_KEY);

describe("high-value tools (unit)", () => {
  beforeEach(() => {
    resetAppointmentsForTests();
    resetConsultationsForTests();
    sessionStore.reset(ctx.sessionId);
  });

  it("get_promotions returns trial prices from catalogue", async () => {
    const result = await getPromotions({ query: "crystal clear" }, ctx);
    expect(result.ok).toBe(true);
    expect(result.promotions.length).toBeGreaterThan(0);
    expect(result.promotions[0].promoPriceSGD).toBe(128);
  });

  it("get_faq answers downtime question", async () => {
    const result = await getFaq({ query: "downtime emerald peel" }, ctx);
    expect(result.ok).toBe(true);
    expect(result.faqs[0].answer.toLowerCase()).toMatch(/downtime|redness/);
  });

  it("get_faq lists topics", async () => {
    const result = await getFaq({ listTopics: true }, ctx);
    expect(result.ok).toBe(true);
    expect(result.topics).toContain("aftercare");
  });

  it("request_consultation creates consult with booking link", async () => {
    const result = await requestConsultation(
      {
        customerName: "Mei Ling",
        customerEmail: "meiling@example.com",
        concern: "acne and unsure which facial",
        preferredLocation: "holland-village",
      },
      ctx
    );
    expect(result.ok).toBe(true);
    expect(result.consultationId).toMatch(/^con-/);
    expect(result.bookingLink).toContain("aura-clinic.example/consultation/");
  });

  it("reschedule_appointment stages then confirms", async () => {
    const staged = await rescheduleAppointmentTool(
      { newDate: "2026-07-28", newTime: "10:30" },
      ctx
    );
    expect(staged.ok).toBe(true);
    expect(staged.needsConfirmation).toBe(true);

    const confirmed = await rescheduleAppointmentTool({ confirm: true }, ctx);
    expect(confirmed.ok).toBe(true);
    expect(confirmed.rescheduled).toBe(true);

    const appt = getAppointment("bk-9001", ctx.customerKey);
    expect(appt.date).toBe("2026-07-28");
    expect(appt.time).toBe("10:30");
  });
});

describe.skipIf(!hasKey)("high-value tools (live LLM)", () => {
  it("promo question → get_promotions", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "got any promo or trial price for emerald peel?"
      );
      expect(toolCalls).toContain("get_promotions");
      expect(reply.length).toBeGreaterThan(0);
      expect(reply).toMatch(/188|380|trial|promo/i);
    });
  }, 25000);

  it("FAQ question → get_faq", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Is there downtime after the emerald peel?"
      );
      expect(toolCalls).toContain("get_faq");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 25000);

  it("consultation request → request_consultation", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "I'm not sure which treatment to pick — can I book a consultation? Name Mei Ling, email meiling@example.com, acne concern, Holland Village preferred"
      );
      expect(toolCalls).toContain("request_consultation");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 25000);

  it("reschedule confirm → reschedule_appointment", async () => {
    await withRetry(async () => {
      const { reply, toolCalls } = await runTurn(
        "Yes confirm the reschedule to 2026-07-28 at 10:30",
        {
          seedPending: {
            reschedule: {
              bookingId: "bk-9001",
              serviceName: "HydraFacial",
              oldDate: "2026-07-25",
              oldTime: "14:00",
              newDate: "2026-07-28",
              newTime: "10:30",
            },
          },
          seedHistory: [
            {
              role: "assistant",
              content:
                "I've staged moving your HydraFacial from 2026-07-25 14:00 to 2026-07-28 10:30. Confirm?",
            },
          ],
        }
      );
      expect(toolCalls).toContain("reschedule_appointment");
      expect(reply.length).toBeGreaterThan(0);
    });
  }, 25000);
});
