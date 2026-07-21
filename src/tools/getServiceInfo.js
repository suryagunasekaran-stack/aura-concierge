import { findService } from "../data/services.js";

/**
 * @param {{ serviceId?: string, query?: string }} args
 * @param {object} _ctx
 */
export async function getServiceInfo(args = {}, _ctx) {
  try {
    const service = findService({
      serviceId: args.serviceId,
      query: args.query,
    });
    if (!service) {
      return { ok: false, reason: "not_found" };
    }
    return {
      ok: true,
      service: {
        id: service.id,
        name: service.name,
        category: service.category,
        durationMin: service.durationMin,
        priceSGD: service.priceSGD,
        description: service.description,
      },
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
