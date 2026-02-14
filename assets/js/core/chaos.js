// chaos.js
// Safe Chaos Testing Mode

let enabled = false;

/* ======================================================
   CONFIG
====================================================== */

const CHAOS_SETTINGS = {
  failureRate: 0.15, // 15% requests fail
  maxDelay: 2000     // random delay
};

/* ======================================================
   TOGGLE
====================================================== */

export function enableChaosMode() {
  enabled = true;
  console.warn("CHAOS MODE ENABLED");
}

export function disableChaosMode() {
  enabled = false;
  console.warn("CHAOS MODE DISABLED");
}

export function isChaosEnabled() {
  return enabled;
}

/* ======================================================
   CHAOS EFFECTS
====================================================== */

export async function applyChaos() {

  if (!enabled) return;

  // random delay
  const delay =
    Math.random() * CHAOS_SETTINGS.maxDelay;

  await new Promise(res =>
    setTimeout(res, delay)
  );

  // random failure
  if (Math.random() < CHAOS_SETTINGS.failureRate) {
    throw new Error("CHAOS: simulated failure");
  }
}
