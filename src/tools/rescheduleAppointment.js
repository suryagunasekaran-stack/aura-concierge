import {
  getAppointment,
  listAppointments,
  rescheduleAppointment,
} from "../data/appointments.js";
import * as sessionStore from "../session/store.js";

/**
 * Stage-then-confirm rescheduling.
 * @param {{ bookingId?: string, newDate?: string, newTime?: string, confirm?: boolean }} args
 * @param {{ sessionId: string, customerKey: string }} ctx
 */
export async function rescheduleAppointmentTool(args = {}, ctx) {
  try {
    const customerKey = ctx.customerKey;
    const session = sessionStore.get(ctx.sessionId);
    session.pending = session.pending || {};

    if (args.confirm === true) {
      const pending = session.pending.reschedule;
      if (!pending) {
        return { ok: false, reason: "nothing_to_confirm" };
      }
      const updated = rescheduleAppointment(
        pending.bookingId,
        customerKey,
        pending.newDate,
        pending.newTime
      );
      if (!updated) {
        return { ok: false, reason: "not_found_or_cancelled" };
      }
      delete session.pending.reschedule;
      sessionStore.set(ctx.sessionId, session);
      return {
        ok: true,
        rescheduled: true,
        appointment: updated,
        confirmationLink: `https://aura-clinic.example/booking/${updated.bookingId}`,
      };
    }

    let bookingId = args.bookingId;
    const { newDate, newTime } = args;

    if (!newDate || !newTime) {
      return { ok: false, error: "newDate and newTime are required to stage a reschedule" };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      return { ok: false, error: "newDate must be YYYY-MM-DD" };
    }
    if (!/^\d{2}:\d{2}$/.test(newTime)) {
      return { ok: false, error: "newTime must be HH:MM" };
    }

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
          message: "Multiple appointments found; specify bookingId.",
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

    session.pending.reschedule = {
      bookingId: appt.bookingId,
      serviceName: appt.serviceName,
      oldDate: appt.date,
      oldTime: appt.time,
      newDate,
      newTime,
    };
    sessionStore.set(ctx.sessionId, session);

    return {
      ok: true,
      needsConfirmation: true,
      summary: session.pending.reschedule,
      message:
        "Reschedule staged. Read old vs new slot back to the customer and wait for explicit yes before calling reschedule_appointment with confirm: true.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
