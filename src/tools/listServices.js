import { listServices as listFromCatalog } from "../data/services.js";

/**
 * @param {{ category?: string }} args
 * @param {object} _ctx
 */
export async function listServices(args = {}, _ctx) {
  try {
    const services = listFromCatalog(args.category);
    return { ok: true, services };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
