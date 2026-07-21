/** Mock service catalog for Aura Aesthetic Clinic */

export const services = [
  {
    id: "hydra-facial",
    name: "HydraFacial",
    category: "facial",
    durationMin: 60,
    priceSGD: 280,
    description: "Deep cleanse, extract, and hydrate facial treatment.",
  },
  {
    id: "classic-facial",
    name: "Classic Facial",
    category: "facial",
    durationMin: 45,
    priceSGD: 120,
    description: "Gentle cleansing facial suitable for most skin types.",
  },
  {
    id: "laser-hair-removal",
    name: "Laser Hair Removal",
    category: "laser",
    durationMin: 30,
    priceSGD: 150,
    description: "Laser hair reduction for face or small body areas.",
  },
  {
    id: "laser-pigmentation",
    name: "Laser Pigmentation Treatment",
    category: "laser",
    durationMin: 45,
    priceSGD: 350,
    description: "Targets uneven tone and pigmentation spots.",
  },
  {
    id: "chemical-peel",
    name: "Chemical Peel",
    category: "peel",
    durationMin: 40,
    priceSGD: 200,
    description: "Exfoliating peel to refresh dull skin.",
  },
  {
    id: "botox",
    name: "Botox",
    category: "injectable",
    durationMin: 30,
    priceSGD: 450,
    description: "Anti-wrinkle injectable treatment (consultation required).",
  },
  {
    id: "dermal-filler",
    name: "Dermal Filler",
    category: "injectable",
    durationMin: 45,
    priceSGD: 680,
    description: "Volume restoration injectable (consultation required).",
  },
  {
    id: "skin-booster",
    name: "Skin Booster",
    category: "injectable",
    durationMin: 40,
    priceSGD: 520,
    description: "Hydrating injectable for skin glow and elasticity.",
  },
];

/**
 * @param {string} [category]
 */
export function listServices(category) {
  if (!category) return services.map(summarize);
  const c = category.toLowerCase();
  return services.filter((s) => s.category.toLowerCase() === c).map(summarize);
}

function summarize(s) {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    durationMin: s.durationMin,
    priceSGD: s.priceSGD,
  };
}

/**
 * Resolve by id or fuzzy name/query match.
 * @param {{ serviceId?: string, query?: string }} opts
 */
export function findService({ serviceId, query } = {}) {
  if (serviceId) {
    const byId = services.find((s) => s.id === serviceId);
    if (byId) return byId;
  }
  if (query) {
    const q = query.toLowerCase().trim();
    const exact = services.find(
      (s) => s.name.toLowerCase() === q || s.id === q
    );
    if (exact) return exact;

    const partial = services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        q.split(/\s+/).some(
          (token) =>
            token.length > 2 &&
            (s.name.toLowerCase().includes(token) ||
              s.category.toLowerCase().includes(token))
        )
    );
    if (partial.length === 1) return partial[0];
    if (partial.length > 1) {
      // Prefer stronger name matches
      const nameHit = partial.find((s) => s.name.toLowerCase().includes(q));
      return nameHit || partial[0];
    }
  }
  return null;
}
