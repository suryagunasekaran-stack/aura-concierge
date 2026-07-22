import pg from "pg";
import { DATABASE_URL } from "../config.js";
import { logger } from "../util/logger.js";

const { Pool } = pg;

/** @type {import("pg").Pool | null} */
let pool = null;

/**
 * @returns {import("pg").Pool | null}
 */
export function getPool() {
  if (!DATABASE_URL) {
    return null;
  }
  if (!pool) {
    pool = new Pool({
      connectionString: DATABASE_URL,
      // Neon / serverless-friendly defaults
      ssl:
        DATABASE_URL.includes("sslmode=require") ||
        DATABASE_URL.includes("neon.tech")
          ? { rejectUnauthorized: false }
          : undefined,
    });
    pool.on("error", (err) => {
      logger.error("Unexpected Postgres pool error:", err);
    });
  }
  return pool;
}

/**
 * @returns {boolean}
 */
export function isDbConfigured() {
  return Boolean(DATABASE_URL);
}

/**
 * @param {string} text
 * @param {unknown[]} [params]
 * @returns {Promise<import("pg").QueryResult>}
 */
export async function query(text, params = []) {
  const p = getPool();
  if (!p) {
    throw new Error("DATABASE_URL is not configured");
  }
  return p.query(text, params);
}
