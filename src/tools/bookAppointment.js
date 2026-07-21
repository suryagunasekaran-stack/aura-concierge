import { findService } from "../data/services.js";
import * as sessionStore from "../session/store.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Stage a booking — does NOT finalize.
 * @param {{ serviceId: string, date: string, time: string, customerName: string, customerEmail: string, customerKey: string }} args
 * @param {{ sessionId: string, customerKey: string }} ctx
 */
export async function bookAppointment(args = {}, ctx) {
  try {
    const customerKey = ctx.customerKey;
    const { serviceId, date, time, customerName, customerEmail } = args;
    if (!serviceId || !date || !time || !customerName || !customerEmail) {
      return {
        ok: false,
        error:
          "serviceId, date, time, customerName, and customerEmail are required",
      };
    }
    if (!isValidEmail(customerEmail)) {
      return { ok: false, error: "customerEmail must be a valid email address" };
    }
    const service = findService({ serviceId });
    if (!service) {
      return { ok: false, reason: "service_not_found" };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { ok: false, error: "date must be YYYY-MM-DD" };
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return { ok: false, error: "time must be HH:MM" };
    }

    const session = sessionStore.get(ctx.sessionId);
    const summary = {
      serviceId: service.id,
      serviceName: service.name,
      date,
      time,
      customerName,
      customerEmail: customerEmail.trim().toLowerCase(),
      customerKey,
      durationMin: service.durationMin,
      priceSGD: service.priceSGD,
    };
    session.pending = session.pending || {};
    session.pending.booking = summary;
    sessionStore.set(ctx.sessionId, session);

    return {
      ok: true,
      needsConfirmation: true,
      summary,
      message:
        "Booking staged. Read the summary back to the customer and wait for an explicit yes before calling confirm_booking.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
