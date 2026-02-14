// scheduler.js
// Adaptive Background Scheduler

const listeners = new Set();

let isVisible = true;

/* ======================================================
   VISIBILITY TRACKING
====================================================== */

function detectVisibility() {
  isVisible = !document.hidden;
  notify();
}

document.addEventListener(
  "visibilitychange",
  detectVisibility
);

/* ======================================================
   SUBSCRIBE
====================================================== */

export function onVisibilityChange(fn) {
  listeners.add(fn);
  fn(isVisible); // immediate call

  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => {
    try {
      fn(isVisible);
    } catch (err) {
      console.error("Scheduler listener error:", err);
    }
  });
}

/* ======================================================
   HELPERS
====================================================== */

export function isPageVisible() {
  return isVisible;
}
