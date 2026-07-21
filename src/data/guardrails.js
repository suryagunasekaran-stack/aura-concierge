/** In-memory guardrail / rejection event log */

let rejectionSeq = 8000;

/** @type {Array<{ rejectionId: string, customerKey: string, category: string, reason: string, messageSummary?: string, source: string, createdAt: string }>} */
const rejections = [];

const REPLY_TEMPLATES = {
  out_of_scope:
    "I'm here to help with Aura Aesthetic Clinic — services, bookings, appointments, and clinic info. I can't help with that, but happy to assist with anything clinic-related!",
  trolling:
    "I'm here to help with Aura's services and bookings. Let me know if you'd like info on treatments, availability, or an appointment.",
  abusive:
    "I'm not able to continue this conversation in that tone. If you need help with Aura's services or bookings, I'm happy to assist respectfully.",
  spam:
    "I didn't quite catch that. If you need help with Aura's services or bookings, just let me know!",
  prompt_injection:
    "I can only help with Aura Aesthetic Clinic services and bookings. How can I assist you today?",
  off_topic:
    "That one's a bit outside what I can help with here — I'm Aura's clinic concierge. Want to know about our treatments, hours, or booking an appointment?",
};

/**
 * @param {{ customerKey: string, category: string, reason: string, messageSummary?: string, source?: string }} data
 */
export function recordRejection(data) {
  rejectionSeq += 1;
  const entry = {
    rejectionId: `rej-${rejectionSeq}`,
    customerKey: data.customerKey,
    category: data.category,
    reason: data.reason,
    messageSummary: data.messageSummary || "",
    source: data.source || "reject_request",
    createdAt: new Date().toISOString(),
  };
  rejections.push(entry);
  return entry;
}

/**
 * @param {string} category
 */
export function getSuggestedReply(category) {
  return (
    REPLY_TEMPLATES[category] ||
    REPLY_TEMPLATES.out_of_scope
  );
}

export function listRejections() {
  return [...rejections];
}

/** Test helper */
export function resetGuardrailsForTests() {
  rejections.length = 0;
  rejectionSeq = 8000;
}

export { REPLY_TEMPLATES };
