// live.js
// Intelligent Live Engine (Priority + Adaptive Scheduler)

import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";
import { onVisibilityChange } from "./scheduler.js";
import { LIVE_PRIORITY } from "./livePriority.js";
import { logEvent } from "./observability.js";
import { getState } from "./state.js"; // 🔥 NEW

/* ======================================================
   INTERNAL STATE
====================================================== */

const listeners = new Set();

let started = false;
let timers = {};

/* ======================================================
   INTERVALS (priority-based)
====================================================== */

const INTERVALS = {
  HIGH: 15000,
  MEDIUM: 60000,
  LOW: 180000
};

const HIDDEN_MULTIPLIER = 3;

/* ======================================================
   PUBLIC SUBSCRIBE
====================================================== */

export function onLiveUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ======================================================
   EMIT UPDATE
====================================================== */

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
   CHECK STATE READY
====================================================== */

function isReady() {
  const state = getState();
  return !!state?.org?.id;
}

/* ======================================================
   FETCH GROUP DATA
====================================================== */

async function refreshGroup(group) {

  // 🔥 BLOCK until org_id is ready
  if (!isReady()) {
    console.warn(`Skipping ${group} refresh (org not ready)`);
    return;
  }

  const items = LIVE_PRIORITY[group];
  if (!items?.length) return;

  try {

    logEvent("LIVE", `Refreshing ${group} priority`);

    for (const item of items) {

      const data = await apiFetch(item.url);

      setCache(item.key, data);

      logEvent("CACHE", `Updated: ${item.key}`);
    }

    emit();

  } catch (err) {
    console.error("Priority refresh failed:", group, err);
    logEvent("ERROR", `Refresh failed: ${group}`);
  }
}

/* ======================================================
   START GROUP TIMER
====================================================== */

function startGroup(group, interval) {

  if (timers[group]) {
    clearInterval(timers[group]);
  }

  // 🔥 delay initial run slightly (gives state time)
  setTimeout(() => refreshGroup(group), 300);

  timers[group] = setInterval(() => {
    refreshGroup(group);
  }, interval);

  console.log(`Priority started: ${group} (${interval}ms)`);
  logEvent("LIVE", `Timer started: ${group}`);
}

/* ======================================================
   ADAPTIVE VISIBILITY
====================================================== */

function setupAdaptivePriority() {

  onVisibilityChange((visible) => {

    const multiplier = visible ? 1 : HIDDEN_MULTIPLIER;

    logEvent(
      "SCHEDULER",
      visible
        ? "Tab active → fast mode"
        : "Tab hidden → slow mode"
    );

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

  logEvent("LIVE", "Intelligent priority scheduler started");

  setupAdaptivePriority();

  console.log("Intelligent priority scheduler started");
}

/* ======================================================
   STOP ENGINE
====================================================== */

export function stopLiveEngine() {

  Object.values(timers).forEach(timer => {
    clearInterval(timer);
  });

  timers = {};
  started = false;

  logEvent("LIVE", "Live engine stopped");
}
