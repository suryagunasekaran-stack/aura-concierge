import { logger } from "../util/logger.js";

/**
 * @typedef {object} TenantCopy
 * @property {string} [welcomeMessage]
 * @property {string} [clinicName]
 * @property {string} [tagline]
 * @property {string} [assistantName]
 * @property {string} [avatarInitial]
 * @property {string} [documentTitle]
 */

/**
 * @typedef {object} TenantPrompts
 * @property {string} [systemPrompt]
 * @property {string} [persona]
 */

/**
 * @typedef {object} TenantProfile
 * @property {1|2} [version]
 * @property {Record<string, string|undefined>} [colors]
 * @property {string|null} [logoUrl]
 * @property {string|null} [faviconUrl]
 * @property {TenantCopy} [copy]
 * @property {TenantPrompts} [prompts]
 * @property {{ id?: string, filename: string, content: string, byteSize?: number }[]} [knowledge]
 * @property {string} [updatedAt]
 */

function mindboxsUrl() {
  return (
    process.env.MINDBOXS_URL ||
    process.env.NEXT_PUBLIC_MINDBOXS_URL ||
    "https://mindboxs-mvp.vercel.app"
  ).replace(/\/$/, "");
}

/**
 * Fetch a tenant branding profile from the Mindboxs host.
 * @param {string} slug
 * @returns {Promise<TenantProfile|null>}
 */
export async function fetchTenantProfile(slug) {
  const safe = typeof slug === "string" ? slug.trim() : "";
  if (!safe) return null;

  const url = `${mindboxsUrl()}/api/branding/${encodeURIComponent(safe)}?_=${Date.now()}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      logger.warn(
        `Tenant profile fetch failed for ${safe}: HTTP ${res.status}`,
      );
      return null;
    }
    return /** @type {TenantProfile} */ (await res.json());
  } catch (err) {
    logger.error(`Tenant profile fetch error for ${safe}:`, err);
    return null;
  }
}
