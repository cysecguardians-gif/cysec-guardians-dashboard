// prefetch.js
// Predictive Prefetch Engine

import { apiFetch } from "./api.js";
import { setCache, getCache } from "./cache.js";
import { logEvent } from "./observability.js";
import { getState } from "./state.js"; // 🔥 NEW

let started = false;

/* ======================================================
   PREFETCH MAP
====================================================== */

const PREFETCH_MAP = {
  "/org-admin/users.html": [
    { key: "users_list", url: "/employees" }
  ],

  "/org-admin/trainings.html": [
    { key: "trainings_assigned", url: "/trainings/assigned" },
    { key: "trainings_catalog", url: "/trainings/catalog" }
  ],

  "/org-admin/phishing.html": [
    { key: "phishing_campaigns", url: "/phishing/campaigns" }
  ],

  "/org-admin/reports.html": [
    { key: "dashboard_summary", url: "/dashboard/summary" }
  ]
};

/* ======================================================
   STATE CHECK
====================================================== */

function isReady() {
  const state = getState();
  return !!state?.org?.id;
}

/* ======================================================
   PREFETCH SINGLE ITEM
====================================================== */

async function prefetchItem({ key, url }) {

  // 🔥 BLOCK until org_id is ready
  if (!isReady()) {
    console.warn(`Skipping prefetch (${key}) — org not ready`);
    return;
  }

  try {

    if (getCache(key)) return;

    const data = await apiFetch(url);

    setCache(key, data);

    logEvent("PREFETCH", `Loaded: ${key}`);

  } catch (err) {
    console.warn("Prefetch failed:", key);
    logEvent("PREFETCH", `Failed: ${key}`);
  }
}

/* ======================================================
   PREFETCH PAGE DATA
====================================================== */

export function prefetchForPath(path) {

  const items = PREFETCH_MAP[path];
  if (!items) return;

  items.forEach(prefetchItem);
}

/* ======================================================
   HOVER PREDICTION
====================================================== */

function setupHoverPrediction() {

  document.querySelectorAll(".sidebar-nav a")
    .forEach(link => {

      link.addEventListener("mouseenter", () => {

        const path = link.getAttribute("href");
        if (!path) return;

        logEvent("PREFETCH", `Hover predict: ${path}`);

        prefetchForPath(path);
      });

    });
}

/* ======================================================
   IDLE PREFETCH
====================================================== */

function idlePrefetch() {

  if (!("requestIdleCallback" in window)) return;

  requestIdleCallback(() => {

    // 🔥 Wait until state is ready
    if (!isReady()) {
      console.warn("Skipping idle prefetch — org not ready");
      return;
    }

    logEvent("PREFETCH", "Idle prefetch started");

    Object.keys(PREFETCH_MAP)
      .forEach(prefetchForPath);

  });
}

/* ======================================================
   START ENGINE
====================================================== */

export function startPrefetchEngine() {

  if (started) return;
  started = true;

  setupHoverPrediction();
  idlePrefetch();

  logEvent("PREFETCH", "Prefetch engine started");

  console.log("Prefetch engine started");
}
