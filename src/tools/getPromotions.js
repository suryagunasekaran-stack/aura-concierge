import { getPromotions } from "../data/promotions.js";

/**
 * @param {{ productId?: string, packageId?: string, query?: string }} args
 * @param {object} _ctx
 */
export async function getPromotions(args = {}, _ctx) {
  try {
    const promos = getPromotions({
      productId: args.productId,
      packageId: args.packageId,
      query: args.query,
    });
    return {
      ok: true,
      promotions: promos,
      count: promos.length,
      note: "All prices from AURA catalogue. Trial promos are for first-time customers unless stated otherwise.",
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
