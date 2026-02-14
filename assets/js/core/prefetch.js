// prefetch.js
// Predictive Prefetch System

import { apiFetch } from "./api.js";
import { setCache, getCache } from "./cache.js";

let started = false;

/* ======================================================
   PREFETCH MAP
   (what each page will likely need)
====================================================== */

const PREFETCH_MAP = {
  "/org-admin/users.html": [
    { key: "users_list", url: "/employees" }
  ],

  "/org-admin/trainings.html": [
    { key: "trainings_assigned", url: "/trainings/assigned" },
    { key: "trainings_catalog", url: "/trainings/catalog" }
  ],

  "/org-admin/reports.html": [
    { key: "dashboard_summary", url: "/dashboard/summary" }
  ]
};

/* ======================================================
   SAFE FETCH
====================================================== */

async function prefetchItem({ key, url }) {
  try {

    // skip if already cached
    if (getCache(key)) return;

    const data = await apiFetch(url);
    setCache(key, data);

    console.log("Prefetched:", key);

  } catch (err) {
    console.warn("Prefetch failed:", key);
  }
}

/* ======================================================
   PREFETCH PAGE DATA
====================================================== */

function prefetchForPath(path) {
  const items = PREFETCH_MAP[path];
  if (!items) return;

  items.forEach(prefetchItem);
}

/* ======================================================
   HOVER-BASED PREDICTION
====================================================== */

function setupHoverPrediction() {

  document.querySelectorAll(".sidebar-nav a")
    .forEach(link => {

      link.addEventListener("mouseenter", () => {
        prefetchForPath(link.getAttribute("href"));
      });

    });
}

/* ======================================================
   IDLE PREFETCH
====================================================== */

function idlePrefetch() {
  if (!("requestIdleCallback" in window)) return;

  requestIdleCallback(() => {
    Object.keys(PREFETCH_MAP).forEach(prefetchForPath);
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

  console.log("Prefetch engine started");
}
