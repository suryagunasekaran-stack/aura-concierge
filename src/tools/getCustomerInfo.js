import { getCustomer, getSessionsSummary } from "../data/customers.js";

/**
 * @param {{ customerKey?: string }} args
 * @param {{ customerKey: string }} ctx
 */
export async function getCustomerInfo(args = {}, ctx) {
  try {
    const customerKey = ctx.customerKey;
    const profile = getCustomer(customerKey);
    if (!profile) {
      return { ok: false, reason: "not_found" };
    }

    const { sessionsRemaining, activePackages, allPackages } =
      getSessionsSummary(customerKey);

    return {
      ok: true,
      customer: {
        name: profile.name,
        email: profile.email,
        memberTier: profile.memberTier,
        lastVisit: profile.lastVisit,
        notes: profile.notes,
        customerKey: profile.customerKey,
        sessionsRemaining,
        packages: allPackages,
        activePackages,
      },
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
