import { createEscalation } from "../data/appointments.js";
import { logger } from "../util/logger.js";

/**
 * @param {{ reason: string, customerKey?: string, transcriptSummary?: string }} args
 * @param {{ customerKey: string }} ctx
 */
export async function escalateToHuman(args = {}, ctx) {
  try {
    const reason = args.reason || "unspecified";
    const ticket = createEscalation({
      customerKey: ctx.customerKey,
      reason,
      transcriptSummary: args.transcriptSummary,
    });
    logger.escalation(
      `ticket=${ticket.ticketId} customer=${ctx.customerKey} reason=${reason}`
    );
    return {
      ok: true,
      ticketId: ticket.ticketId,
      message:
        "Escalation recorded. Tell the customer a team member will follow up shortly.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
