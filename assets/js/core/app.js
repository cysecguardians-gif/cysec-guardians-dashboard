import { loadAppState } from "./state.js";

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

async function bootstrap() {
  try {
    // 🔥 LOAD GLOBAL STATE FIRST
    await loadAppState();

    const page = getCurrentPage();
    if (!PAGE_MAP[page]) return;

    const module = await PAGE_MAP[page]();

    if (module.init) {
      module.init();
    }

  } catch (err) {
    console.error("Bootstrap failed", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
