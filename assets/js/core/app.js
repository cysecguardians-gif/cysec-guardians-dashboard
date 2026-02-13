// app.js
// Automatic Page Bootstrap Engine

const PAGE_MAP = {
  "index.html":      () => import("../pages/dashboard.js"),
  "users.html":      () => import("../pages/users.js"),
  "trainings.html":  () => import("../pages/trainings.js"),
  "phishing.html":   () => import("../pages/phishing.js"),
  "reports.html":    () => import("../pages/reports.js"),
  "settings.html":   () => import("../pages/settings.js")
};

/* ===============================
   Detect Current Page
=============================== */

function getCurrentPage() {
  const path = window.location.pathname;
  return path.split("/").pop();
}

/* ===============================
   Bootstrap
=============================== */

async function bootstrap() {
  const page = getCurrentPage();

  if (!PAGE_MAP[page]) {
    console.warn("No page controller for:", page);
    return;
  }

  try {
    const module = await PAGE_MAP[page]();

    // auto-run init if exported
    if (module.init) {
      module.init();
    }

  } catch (err) {
    console.error("Page bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
