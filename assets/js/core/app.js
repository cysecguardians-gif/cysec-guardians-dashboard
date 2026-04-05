import { loadAppState } from "./state.js";
import { startLiveEngine } from "./live.js";
import { startPrefetchEngine } from "./prefetch.js";
import { startNavigationAI } from "./navigationAI.js";
import { initObservabilityUI } from "./observability.js";
import { apiFetch } from "./api.js";

/* ===============================
   USERS PAGE LOGIC
=============================== */

async function loadUsers() {
  try {
    const table = document.getElementById("usersTable");
    if (!table) return; // only run on users page

    const users = await apiFetch("/employees");

    console.log("Users API response:", users);

    if (!users || users.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="3" class="text-center">
            No users found
          </td>
        </tr>
      `;
      return;
    }

    table.innerHTML = users.map(user => `
      <tr>
        <td>${user.name || "-"}</td>
        <td>${user.email || "-"}</td>
        <td>${user.department || "-"}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("Failed to load users:", err);

    const table = document.getElementById("usersTable");
    if (table) {
      table.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">
            Failed to load users
          </td>
        </tr>
      `;
    }
  }
}

/* ===============================
   DASHBOARD LOGIC
=============================== */

async function loadDashboard() {
  try {
    const el = document.getElementById("kpi-total-users");
    if (!el) return; // only run on dashboard page

    const data = await apiFetch("/dashboard/summary");

    console.log("Dashboard API response:", data);

    document.getElementById("kpi-total-users").textContent =
      data.total_users ?? "--";

    document.getElementById("kpi-compliant-users").textContent =
      data.compliant_users ?? "--";

    document.getElementById("kpi-pending-training").textContent =
      data.pending_training ?? "--";

    document.getElementById("kpi-failed-phishing").textContent =
      data.failed_phishing ?? "--";

    document.getElementById("kpi-awareness-score").textContent =
      data.awareness_score ?? "--";

  } catch (err) {
    console.error("Dashboard load failed:", err);
  }
}

/* ===============================
   BOOTSTRAP
=============================== */

async function bootstrap() {
  try {
    // Load user + org state first
    await loadAppState();

    // Start engines
    startLiveEngine();
    startPrefetchEngine();
    startNavigationAI();

    // Observability UI
    initObservabilityUI();

    // Page-specific loaders
    await loadUsers();
    await loadDashboard();

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
