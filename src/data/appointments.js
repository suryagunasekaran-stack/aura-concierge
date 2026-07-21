/** In-memory appointments + escalations */

let appointmentSeq = 1000;
let escalationSeq = 5000;

/** @type {Array<{ bookingId: string, customerKey: string, serviceId: string, serviceName: string, date: string, time: string, customerName?: string, customerEmail?: string, location?: string, locationLabel?: string, locationAddress?: string, doctorPreference?: string, doctorLabel?: string, status: string, createdAt: string }>} */
const appointments = [
  {
    bookingId: "bk-9001",
    customerKey: "+6591234567",
    serviceId: "hydra-facial",
    serviceName: "HydraFacial",
    date: "2026-07-25",
    time: "14:00",
    customerName: "Mei Ling",
    customerEmail: "meiling@example.com",
    location: "holland-village-aesthetics",
    locationLabel: "AURA Medical Aesthetics, One Holland Village",
    locationAddress: "7 Holland Village Way #03-09 Singapore 275748",
    doctorPreference: "no-preference",
    doctorLabel: "No preference — next available doctor",
    status: "confirmed",
    createdAt: "2026-07-10T10:00:00.000Z",
  },
];

/** @type {Array<{ ticketId: string, customerKey: string, reason: string, transcriptSummary?: string, createdAt: string }>} */
const escalations = [];

/**
 * @param {{ customerKey: string, serviceId: string, serviceName: string, date: string, time: string, customerName?: string, customerEmail?: string, location?: string, locationLabel?: string, locationAddress?: string, doctorPreference?: string, doctorLabel?: string }} data
 */
export function createAppointment(data) {
  appointmentSeq += 1;
  const booking = {
    bookingId: `bk-${appointmentSeq}`,
    customerKey: data.customerKey,
    serviceId: data.serviceId,
    serviceName: data.serviceName,
    date: data.date,
    time: data.time,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    location: data.location,
    locationLabel: data.locationLabel,
    locationAddress: data.locationAddress,
    doctorPreference: data.doctorPreference,
    doctorLabel: data.doctorLabel,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  appointments.push(booking);
  return booking;
}

/**
 * @param {string} customerKey
 * @param {{ includeCancelled?: boolean }} [opts]
 */
export function listAppointments(customerKey, opts = {}) {
  return appointments.filter(
    (a) =>
      a.customerKey === customerKey &&
      (opts.includeCancelled || a.status !== "cancelled")
  );
}

/**
 * @param {string} bookingId
 * @param {string} customerKey
 */
export function getAppointment(bookingId, customerKey) {
  return (
    appointments.find(
      (a) => a.bookingId === bookingId && a.customerKey === customerKey
    ) || null
  );
}

/**
 * @param {string} bookingId
 * @param {string} customerKey
 */
export function cancelAppointment(bookingId, customerKey) {
  const appt = getAppointment(bookingId, customerKey);
  if (!appt) return null;
  if (appt.status === "cancelled") return appt;
  appt.status = "cancelled";
  return appt;
}

/**
 * @param {string} bookingId
 * @param {string} customerKey
 * @param {string} newDate
 * @param {string} newTime
 */
export function rescheduleAppointment(bookingId, customerKey, newDate, newTime) {
  const appt = getAppointment(bookingId, customerKey);
  if (!appt || appt.status === "cancelled") return null;
  appt.date = newDate;
  appt.time = newTime;
  appt.status = "confirmed";
  return appt;
}

/**
 * @param {{ customerKey: string, reason: string, transcriptSummary?: string }} data
 */
export function createEscalation(data) {
  escalationSeq += 1;
  const ticket = {
    ticketId: `esc-${escalationSeq}`,
    customerKey: data.customerKey,
    reason: data.reason,
    transcriptSummary: data.transcriptSummary || "",
    createdAt: new Date().toISOString(),
  };
  escalations.push(ticket);
  return ticket;
}

export function listEscalations() {
  return [...escalations];
}

/** Test helpers */
export function resetAppointmentsForTests() {
  appointments.length = 0;
  appointments.push({
    bookingId: "bk-9001",
    customerKey: "+6591234567",
    serviceId: "hydra-facial",
    serviceName: "HydraFacial",
    date: "2026-07-25",
    time: "14:00",
    customerName: "Mei Ling",
    customerEmail: "meiling@example.com",
    location: "holland-village-aesthetics",
    locationLabel: "AURA Medical Aesthetics, One Holland Village",
    locationAddress: "7 Holland Village Way #03-09 Singapore 275748",
    doctorPreference: "no-preference",
    doctorLabel: "No preference — next available doctor",
    status: "confirmed",
    createdAt: "2026-07-10T10:00:00.000Z",
  });
  appointmentSeq = 1000;
  escalations.length = 0;
  escalationSeq = 5000;
}

export { appointments, escalations };
