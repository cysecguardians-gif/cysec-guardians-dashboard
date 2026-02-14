import { apiFetch } from "./core/api.js";
import { PAGE_CONFIG } from "./core/pageConfig.js";

/* ===============================
   Helpers
=============================== */

function getCurrentPage() {
  return window.location.pathname.split("/").pop();
}

/* ===============================
   Sidebar Active Auto Highlight
=============================== */

function setActiveNav(navPath) {
  document.querySelectorAll(".sidebar-nav .nav-link")
    .forEach(link => link.classList.remove("active"));

  const active = document.querySelector(
    `.sidebar-nav a[href="${navPath}"]`
  );

  if (active) active.classList.add("active");
}

/* ===============================
   Page Title Auto Update
=============================== */

function setPageTitle(title) {
  const headerTitle = document.querySelector("header h5");
  if (headerTitle) headerTitle.textContent = title;

  document.title = title;
}

/* ===============================
   Init Layout
=============================== */

async function initLayout() {
  try {
    const page = getCurrentPage();
    const config = PAGE_CONFIG[page];

    if (config) {
      setActiveNav(config.nav);
      setPageTitle(config.title);
    }

    // User permissions
    const me = await apiFetch("/me");

    if (!me.training_enabled) {
      document.querySelectorAll("#menu-training")
        .forEach(e => e.style.display = "none");
    }

    if (!me.phishing_enabled) {
      document.querySelectorAll("#menu-phishing")
        .forEach(e => e.style.display = "none");
    }

  } catch (err) {
    console.error("Layout error:", err);
  }
}

/* ===============================
   Logout
=============================== */

window.logout = function () {
  localStorage.clear();
  window.location.href = "/login.html";
};

document.addEventListener("DOMContentLoaded", initLayout);
