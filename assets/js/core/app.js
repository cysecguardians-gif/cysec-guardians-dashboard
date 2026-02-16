import { loadAppState } from "./state.js";
import { startLiveEngine } from "./live.js";
import { startPrefetchEngine } from "./prefetch.js";
import { startNavigationAI } from "./navigationAI.js";
import { initObservabilityUI } from "./observability.js";

/* ======================================================
   PAGE AUTO LOADER (ADDED)
====================================================== */

const PAGE_MAP = {
  "index.html": () => import("../pages/dashboard.js"),
  "users.html": () => import("../pages/users.js"),
  "trainings.html": () => import("../pages/trainings.js"),
  "phishing.html": () => import("../pages/phishing.js"),
  "reports.html": () => import("../pages/reports.js"),
  "settings.html": () => import("../pages/settings.js")
};

function getCurrentPage() {
  return window.location.pathname.split("/").pop();
}

/* ======================================================
   BOOTSTRAP
====================================================== */

async function bootstrap() {
  try {
    // Global state
    await loadAppState();

    // Engines (disabled for now — your choice)
    // startLiveEngine();
    // startPrefetchEngine();
    // startNavigationAI();

    // Observability UI
    initObservabilityUI();

    /* ===== PAGE INIT (ADDED) ===== */
    const page = getCurrentPage();

    if (PAGE_MAP[page]) {
      const module = await PAGE_MAP[page]();

      if (module.init) {
        module.init();
      }
    }

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
