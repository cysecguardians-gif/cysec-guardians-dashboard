import { PAGE_CONFIG } from "./core/pageConfig.js";
import { getState } from "./core/state.js";

/* ===============================
   Helpers
=============================== */

function getCurrentPage() {
  return window.location.pathname.split("/").pop();
}

function setActiveNav(navPath) {
  document.querySelectorAll(".sidebar-nav .nav-link")
    .forEach(link => link.classList.remove("active"));

  const active = document.querySelector(
    `.sidebar-nav a[href="${navPath}"]`
  );

  if (active) active.classList.add("active");
}

function setPageTitle(title) {
  const headerTitle = document.querySelector("header h5");
  if (headerTitle) headerTitle.textContent = title;
  document.title = title;
}

/* ===============================
   Layout Init
=============================== */

function initLayout() {
  const page = getCurrentPage();
  const config = PAGE_CONFIG[page];

  if (config) {
    setActiveNav(config.nav);
    setPageTitle(config.title);
  }

  // 🔥 USE GLOBAL STATE
  const { user } = getState();

  if (!user) return;

  if (!user.training_enabled) {
    document.querySelectorAll("#menu-training")
      .forEach(e => e.style.display = "none");
  }

  if (!user.phishing_enabled) {
    document.querySelectorAll("#menu-phishing")
      .forEach(e => e.style.display = "none");
  }
}

window.logout = function () {
  localStorage.clear();
  window.location.href = "/login.html";
};

document.addEventListener("DOMContentLoaded", initLayout);
