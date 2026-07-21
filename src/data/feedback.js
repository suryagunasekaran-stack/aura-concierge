/** In-memory feedback and survey responses */

let feedbackSeq = 7000;

/** @type {Array<{ feedbackId: string, customerKey: string, rating?: number, comment?: string, surveyType?: string, surveyResponses?: Array<{ questionId: string, question: string, answer: string }>, createdAt: string }>} */
const feedbackEntries = [];

export const surveyTemplates = {
  post_visit: {
    title: "Post-visit survey",
    questions: [
      {
        id: "overall",
        question: "How would you rate your overall visit experience (1–5)?",
      },
      {
        id: "staff",
        question: "How friendly and professional was our staff (1–5)?",
      },
      {
        id: "recommend",
        question: "Would you recommend Aura to a friend? (yes/no/maybe)",
      },
    ],
  },
  general: {
    title: "General feedback",
    questions: [
      {
        id: "satisfaction",
        question: "How satisfied are you with Aura overall (1–5)?",
      },
      {
        id: "improve",
        question: "What could we improve?",
      },
    ],
  },
  booking_experience: {
    title: "Booking experience survey",
    questions: [
      {
        id: "ease",
        question: "How easy was it to book (1–5)?",
      },
      {
        id: "clarity",
        question: "Was the booking information clear? (yes/no)",
      },
    ],
  },
};

/**
 * @param {{ customerKey: string, rating?: number, comment?: string, surveyType?: string, surveyResponses?: Array<{ questionId: string, question: string, answer: string }> }} data
 */
export function submitFeedback(data) {
  feedbackSeq += 1;
  const entry = {
    feedbackId: `fb-${feedbackSeq}`,
    customerKey: data.customerKey,
    rating: data.rating,
    comment: data.comment || "",
    surveyType: data.surveyType || "general",
    surveyResponses: data.surveyResponses || [],
    createdAt: new Date().toISOString(),
  };
  feedbackEntries.push(entry);
  return entry;
}

export function listFeedback() {
  return [...feedbackEntries];
}

/** Test helper */
export function resetFeedbackForTests() {
  feedbackEntries.length = 0;
  feedbackSeq = 7000;
}
