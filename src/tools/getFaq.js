import { searchFaqs, listFaqTopics } from "../data/faqs.js";

/**
 * @param {{ topic?: string, query?: string, listTopics?: boolean }} args
 * @param {object} _ctx
 */
export async function getFaq(args = {}, _ctx) {
  try {
    if (args.listTopics === true) {
      return { ok: true, topics: listFaqTopics() };
    }

    const results = searchFaqs({
      topic: args.topic,
      query: args.query,
    });

    if (results.length === 0) {
      return {
        ok: false,
        reason: "not_found",
        availableTopics: listFaqTopics(),
        message: "No FAQ match — offer to escalate or suggest a consultation.",
      };
    }

    return { ok: true, faqs: results, count: results.length };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
