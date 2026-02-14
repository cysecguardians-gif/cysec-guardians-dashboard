import { PAGE_CONFIG } from "./core/pageConfig.js";
import { subscribe, getState } from "./core/state.js";

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

function applyPermissions(user) {
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

function initLayout() {
  const page = getCurrentPage();
  const config = PAGE_CONFIG[page];

  if (config) {
    setActiveNav(config.nav);
    document.title = config.title;
  }

  // 🔥 REACTIVE SUBSCRIPTION
  subscribe(({ user }) => {
    applyPermissions(user);
  });

  // initial run
  applyPermissions(getState().user);
}

window.logout = function () {
  localStorage.clear();
  window.location.href = "/login.html";
};

document.addEventListener("DOMContentLoaded", initLayout);
