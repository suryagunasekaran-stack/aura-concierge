/** Valid location and doctor options for appointment booking */

export const BOOKING_LOCATIONS = {
  "holland-village-clinic": {
    id: "holland-village-clinic",
    label: "AURA Clinic, One Holland Village",
    address: "7 Holland Village Way #03-10 Singapore 275748",
  },
  "holland-village-aesthetics": {
    id: "holland-village-aesthetics",
    label: "AURA Medical Aesthetics, One Holland Village",
    address: "7 Holland Village Way #03-09 Singapore 275748",
  },
  palais: {
    id: "palais",
    label: "AURA Clinic, Palais Renaissance",
    address: "390 Orchard Road #03-02/03 Singapore 238871",
  },
};

export const DOCTOR_PREFERENCES = {
  "dr-karen-soh": {
    id: "dr-karen-soh",
    label: "Dr Karen Soh",
  },
  "dr-joanna-chan": {
    id: "dr-joanna-chan",
    label: "Dr Joanna Chan",
  },
  "dr-jc": {
    id: "dr-jc",
    label: "Dr Heng Jiacheng (Dr JC)",
  },
  "no-preference": {
    id: "no-preference",
    label: "No preference — next available doctor",
  },
};

/**
 * @param {string} locationId
 */
export function resolveLocation(locationId) {
  return BOOKING_LOCATIONS[locationId] ?? null;
}

/**
 * @param {string} doctorPreference
 */
export function resolveDoctorPreference(doctorPreference) {
  return DOCTOR_PREFERENCES[doctorPreference] ?? null;
}
