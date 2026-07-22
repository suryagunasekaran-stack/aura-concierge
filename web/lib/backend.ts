const PRODUCTION_BACKEND_URL =
  "https://aura-concierge-api-production.up.railway.app";

export const BACKEND_URL =
  process.env.BACKEND_URL ??
  (process.env.VERCEL ? PRODUCTION_BACKEND_URL : "http://localhost:3000");

/**
 * Proxy a request to the Express backend.
 */
export async function proxyBackend(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, init);
}
