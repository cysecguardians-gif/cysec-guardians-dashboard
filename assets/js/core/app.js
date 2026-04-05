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

    const orgId = localStorage.getItem("org_id");

    if (!orgId) {
      console.error("Missing org_id");
      table.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-danger">
            Missing organization ID
          </td>
        </tr>
      `;
      return;
    }

    const users = await apiFetch(`/employees?org_id=${orgId}`);

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
   BOOTSTRAP
=============================== */

async function bootstrap() {
  try {
    await loadAppState();

    startLiveEngine();
    startPrefetchEngine();
    startNavigationAI();

    initObservabilityUI();

    // 🔥 ADD THIS
    await loadUsers();

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
