import { findService } from "../data/services.js";

/**
 * Deterministic simulated availability for a date.
 * @param {{ serviceId: string, date: string, partOfDay?: string }} args
 * @param {object} _ctx
 */
export async function checkAvailability(args = {}, _ctx) {
  try {
    const { serviceId, date, partOfDay } = args;
    if (!serviceId || !date) {
      return { ok: false, error: "serviceId and date are required" };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { ok: false, error: "date must be YYYY-MM-DD" };
    }
    const service = findService({ serviceId });
    if (!service) {
      return { ok: false, reason: "service_not_found" };
    }

    const allSlots = generateSlots(date);
    let slots = allSlots;
    if (partOfDay === "morning") {
      slots = allSlots.filter((t) => hourOf(t) < 12);
    } else if (partOfDay === "afternoon") {
      slots = allSlots.filter((t) => hourOf(t) >= 12 && hourOf(t) < 17);
    } else if (partOfDay === "evening") {
      slots = allSlots.filter((t) => hourOf(t) >= 17);
    }

    // Skip past times if date is today (Asia/Singapore approx via local + offset note: use UTC date compare with SG)
    const todaySg = singaporeToday();
    if (date === todaySg) {
      const nowMinutes = singaporeNowMinutes();
      slots = slots.filter((t) => timeToMinutes(t) > nowMinutes + 60);
    }

    return {
      ok: true,
      serviceId: service.id,
      serviceName: service.name,
      date,
      slots: slots.slice(0, 4),
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

function hourOf(t) {
  return Number(t.split(":")[0]);
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function singaporeToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function singaporeNowMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour").value);
  const minute = Number(parts.find((p) => p.type === "minute").value);
  return hour * 60 + minute;
}

/** Deterministic plausible slots from date string */
function generateSlots(date) {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (hash * 31 + date.charCodeAt(i)) >>> 0;
  }
  const pool = ["10:00", "10:30", "11:15", "13:00", "14:00", "14:30", "16:15", "17:00", "18:30"];
  const start = hash % 3;
  const picks = [];
  for (let i = 0; i < 5; i++) {
    picks.push(pool[(start + i * 2) % pool.length]);
  }
  return [...new Set(picks)].sort();
}
