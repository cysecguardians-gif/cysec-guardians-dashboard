// live.js
// Global Live Update Engine

const listeners = new Set();

let intervalId = null;
let started = false;

const DEFAULT_INTERVAL = 60000; // 60s

/* ======================================================
   Subscribe
====================================================== */

export function onLiveUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ======================================================
   Trigger
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
   Start Engine (only once)
====================================================== */

export function startLiveEngine(interval = DEFAULT_INTERVAL) {
  if (started) return;

  started = true;

  intervalId = setInterval(() => {
    emit();
  }, interval);

  console.log("Live engine started");
}

/* ======================================================
   Optional stop (future use)
====================================================== */

export function stopLiveEngine() {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;
  started = false;
}
