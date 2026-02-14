// live.js
// Intelligent Live Engine (Priority + Adaptive Scheduler)

import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";
import { onVisibilityChange } from "./scheduler.js";
import { LIVE_PRIORITY } from "./livePriority.js";
import { logEvent } from "./observability.js";

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
  HIGH: 15000,   // 15s (critical data)
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
   FETCH GROUP DATA
====================================================== */

async function refreshGroup(group) {

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

  // clear old timer if exists
  if (timers[group]) {
    clearInterval(timers[group]);
  }

  // immediate refresh once
  refreshGroup(group);

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
