/** In-memory consultation requests */

let consultationSeq = 6000;

/** @type {Array<{ consultationId: string, customerKey: string, customerName: string, customerEmail: string, concern: string, preferredLocation: string, notes?: string, status: string, createdAt: string }>} */
const consultations = [];

const LOCATIONS = {
  "holland-village": "AURA Medical Aesthetics, One Holland Village — 7 Holland Village Way #03-09",
  "palais": "AURA Clinic, Palais Renaissance — 390 Orchard Road #03-02/03",
  "either": "No preference — team will suggest nearest slot",
};

/**
 * @param {{ customerKey: string, customerName: string, customerEmail: string, concern: string, preferredLocation: string, notes?: string }} data
 */
export function createConsultationRequest(data) {
  consultationSeq += 1;
  const entry = {
    consultationId: `con-${consultationSeq}`,
    customerKey: data.customerKey,
    customerName: data.customerName,
    customerEmail: data.customerEmail.trim().toLowerCase(),
    concern: data.concern,
    preferredLocation: data.preferredLocation,
    locationLabel: LOCATIONS[data.preferredLocation] || data.preferredLocation,
    notes: data.notes || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  consultations.push(entry);
  return entry;
}

export function listConsultations() {
  return [...consultations];
}

export function resetConsultationsForTests() {
  consultations.length = 0;
  consultationSeq = 6000;
}

export { LOCATIONS };
