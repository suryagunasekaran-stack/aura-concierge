/**
 * AURA Medical Aesthetics product & treatment catalog (mock data sourced from auramedical.sg).
 * Used for product info, comparisons, and concern-based recommendations.
 */

export const products = [
  {
    id: "purebiome-purifying",
    name: "PureBiome Purifying Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Acne & Detox",
    performedBy: "specialist",
    priceSGD: 380,
    trialPriceSGD: 228,
    durationMin: 75,
    description:
      "Doctor-designed facial that restores skin microbiome balance for sensitive and acne-prone skin. Reduces breakouts and strengthens the skin barrier.",
    benefits: [
      "Restores skin microbiome balance",
      "Reduces inflammation and breakouts",
      "Strengthens skin barrier",
      "Non-invasive, suitable for sensitive skin",
    ],
    recommendedFor: ["acne", "sensitive skin", "blemishes", "inflammation", "dehydrated skin"],
    idealAgeRange: { min: 18, max: 45 },
    concernsAddressed: ["acne", "sensitivity", "uneven texture", "inflammation"],
    treatmentSteps: [
      "Welcome massage",
      "Double cleanse",
      "Exfoliation",
      "Extraction",
      "Microbiome ampoule penetration",
      "LED light therapy",
      "Detox shoulder massage",
      "Customised mask",
    ],
    sourceUrl: "https://auramedical.sg/purebiome-purifying/",
  },
  {
    id: "crystal-clear",
    name: "Crystal Clear Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Acne & Detox",
    performedBy: "specialist",
    priceSGD: 330,
    trialPriceSGD: 128,
    durationMin: 75,
    description:
      "Facial designed to combat acne — minimises breakouts, unclogs pores, and controls sebum for a clearer complexion.",
    benefits: [
      "Reduces acne breakouts",
      "Unclogs pores",
      "Controls sebum production",
      "Prevents future flare-ups",
    ],
    recommendedFor: ["acne", "oily skin", "blackheads", "whiteheads", "enlarged pores"],
    idealAgeRange: { min: 16, max: 40 },
    concernsAddressed: ["acne", "oily skin", "congestion", "enlarged pores"],
    treatmentSteps: [
      "Welcome massage",
      "Double cleanse",
      "Exfoliation",
      "Extraction",
      "Targeted serum penetration",
      "LED light therapy",
      "Face & shoulder massage",
      "Customised mask",
    ],
    sourceUrl: "https://auramedical.sg/crystal-clear/",
  },
  {
    id: "signature-emerald-peel",
    name: "Signature AURA Emerald Peel",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Signature",
    performedBy: "specialist",
    priceSGD: 380,
    trialPriceSGD: 188,
    durationMin: 60,
    description:
      "Advanced two-phase medical facial that revitalises complexion, stimulates collagen, and improves tone and texture with minimal downtime.",
    benefits: [
      "Improves acne and hyperpigmentation",
      "Refines pores instantly",
      "Stimulates collagen",
      "Zero to minimal downtime",
      "Suitable for all skin types",
    ],
    recommendedFor: ["acne", "pigmentation", "dull skin", "enlarged pores", "fine lines"],
    idealAgeRange: { min: 20, max: 55 },
    concernsAddressed: ["acne", "pigmentation", "dullness", "texture", "pores"],
    treatmentSteps: [
      "Welcome massage",
      "Double cleanse",
      "Emerald peel (two-phase)",
      "Light extraction",
      "Iontophoresis",
      "LED light therapy",
      "Revitalising stem cell mask",
      "UV protection",
    ],
    sourceUrl: "https://auramedical.sg/signature-aura-emerald-peel/",
  },
  {
    id: "classic-emerald-peel",
    name: "Classic AURA Emerald Peel",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Signature",
    performedBy: "specialist",
    priceSGD: 280,
    trialPriceSGD: 128,
    durationMin: 50,
    description:
      "Entry-level Emerald Peel for brighter, smoother skin with gentle exfoliation and bio-stimulating revitalisation.",
    benefits: [
      "Gentle exfoliation",
      "Brightens skin tone",
      "Refines pores",
      "Minimal downtime",
    ],
    recommendedFor: ["dull skin", "mild acne", "uneven tone", "first-time peel clients"],
    idealAgeRange: { min: 18, max: 50 },
    concernsAddressed: ["dullness", "mild acne", "texture"],
    sourceUrl: "https://auramedical.sg/signature-aura-emerald-peel/",
  },
  {
    id: "aura-clarifying-hydrafacial",
    name: "AURA Clarifying Hydrafacial",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Acne & Detox",
    performedBy: "specialist",
    priceSGD: 350,
    trialPriceSGD: null,
    durationMin: 60,
    description:
      "Hydrafacial variant focused on congested, acne-prone skin — deep cleanse, extract, and hydrate without clogging pores.",
    benefits: [
      "Deep cleansing for congested pores",
      "Reduces acne-causing bacteria",
      "Hydrates without clogging",
      "Calms active breakouts",
    ],
    recommendedFor: ["acne", "congested pores", "blackheads", "oily skin"],
    idealAgeRange: { min: 18, max: 40 },
    concernsAddressed: ["acne", "congestion", "oily skin"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "aura-platinum-hydrafacial",
    name: "AURA Platinum Hydrafacial",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Signature",
    performedBy: "specialist",
    priceSGD: 450,
    trialPriceSGD: null,
    durationMin: 90,
    description:
      "Most comprehensive Hydrafacial — lymphatic drainage, booster serums, LED therapy, and extended extraction for total rejuvenation.",
    benefits: [
      "Deep cleansing and exfoliation",
      "Targets acne, sebum, and bacteria",
      "Lymphatic drainage",
      "Customised booster serums",
      "LED light therapy",
    ],
    recommendedFor: ["acne", "congested pores", "dull skin", "comprehensive skin reset"],
    idealAgeRange: { min: 20, max: 55 },
    concernsAddressed: ["acne", "congestion", "dullness", "texture"],
    sourceUrl: "https://auramedical.sg/hydrafacial-2/aura-platinum-hydrafacial/",
  },
  {
    id: "aura-hydrafacial",
    name: "AURA Hydrafacial",
    category: "facial",
    concernArea: "face",
    treatmentLine: "Signature",
    performedBy: "specialist",
    priceSGD: 280,
    trialPriceSGD: null,
    durationMin: 60,
    description:
      "Signature Hydrafacial — cleanse, exfoliate, extract, and hydrate for refreshed, glowing skin.",
    benefits: ["Deep cleanse", "Instant glow", "Hydration boost", "Suitable for most skin types"],
    recommendedFor: ["general maintenance", "dull skin", "dehydration", "first-time clients"],
    idealAgeRange: { min: 18, max: 60 },
    concernsAddressed: ["dullness", "dehydration", "maintenance"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "acne-laser",
    name: "Acne Laser",
    category: "laser",
    concernArea: "skin",
    treatmentLine: "Doctors Treatment",
    performedBy: "doctor",
    priceSGD: 500,
    trialPriceSGD: null,
    durationMin: 45,
    description:
      "FDA-approved dual-wavelength laser (Nd:YAG + Er:YAG) targeting active acne, scars, and uneven texture. Administered by licensed doctors.",
    benefits: [
      "Targets acne-causing bacteria",
      "Reduces active breakouts",
      "Improves acne scars and texture",
      "Stimulates collagen",
    ],
    recommendedFor: ["moderate to severe acne", "acne scars", "persistent breakouts", "texture issues"],
    idealAgeRange: { min: 18, max: 45 },
    concernsAddressed: ["acne", "acne scars", "texture"],
    sourceUrl: "https://auramedical.sg/laser/acne/",
  },
  {
    id: "dew-drop",
    name: "Dew Drop Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Hydrating & Soothing",
    performedBy: "specialist",
    priceSGD: 280,
    trialPriceSGD: null,
    durationMin: 60,
    description: "Hydrating and soothing facial for dehydrated, stressed skin needing moisture restoration.",
    benefits: ["Deep hydration", "Soothes irritation", "Restores skin glow"],
    recommendedFor: ["dehydrated skin", "sensitive skin", "post-treatment recovery"],
    idealAgeRange: { min: 20, max: 60 },
    concernsAddressed: ["dehydration", "sensitivity"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "glow-revive",
    name: "Glow Revive Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Pigmentation & Radiance",
    performedBy: "specialist",
    priceSGD: 320,
    trialPriceSGD: null,
    durationMin: 60,
    description: "Radiance-boosting treatment for dull, tired skin and uneven tone.",
    benefits: ["Brightens complexion", "Evens skin tone", "Boosts radiance"],
    recommendedFor: ["dull skin", "uneven tone", "tired-looking skin"],
    idealAgeRange: { min: 25, max: 55 },
    concernsAddressed: ["dullness", "pigmentation", "uneven tone"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "brilliant-glow",
    name: "Brilliant Glow Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Pigmentation & Radiance",
    performedBy: "specialist",
    priceSGD: 350,
    trialPriceSGD: null,
    durationMin: 60,
    description: "Targets pigmentation and promotes a brilliant, even glow.",
    benefits: ["Lightens pigmentation", "Evens skin tone", "Enhances luminosity"],
    recommendedFor: ["pigmentation", "sun spots", "melasma", "dull skin"],
    idealAgeRange: { min: 28, max: 60 },
    concernsAddressed: ["pigmentation", "sun damage"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "age-defence",
    name: "Age-Defence Treatment",
    category: "facial",
    concernArea: "skin",
    treatmentLine: "Anti-Ageing and Firming",
    performedBy: "specialist",
    priceSGD: 380,
    trialPriceSGD: null,
    durationMin: 75,
    description: "Anti-ageing facial focusing on firmness, fine lines, and skin resilience.",
    benefits: ["Firms skin", "Reduces fine lines", "Boosts elasticity"],
    recommendedFor: ["ageing", "fine lines", "loss of firmness"],
    idealAgeRange: { min: 35, max: 65 },
    concernsAddressed: ["ageing", "fine lines", "firmness"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
  {
    id: "rf-microneedling",
    name: "RF Microneedling",
    category: "laser",
    concernArea: "skin",
    treatmentLine: "Doctors Treatment",
    performedBy: "doctor",
    priceSGD: 680,
    trialPriceSGD: null,
    durationMin: 60,
    description:
      "Radiofrequency microneedling for skin texture, scars, and collagen stimulation. Doctor-administered.",
    benefits: ["Improves texture and scars", "Stimulates collagen", "Tightens skin"],
    recommendedFor: ["acne scars", "texture", "ageing", "large pores"],
    idealAgeRange: { min: 25, max: 55 },
    concernsAddressed: ["acne scars", "texture", "ageing", "pores"],
    sourceUrl: "https://auramedical.sg/medical-grade-treatments/",
  },
];

/** Pre-built package bundles (mock) */
export const packages = [
  {
    id: "pkg-acne-clear-starter",
    name: "Acne Clear Starter Pack",
    sessionsTotal: 4,
    priceSGD: 999,
    usualPriceSGD: 1320,
    productsIncluded: ["crystal-clear", "purebiome-purifying"],
    description: "4 sessions alternating Crystal Clear and PureBiome for acne-prone skin.",
    recommendedFor: ["acne", "oily skin", "young adults"],
    idealAgeRange: { min: 16, max: 30 },
  },
  {
    id: "pkg-glow-facial",
    name: "Glow Facial Package",
    sessionsTotal: 6,
    priceSGD: 1480,
    usualPriceSGD: 1680,
    productsIncluded: ["aura-hydrafacial", "signature-emerald-peel"],
    description: "6 sessions combining Hydrafacial and Emerald Peel for radiant skin.",
    recommendedFor: ["dull skin", "maintenance", "general glow"],
    idealAgeRange: { min: 20, max: 50 },
  },
  {
    id: "pkg-acne-intensive",
    name: "Acne Intensive Programme",
    sessionsTotal: 6,
    priceSGD: 1880,
    usualPriceSGD: 2280,
    productsIncluded: ["purebiome-purifying", "crystal-clear", "aura-clarifying-hydrafacial"],
    description: "6-session programme for persistent acne with specialist facials.",
    recommendedFor: ["moderate acne", "recurring breakouts"],
    idealAgeRange: { min: 18, max: 35 },
  },
];

const CONCERN_ALIASES = {
  acne: ["acne", "pimple", "pimples", "breakout", "breakouts", "blemish", "blemishes", "ane"],
  oily: ["oily", "sebum", "shine"],
  sensitive: ["sensitive", "irritation", "redness"],
  pigmentation: ["pigmentation", "dark spot", "melasma", "sun spot", "hyperpigmentation"],
  ageing: ["ageing", "aging", "wrinkle", "fine line", "firmness", "anti-age"],
  dull: ["dull", "glow", "radiance", "tired"],
  pores: ["pore", "pores", "congested", "blackhead"],
};

function summarizeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    treatmentLine: p.treatmentLine,
    performedBy: p.performedBy,
    priceSGD: p.priceSGD,
    trialPriceSGD: p.trialPriceSGD,
    durationMin: p.durationMin,
    concernsAddressed: p.concernsAddressed,
  };
}

/**
 * @param {string} [productId]
 * @param {string} [query]
 */
export function findProduct({ productId, query } = {}) {
  if (productId) {
    const byId = products.find((p) => p.id === productId);
    if (byId) return byId;
    const pkg = packages.find((p) => p.id === productId);
    if (pkg) return { ...pkg, type: "package" };
  }
  if (query) {
    const q = query.toLowerCase().trim();
    const hits = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.includes(q) ||
        p.treatmentLine.toLowerCase().includes(q) ||
        p.concernsAddressed.some((c) => c.includes(q) || q.includes(c)) ||
        p.recommendedFor.some((r) => r.includes(q) || q.includes(r))
    );
    if (hits.length === 1) return hits[0];
    if (hits.length > 1) {
      const exact = hits.find((p) => p.name.toLowerCase() === q);
      return exact || hits[0];
    }
    const pkgHits = packages.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.includes(q)
    );
    if (pkgHits.length === 1) return { ...pkgHits[0], type: "package" };
  }
  return null;
}

/**
 * Normalize concern string to canonical keys.
 * @param {string} concern
 */
export function normalizeConcern(concern) {
  const c = concern.toLowerCase();
  for (const [key, aliases] of Object.entries(CONCERN_ALIASES)) {
    if (aliases.some((a) => c.includes(a))) return key;
  }
  return c;
}

/**
 * Recommend products/packages for a concern and optional age.
 * @param {{ concern: string, age?: number, limit?: number }} opts
 */
export function recommendProducts({ concern, age, limit = 5 }) {
  const normalized = normalizeConcern(concern);
  const scored = products.map((p) => {
    let score = 0;
    if (p.concernsAddressed.includes(normalized)) score += 3;
    if (p.recommendedFor.some((r) => r.includes(normalized) || normalized.includes(r.split(" ")[0])))
      score += 2;
    if (p.recommendedFor.some((r) => normalizeConcern(r) === normalized)) score += 2;
    if (age != null && p.idealAgeRange) {
      if (age >= p.idealAgeRange.min && age <= p.idealAgeRange.max) score += 1;
    }
    return { product: p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const topProducts = scored.filter((s) => s.score > 0).slice(0, limit);

  const pkgScored = packages
    .map((pkg) => {
      let score = 0;
      if (pkg.recommendedFor.some((r) => normalizeConcern(r) === normalized || r.includes(normalized)))
        score += 3;
      if (age != null && pkg.idealAgeRange) {
        if (age >= pkg.idealAgeRange.min && age <= pkg.idealAgeRange.max) score += 1;
      }
      return { package: pkg, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    concern: normalized,
    age: age ?? null,
    recommendations: topProducts.map((s) => ({
      ...summarizeProduct(s.product),
      matchScore: s.score,
      whyRecommended: s.product.recommendedFor.filter(
        (r) => r.includes(normalized) || normalizeConcern(r) === normalized
      ),
    })),
    packageRecommendations: pkgScored.slice(0, 3).map((s) => ({
      id: s.package.id,
      name: s.package.name,
      sessionsTotal: s.package.sessionsTotal,
      priceSGD: s.package.priceSGD,
      description: s.package.description,
      matchScore: s.score,
    })),
  };
}

/**
 * Compare 2–4 products side by side.
 * @param {string[]} productIds
 */
export function compareProducts(productIds) {
  const items = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  if (items.length < 2) {
    return { ok: false, reason: "need_at_least_two_valid_products" };
  }
  return {
    ok: true,
    comparison: items.map((p) => ({
      id: p.id,
      name: p.name,
      priceSGD: p.priceSGD,
      trialPriceSGD: p.trialPriceSGD,
      durationMin: p.durationMin,
      performedBy: p.performedBy,
      treatmentLine: p.treatmentLine,
      description: p.description,
      benefits: p.benefits,
      recommendedFor: p.recommendedFor,
      concernsAddressed: p.concernsAddressed,
      idealAgeRange: p.idealAgeRange,
    })),
  };
}

export function listAllProducts() {
  return products.map(summarizeProduct);
}

export function listAllPackages() {
  return packages.map((p) => ({
    id: p.id,
    name: p.name,
    sessionsTotal: p.sessionsTotal,
    priceSGD: p.priceSGD,
    usualPriceSGD: p.usualPriceSGD,
    recommendedFor: p.recommendedFor,
  }));
}
