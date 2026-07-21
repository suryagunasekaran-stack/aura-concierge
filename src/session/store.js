import { SESSION_TTL_MS } from "../config.js";

const sessions = new Map();

function createSession() {
  const now = Date.now();
  return {
    history: [],
    createdAt: now,
    lastActiveAt: now,
    pending: {},
  };
}

function isExpired(session) {
  return Date.now() - session.lastActiveAt > SESSION_TTL_MS;
}

/**
 * @param {string} sessionId
 * @returns {{ history: any[], createdAt: number, lastActiveAt: number, pending: Record<string, any> }}
 */
export function get(sessionId) {
  let session = sessions.get(sessionId);
  if (!session || isExpired(session)) {
    session = createSession();
    sessions.set(sessionId, session);
  }
  return session;
}

/**
 * @param {string} sessionId
 * @param {{ history: any[], createdAt: number, lastActiveAt: number, pending: Record<string, any> }} session
 */
export function set(sessionId, session) {
  session.lastActiveAt = Date.now();
  sessions.set(sessionId, session);
}

/**
 * @param {string} sessionId
 */
export function reset(sessionId) {
  const session = createSession();
  sessions.set(sessionId, session);
  return session;
}

/** Test helper: clear all sessions */
export function clearAll() {
  sessions.clear();
}
