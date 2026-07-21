/** Static clinic facts for FAQ grounding — AURA Medical Aesthetics */

export const clinicInfo = {
  name: "AURA Medical Aesthetics",
  group: "AURA Group",
  website: "https://auramedical.sg",
  tagline: "Aesthetic treatments that enhance your AURA",
  foundedBy: "Dr Karen Soh",
  experienceYears: 20,
  brands: {
    auraClinic: "FDA-approved, evidence-based treatments by doctors",
    auraMedicalAesthetics:
      "Medical-grade treatments designed by doctors, delivered by specialists",
  },
  hours: {
    weekday: "10:00–20:00",
    saturday: "10:00–18:00",
    sunday: "Closed",
    publicHoliday: "Closed (or by appointment)",
  },
  locations: [
    {
      name: "AURA Clinic, One Holland Village",
      address: "7 Holland Village Way #03-10 Singapore 275748",
    },
    {
      name: "AURA Medical Aesthetics, One Holland Village",
      address: "7 Holland Village Way #03-09 Singapore 275748",
    },
    {
      name: "AURA Clinic, Palais Renaissance",
      address: "390 Orchard Road #03-02/03 Singapore 238871",
    },
  ],
  contact: {
    phone: "+65 6123 4567",
    whatsapp: "+65 9123 4567",
    email: "hello@aura-clinic.example",
    website: "https://auramedical.sg",
  },
  parking: {
    summary:
      "Parking available at One Holland Village and Palais Renaissance. Contact the clinic for validation details when booking.",
  },
  highlights: [
    "Science-led, evidence-based approach",
    "20 years of experience in medical aesthetics",
    "FDA-approved / FDA-cleared technology",
    "Personalised care by doctors and specialists",
  ],
};

/**
 * @param {"hours"|"location"|"contact"|"parking"|undefined} topic
 */
export function getClinicInfo(topic) {
  if (!topic) {
    return {
      name: clinicInfo.name,
      website: clinicInfo.website,
      tagline: clinicInfo.tagline,
      hours: clinicInfo.hours,
      locations: clinicInfo.locations,
      contact: clinicInfo.contact,
      parking: clinicInfo.parking,
      highlights: clinicInfo.highlights,
    };
  }
  const key = topic.toLowerCase();
  if (key === "hours") return { hours: clinicInfo.hours };
  if (key === "location") return { locations: clinicInfo.locations };
  if (key === "contact") return { contact: clinicInfo.contact };
  if (key === "parking") return { parking: clinicInfo.parking };
  return {
    ok: false,
    reason: "unknown_topic",
    availableTopics: ["hours", "location", "contact", "parking"],
  };
}
