import { createConsultationRequest, LOCATIONS } from "../data/consultations.js";
import { logger } from "../util/logger.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * @param {{ customerName: string, customerEmail: string, concern: string, preferredLocation: string, notes?: string }} args
 * @param {{ customerKey: string }} ctx
 */
export async function requestConsultation(args = {}, ctx) {
  try {
    const { customerName, customerEmail, concern, preferredLocation, notes } =
      args;

    if (!customerName || !customerEmail || !concern || !preferredLocation) {
      return {
        ok: false,
        error:
          "customerName, customerEmail, concern, and preferredLocation are required",
      };
    }
    if (!isValidEmail(customerEmail)) {
      return { ok: false, error: "customerEmail must be a valid email address" };
    }
    if (!LOCATIONS[preferredLocation]) {
      return {
        ok: false,
        error: "invalid preferredLocation",
        validLocations: Object.keys(LOCATIONS),
      };
    }

    const entry = createConsultationRequest({
      customerKey: ctx.customerKey,
      customerName,
      customerEmail,
      concern,
      preferredLocation,
      notes,
    });

    logger.info(
      `[CONSULTATION] id=${entry.consultationId} customer=${ctx.customerKey} location=${preferredLocation}`
    );

    return {
      ok: true,
      consultationId: entry.consultationId,
      locationLabel: entry.locationLabel,
      bookingLink: `https://aura-clinic.example/consultation/${entry.consultationId}`,
      message:
        "Consultation request recorded. Tell the customer our team will contact them to confirm a slot.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
