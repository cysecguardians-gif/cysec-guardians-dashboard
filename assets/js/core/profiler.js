// profiler.js
import { logEvent } from "./observability.js";

const timings = {};

/* ======================================================
   START TIMER
====================================================== */

export function startTimer(label) {
  timings[label] = performance.now();
}

/* ======================================================
   END TIMER
====================================================== */

export function endTimer(label) {

  if (!timings[label]) return;

  const duration =
    performance.now() - timings[label];

  logEvent(
    "PERF",
    `${label}: ${duration.toFixed(1)}ms`
  );

  delete timings[label];
}
