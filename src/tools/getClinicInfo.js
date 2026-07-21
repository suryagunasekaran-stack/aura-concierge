import { getClinicInfo as getInfo } from "../data/clinic.js";

/**
 * @param {{ topic?: string }} args
 * @param {object} _ctx
 */
export async function getClinicInfo(args = {}, _ctx) {
  try {
    const info = getInfo(args.topic);
    if (info && info.ok === false) return info;
    return { ok: true, ...info };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
