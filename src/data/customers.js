/** Mock customer profiles keyed by phone-like customerKey */

export const customers = {
  "+6591234567": {
    customerKey: "+6591234567",
    name: "Mei Ling",
    email: "meiling@example.com",
    memberTier: "Gold",
    lastVisit: "2026-06-15",
    notes: "Prefers afternoon appointments. Sensitive skin.",
    packages: [
      {
        packageId: "pkg-acne-clear-starter",
        packageName: "Acne Clear Starter Pack",
        sessionsTotal: 4,
        sessionsUsed: 1,
        sessionsRemaining: 3,
        expiryDate: "2026-12-31",
        servicesIncluded: ["Crystal Clear", "PureBiome Purifying"],
      },
      {
        packageId: "pkg-laser-touchup",
        packageName: "Laser Touch-up Pack",
        sessionsTotal: 4,
        sessionsUsed: 4,
        sessionsRemaining: 0,
        expiryDate: "2026-08-15",
        servicesIncluded: ["Laser Hair Removal"],
      },
    ],
  },
  "+6598765432": {
    customerKey: "+6598765432",
    name: "Jason Tan",
    email: "jason.tan@example.com",
    memberTier: "Standard",
    lastVisit: "2026-05-02",
    notes: "Interested in laser treatments.",
    packages: [
      {
        packageId: "pkg-starter-facial",
        packageName: "Starter Facial Pack",
        sessionsTotal: 3,
        sessionsUsed: 1,
        sessionsRemaining: 2,
        expiryDate: "2026-09-30",
        servicesIncluded: ["Classic Facial"],
      },
    ],
  },
  "+6581112222": {
    customerKey: "+6581112222",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    memberTier: "Platinum",
    lastVisit: "2026-07-01",
    notes: "Regular HydraFacial client.",
    packages: [
      {
        packageId: "pkg-platinum-glow",
        packageName: "Platinum Glow Package",
        sessionsTotal: 10,
        sessionsUsed: 2,
        sessionsRemaining: 8,
        expiryDate: "2027-03-01",
        servicesIncluded: ["HydraFacial", "Skin Booster", "Chemical Peel"],
      },
    ],
  },
};

/**
 * @param {string} customerKey
 */
export function getCustomer(customerKey) {
  return customers[customerKey] || null;
}

/**
 * Total sessions remaining across all active (non-expired) packages.
 * @param {string} customerKey
 */
export function getSessionsSummary(customerKey) {
  const profile = getCustomer(customerKey);
  if (!profile?.packages) {
    return { sessionsRemaining: 0, packages: [] };
  }

  const today = new Date().toISOString().slice(0, 10);
  const activePackages = profile.packages.filter(
    (p) => p.expiryDate >= today && p.sessionsRemaining > 0
  );
  const sessionsRemaining = activePackages.reduce(
    (sum, p) => sum + p.sessionsRemaining,
    0
  );

  return {
    sessionsRemaining,
    activePackages,
    allPackages: profile.packages,
  };
}
