import { listAppointments } from "../data/appointments.js";

/**
 * @param {{ customerKey?: string }} args
 * @param {{ customerKey: string }} ctx
 */
export async function getMyAppointments(args = {}, ctx) {
  try {
    const appointments = listAppointments(ctx.customerKey);
    return { ok: true, appointments };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
