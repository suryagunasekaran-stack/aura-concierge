/** Structured FAQ content for AURA Medical Aesthetics */

export const faqs = [
  {
    id: "prep-before-facial",
    topic: "preparation",
    question: "How should I prepare before a facial?",
    answer:
      "Arrive with a clean face if possible. Avoid retinol, strong acids, or exfoliating treatments 2–3 days before peels or intensive facials. Let us know about allergies, pregnancy, or recent procedures when booking.",
    tags: ["facial", "preparation", "before treatment"],
  },
  {
    id: "downtime-peel",
    topic: "aftercare",
    question: "Is there downtime after the Emerald Peel?",
    answer:
      "Signature AURA Emerald Peel has zero to minimal downtime. You may have mild redness for a few hours. Avoid direct sun and use SPF. Your specialist will advise based on your skin.",
    tags: ["emerald peel", "downtime", "aftercare"],
  },
  {
    id: "downtime-laser",
    topic: "aftercare",
    question: "What aftercare is needed after Acne Laser?",
    answer:
      "Avoid sun exposure and use SPF daily. Skip harsh scrubs for a few days. Mild redness or warmth is normal. Doctor-administered — follow the post-treatment plan given at your session.",
    tags: ["laser", "acne laser", "aftercare"],
  },
  {
    id: "pregnancy",
    topic: "safety",
    question: "Can I do treatments if I'm pregnant or breastfeeding?",
    answer:
      "Many aesthetic treatments are not recommended during pregnancy or breastfeeding. Please inform us when booking — our doctors can advise which services are safe or suggest alternatives.",
    tags: ["pregnancy", "breastfeeding", "safety"],
  },
  {
    id: "first-visit",
    topic: "general",
    question: "What happens on my first visit?",
    answer:
      "You'll be welcomed by our team, discuss your skin concerns with a specialist or doctor, and receive a personalised treatment plan. First-time customers may be eligible for trial pricing — ask about current promotions.",
    tags: ["first visit", "new customer"],
  },
  {
    id: "payment",
    topic: "billing",
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit/debit cards, PayNow, and other common payment methods at the clinic. Package sessions are deducted from your prepaid balance.",
    tags: ["payment", "paynow", "billing"],
  },
  {
    id: "cancel-policy",
    topic: "booking",
    question: "What is your cancellation or rescheduling policy?",
    answer:
      "Please give us at least 24 hours' notice to reschedule or cancel without penalty. Late cancellations may forfeit a session from prepaid packages — contact us and we'll do our best to help.",
    tags: ["cancel", "reschedule", "policy"],
  },
  {
    id: "acne-how-many-sessions",
    topic: "treatments",
    question: "How many sessions do I need for acne?",
    answer:
      "It varies by skin type and severity. Many clients see improvement after 3–4 sessions of targeted facials like Crystal Clear or PureBiome. A consultation helps set a realistic plan — we never guarantee medical outcomes.",
    tags: ["acne", "sessions", "how many"],
  },
  {
    id: "locations",
    topic: "general",
    question: "Where are your clinics?",
    answer:
      "AURA Clinic and AURA Medical Aesthetics at One Holland Village (7 Holland Village Way #03-09/10), and AURA Clinic at Palais Renaissance (390 Orchard Road #03-02/03).",
    tags: ["location", "address", "where"],
  },
  {
    id: "consultation",
    topic: "general",
    question: "Do I need a consultation before booking?",
    answer:
      "Consultation is recommended for first-timers or medical-grade treatments (e.g. laser, injectables). Specialist facials can often be booked directly. We can arrange a complimentary consultation if you're unsure.",
    tags: ["consultation", "booking"],
  },
];

/**
 * @param {{ topic?: string, query?: string }} opts
 */
export function searchFaqs(opts = {}) {
  let results = [...faqs];
  if (opts.topic) {
    const t = opts.topic.toLowerCase();
    results = results.filter(
      (f) => f.topic === t || f.tags.some((tag) => tag.includes(t))
    );
  }
  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.tags.some((tag) => tag.includes(q) || q.includes(tag))
    );
  }
  return results.map(({ id, topic, question, answer, tags }) => ({
    id,
    topic,
    question,
    answer,
    tags,
  }));
}

export function listFaqTopics() {
  return [...new Set(faqs.map((f) => f.topic))];
}
