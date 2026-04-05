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
    if (!el) return;

    const data = await apiFetch("/dashboard/summary");

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
   PHISHING PAGE LOGIC
=============================== */

let campaignDraft = {
  goal: null,
  template: null
};

function initPhishingUI() {

  const table = document.getElementById("campaignTable");
  if (!table) return;

  const homeView = document.getElementById("phishingHomeView");
  const wizardView = document.getElementById("campaignWizardView");

  const createBtn = document.getElementById("createCampaignBtn");
  const cancelBtn = document.getElementById("cancelWizardBtn");
  const nextBtn = document.getElementById("wizardNextBtn");

  // ===============================
  // LOAD CAMPAIGNS
  // ===============================

  async function loadCampaigns() {
    try {
      const campaigns = await apiFetch("/phishing/campaigns");

      if (!campaigns || campaigns.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="3" class="text-center">
              No campaigns yet
            </td>
          </tr>
        `;
        return;
      }

      table.innerHTML = campaigns.map(c => `
        <tr>
          <td>${c.name || "-"}</td>
          <td>${c.status || "-"}</td>
          <td>${c.scheduled_at || "-"}</td>
        </tr>
      `).join("");

    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  loadCampaigns();

  // ===============================
  // OPEN / CLOSE WIZARD
  // ===============================

  createBtn.addEventListener("click", () => {
    homeView.classList.add("d-none");
    wizardView.classList.remove("d-none");
  });

  cancelBtn.addEventListener("click", () => {
    wizardView.classList.add("d-none");
    homeView.classList.remove("d-none");
  });

  // ===============================
  // STEP 1 — GOAL SELECTION
  // ===============================

  const goalButtons = document.querySelectorAll("#wizardStepContainer button");

goalButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    // 🔥 Remove selection from all
    goalButtons.forEach(b => {
      b.classList.remove("btn-primary");
      b.classList.add("btn-outline-primary");
    });

    // 🔥 Highlight selected
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");

    const text = btn.innerText.trim();

    if (text.includes("Invoice")) {
      campaignDraft.template = "invoice_template";
    } else if (text.includes("Credential")) {
      campaignDraft.template = "login_template";
    } else {
      campaignDraft.template = "hr_template";
    }

    campaignDraft.goal = text;

    console.log("✅ Selected:", campaignDraft);
  });

});

  // ===============================
  // LAUNCH CAMPAIGN
  // ===============================

  nextBtn.addEventListener("click", async () => {

    if (!campaignDraft.template) {
      alert("Please select a goal first");
      return;
    }

    try {

      const stateModule = await import("./state.js");
      const state = stateModule.getState();

      const payload = {
        template: campaignDraft.template,
        goal: campaignDraft.goal,
        org_id: state.org.id,
        created_by: state.user.email
      };

      await apiFetch("/phishing/campaign", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      alert("Campaign launched successfully!");

      wizardView.classList.add("d-none");
      homeView.classList.remove("d-none");

      campaignDraft = { goal: null, template: null };

      loadCampaigns();

    } catch (err) {
      console.error("Campaign launch failed:", err);
      alert("Failed to launch campaign");
    }

  });

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
    initPhishingUI(); // 🔥 IMPORTANT

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
