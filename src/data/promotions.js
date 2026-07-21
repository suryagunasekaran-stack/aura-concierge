/** Mock promotions and trial pricing sourced from auramedical.sg */

export const promotions = [
  {
    id: "promo-crystal-clear-trial",
    name: "Crystal Clear First Trial",
    productId: "crystal-clear",
    usualPriceSGD: 330,
    promoPriceSGD: 128,
    type: "first_trial",
    terms: "T&Cs apply. For first-time customers only.",
    validUntil: "2026-12-31",
  },
  {
    id: "promo-emerald-peel-trial",
    name: "Signature AURA Emerald Peel First Trial",
    productId: "signature-emerald-peel",
    usualPriceSGD: 380,
    promoPriceSGD: 188,
    type: "first_trial",
    terms: "T&Cs apply. For first-time customers only.",
    validUntil: "2026-12-31",
  },
  {
    id: "promo-classic-emerald-trial",
    name: "Classic AURA Emerald Peel First Trial",
    productId: "classic-emerald-peel",
    usualPriceSGD: 280,
    promoPriceSGD: 128,
    type: "first_trial",
    terms: "T&Cs apply. For first-time customers only.",
    validUntil: "2026-12-31",
  },
  {
    id: "promo-purebiome-trial",
    name: "PureBiome Purifying First Trial",
    productId: "purebiome-purifying",
    usualPriceSGD: 380,
    promoPriceSGD: 228,
    type: "first_trial",
    terms: "T&Cs apply. For first-time customers only.",
    validUntil: "2026-12-31",
  },
  {
    id: "promo-acne-starter-pack",
    name: "Acne Clear Starter Pack",
    packageId: "pkg-acne-clear-starter",
    usualPriceSGD: 1320,
    promoPriceSGD: 999,
    type: "package_bundle",
    terms: "4 sessions. Save vs individual treatments.",
    validUntil: "2026-12-31",
  },
  {
    id: "promo-glow-package",
    name: "Glow Facial Package",
    packageId: "pkg-glow-facial",
    usualPriceSGD: 1680,
    promoPriceSGD: 1480,
    type: "package_bundle",
    terms: "6 sessions combining Hydrafacial and Emerald Peel.",
    validUntil: "2026-12-31",
  },
];

/**
 * @param {{ productId?: string, packageId?: string, query?: string }} [filters]
 */
export function getPromotions(filters = {}) {
  let results = [...promotions];
  if (filters.productId) {
    results = results.filter((p) => p.productId === filters.productId);
  }
  if (filters.packageId) {
    results = results.filter((p) => p.packageId === filters.packageId);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.productId && p.productId.includes(q)) ||
        (p.packageId && p.packageId.includes(q))
    );
  }
  return results;
}

export function resetPromotionsForTests() {
  // static data — no-op for API symmetry
}
