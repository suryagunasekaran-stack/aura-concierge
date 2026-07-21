import {
  cancelAppointment as cancelInStore,
  getAppointment,
  listAppointments,
} from "../data/appointments.js";
import * as sessionStore from "../session/store.js";

/**
 * Stage-then-confirm cancellation.
 * @param {{ bookingId?: string, customerKey?: string, confirm?: boolean }} args
 * @param {{ sessionId: string, customerKey: string }} ctx
 */
export async function cancelAppointment(args = {}, ctx) {
  try {
    const customerKey = ctx.customerKey;
    const session = sessionStore.get(ctx.sessionId);
    session.pending = session.pending || {};

    // Finalize if confirm flag or pending cancel exists and confirm is true
    if (args.confirm === true) {
      const pending = session.pending.cancel;
      const bookingId = args.bookingId || pending?.bookingId;
      if (!bookingId) {
        return { ok: false, reason: "nothing_to_confirm" };
      }
      const cancelled = cancelInStore(bookingId, customerKey);
      if (!cancelled) {
        return { ok: false, reason: "not_found" };
      }
      delete session.pending.cancel;
      sessionStore.set(ctx.sessionId, session);
      return {
        ok: true,
        cancelled: true,
        appointment: cancelled,
      };
    }

    // Stage cancel
    let bookingId = args.bookingId;
    if (!bookingId) {
      const upcoming = listAppointments(customerKey);
      if (upcoming.length === 1) {
        bookingId = upcoming[0].bookingId;
      } else if (upcoming.length === 0) {
        return { ok: false, reason: "no_appointments" };
      } else {
        return {
          ok: false,
          reason: "booking_id_required",
          appointments: upcoming,
          message: "Multiple appointments found; ask which bookingId to cancel.",
        };
      }
    }

    const appt = getAppointment(bookingId, customerKey);
    if (!appt) {
      return { ok: false, reason: "not_found" };
    }
    if (appt.status === "cancelled") {
      return { ok: false, reason: "already_cancelled", appointment: appt };
    }

    session.pending.cancel = {
      bookingId: appt.bookingId,
      serviceName: appt.serviceName,
      date: appt.date,
      time: appt.time,
    };
    sessionStore.set(ctx.sessionId, session);

    return {
      ok: true,
      needsConfirmation: true,
      summary: session.pending.cancel,
      message:
        "Cancellation staged. Confirm with the customer, then call cancel_appointment again with confirm: true.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
