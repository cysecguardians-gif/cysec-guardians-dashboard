// layout.js
import { apiFetch } from "/assets/js/api.js";

/* ===============================
   Auth Guard
=============================== */

function requireAuth() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    window.location.href = "/login.html";
  }
}

/* ===============================
   Logout
=============================== */

export function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

window.logout = logout;

/* ===============================
   Layout Init
=============================== */

async function initLayout() {
  try {
    requireAuth();

    const me = await apiFetch("/me");

    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    sidebar.style.visibility = "hidden";

    // Training menu
    if (!me.training_enabled) {
      document.querySelectorAll("#menu-training")
        .forEach(e => e.style.display = "none");
    }

    // Phishing menu
    if (!me.phishing_enabled) {
      document.querySelectorAll("#menu-phishing")
        .forEach(e => e.style.display = "none");
    }

    // Admin only
    if (me.role !== "admin") {
      document.querySelectorAll(".admin-only")
        .forEach(e => e.style.display = "none");
    }

    setTimeout(() => {
      sidebar.style.visibility = "visible";
      window.dispatchEvent(new Event("resize"));
    }, 50);

  } catch (err) {
    console.error("Layout init failed", err);
    logout();
  }
}

document.addEventListener("DOMContentLoaded", initLayout);
