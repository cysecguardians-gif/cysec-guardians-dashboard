// live.js
// Global Live Engine + Cache Refresher

import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";

const listeners = new Set();

let started = false;
let intervalId = null;

const INTERVAL = 60000; // 60 seconds

/* ======================================================
   PUBLIC SUBSCRIBE
====================================================== */

export function onLiveUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ======================================================
   EMIT UPDATE EVENT
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
   FETCH & UPDATE CACHE
====================================================== */

async function refreshCache() {
  try {
    // Dashboard KPI data
    setCache(
      "dashboard_summary",
      await apiFetch("/dashboard/summary")
    );

    // Dashboard analytics
    setCache(
      "phishing_trend",
      await apiFetch("/analytics/phishing-trend")
    );

    setCache(
      "department_risk",
      await apiFetch("/analytics/department-risk")
    );

    // Phishing campaigns
    setCache(
      "phishing_campaigns",
      await apiFetch("/phishing/campaigns")
    );

  } catch (err) {
    console.error("Live cache refresh failed:", err);
  }
}

/* ======================================================
   START ENGINE
====================================================== */

export function startLiveEngine() {
  if (started) return;

  started = true;

  // first load immediately
  refreshCache().then(emit);

  intervalId = setInterval(async () => {
    await refreshCache();
    emit();
  }, INTERVAL);

  console.log("Global live engine started");
}

/* ======================================================
   STOP ENGINE (optional future use)
====================================================== */

export function stopLiveEngine() {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;
  started = false;
}
