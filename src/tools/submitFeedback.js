import {
  submitFeedback as saveFeedback,
  surveyTemplates,
} from "../data/feedback.js";
import { logger } from "../util/logger.js";

/**
 * Collect customer feedback and optional structured survey responses.
 * @param {{ rating?: number, comment?: string, surveyType?: string, surveyResponses?: Array<{ questionId: string, question: string, answer: string }> }} args
 * @param {{ customerKey: string }} ctx
 */
export async function submitFeedback(args = {}, ctx) {
  try {
    const { rating, comment, surveyType, surveyResponses } = args;

    if (rating != null && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return { ok: false, error: "rating must be an integer from 1 to 5" };
    }

    const hasComment = comment && comment.trim().length > 0;
    const hasSurvey =
      Array.isArray(surveyResponses) && surveyResponses.length > 0;

    if (rating == null && !hasComment && !hasSurvey) {
      return {
        ok: false,
        error: "Provide at least a rating, comment, or surveyResponses",
      };
    }

    if (surveyType && !surveyTemplates[surveyType]) {
      return {
        ok: false,
        reason: "unknown_survey_type",
        availableTypes: Object.keys(surveyTemplates),
      };
    }

    const entry = saveFeedback({
      customerKey: ctx.customerKey,
      rating,
      comment: comment?.trim(),
      surveyType: surveyType || (hasSurvey ? "general" : "general"),
      surveyResponses: hasSurvey ? surveyResponses : undefined,
    });

    logger.info(
      `[FEEDBACK] id=${entry.feedbackId} customer=${ctx.customerKey} rating=${rating ?? "n/a"}`
    );

    return {
      ok: true,
      feedbackId: entry.feedbackId,
      message: "Thank you — your feedback has been recorded.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

/** Expose survey templates for the model via a companion read (optional inline in schema description) */
export async function getSurveyTemplates() {
  return { ok: true, surveys: surveyTemplates };
}
