import { loadAppState } from "./state.js";
import { startLiveEngine } from "./live.js";
import { startPrefetchEngine } from "./prefetch.js";
import { startNavigationAI } from "./navigationAI.js";
import { initObservabilityUI } from "./observability.js";
import { apiFetch } from "./api.js";
import { initPhishingWizard } from "./phishingWizard.js";

/* ===============================
   USERS PAGE LOGIC
=============================== */

async function loadUsers() {
  try {
    const table = document.getElementById("usersTable");

    if (!table) return;

    const users = await apiFetch("/employees");

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
          <td colspan="3"
              class="text-center text-danger">
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

    const el =
      document.getElementById("kpi-total-users");

    if (!el) return;

    const data =
      await apiFetch("/dashboard/summary");

    document.getElementById(
      "kpi-total-users"
    ).textContent =
      data.total_users ?? "--";

    document.getElementById(
      "kpi-compliant-users"
    ).textContent =
      data.compliant_users ?? "--";

    document.getElementById(
      "kpi-pending-training"
    ).textContent =
      data.pending_training ?? "--";

    document.getElementById(
      "kpi-failed-phishing"
    ).textContent =
      data.failed_phishing ?? "--";

    document.getElementById(
      "kpi-awareness-score"
    ).textContent =
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

    await loadAppState();

    startLiveEngine();
    startPrefetchEngine();
    startNavigationAI();

    initObservabilityUI();

    await loadUsers();
    await loadDashboard();

    // ✅ ONLY wizard system
    initPhishingWizard();

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  bootstrap
);
