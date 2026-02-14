import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";
import { onVisibilityChange } from "./scheduler.js";
import { LIVE_PRIORITY } from "./livePriority.js";

const listeners = new Set();

let started = false;

let timers = {};

/* ======================================================
   INTERVALS (priority-based)
====================================================== */

const INTERVALS = {
  HIGH: 15000,   // 15s
  MEDIUM: 60000, // 1 min
  LOW: 180000    // 3 min
};

const HIDDEN_MULTIPLIER = 3;

/* ======================================================
   PUBLIC SUBSCRIBE
====================================================== */

export function onLiveUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error("Live listener error:", err);
    }
  });
}

/* ======================================================
   FETCH GROUP
====================================================== */

async function refreshGroup(group) {

  const items = LIVE_PRIORITY[group];
  if (!items) return;

  try {

    for (const item of items) {
      const data = await apiFetch(item.url);
      setCache(item.key, data);
    }

    emit();

  } catch (err) {
    console.error("Priority refresh failed:", group);
  }
}

/* ======================================================
   START GROUP TIMER
====================================================== */

function startGroup(group, interval) {

  if (timers[group]) {
    clearInterval(timers[group]);
  }

  refreshGroup(group);

  timers[group] = setInterval(() => {
    refreshGroup(group);
  }, interval);

  console.log("Priority started:", group, interval);
}

/* ======================================================
   ADAPTIVE VISIBILITY
====================================================== */

function setupAdaptivePriority() {

  onVisibilityChange((visible) => {

    const multiplier = visible ? 1 : HIDDEN_MULTIPLIER;

    Object.keys(INTERVALS).forEach(group => {
      startGroup(
        group,
        INTERVALS[group] * multiplier
      );
    });

  });
}

/* ======================================================
   START ENGINE
====================================================== */

export function startLiveEngine() {
  if (started) return;
  started = true;

  setupAdaptivePriority();

  console.log("Intelligent priority scheduler started");
}

/* ======================================================
   STOP ENGINE
====================================================== */

export function stopLiveEngine() {
  Object.values(timers).forEach(clearInterval);
  timers = {};
  started = false;
}
