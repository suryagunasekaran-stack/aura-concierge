import { createAppointment } from "../data/appointments.js";
import * as sessionStore from "../session/store.js";

/**
 * Finalize staged booking after customer confirmation.
 * @param {{ customerKey?: string }} args
 * @param {{ sessionId: string, customerKey: string }} ctx
 */
export async function confirmBooking(args = {}, ctx) {
  try {
    const session = sessionStore.get(ctx.sessionId);
    const pending = session.pending?.booking;
    if (!pending) {
      return { ok: false, reason: "nothing_to_confirm" };
    }

    const booking = createAppointment({
      customerKey: ctx.customerKey,
      serviceId: pending.serviceId,
      serviceName: pending.serviceName,
      date: pending.date,
      time: pending.time,
      customerName: pending.customerName,
      customerEmail: pending.customerEmail,
      location: pending.location,
      locationLabel: pending.locationLabel,
      locationAddress: pending.locationAddress,
      doctorPreference: pending.doctorPreference,
      doctorLabel: pending.doctorLabel,
    });

    delete session.pending.booking;
    sessionStore.set(ctx.sessionId, session);

    return {
      ok: true,
      bookingId: booking.bookingId,
      confirmationLink: `https://aura-clinic.example/booking/${booking.bookingId}`,
      appointment: booking,
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
