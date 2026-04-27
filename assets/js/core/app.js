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
   PHISHING PAGE LOGIC (FINAL)
=============================== */

function initPhishingUI() {

  const table = document.getElementById("campaignTable");
  if (!table) return;

  const homeView = document.getElementById("phishingHomeView");
  const wizardView = document.getElementById("campaignWizardView");

  const createBtn = document.getElementById("createCampaignBtn");
  const cancelBtn = document.getElementById("cancelWizardBtn");
  const nextBtn = document.getElementById("wizardNextBtn");
  const backBtn = document.getElementById("wizardBackBtn");

  const stepContainer = document.getElementById("wizardStepContainer");

  let currentStep = 1;

  let campaignDraft = {
    goal: null,
    template: null
  };

  /* ===============================
     LOAD CAMPAIGNS
  =============================== */

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
          <td>${c.created_at || "-"}</td>
        </tr>
      `).join("");

    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }

  loadCampaigns();

  /* ===============================
     RESET WIZARD
  =============================== */

  function resetWizard() {
    wizardView.classList.add("d-none");
    homeView.classList.remove("d-none");

    currentStep = 1;
    campaignDraft = { goal: null, template: null };

    nextBtn.textContent = "Next Step";

    renderStep1();
  }

  /* ===============================
     VIEW SWITCH
  =============================== */

  createBtn.addEventListener("click", () => {
    homeView.classList.add("d-none");
    wizardView.classList.remove("d-none");
  });

  cancelBtn.addEventListener("click", resetWizard);

  /* ===============================
     STEP 1
  =============================== */

  function renderStep1() {
    backBtn.disabled = true;

    stepContainer.innerHTML = `
      <h5>Step 1 — Campaign Goal</h5>
      <p class="text-muted">Select phishing scenario</p>

      <div class="row g-3">
        <div class="col-md-4">
          <button class="btn btn-outline-primary w-100">Invoice Fraud</button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-primary w-100">Credential Theft</button>
        </div>
        <div class="col-md-4">
          <button class="btn btn-outline-primary w-100">HR / Payroll</button>
        </div>
      </div>
    `;

    const buttons = stepContainer.querySelectorAll("button");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {

        buttons.forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline-primary");
        });

        btn.classList.remove("btn-outline-primary");
        btn.classList.add("btn-primary");

        const text = btn.innerText.trim();

switch (true) {
  case text.includes("Invoice"):
    campaignDraft.template = "invoice_template";
    break;

  case text.includes("Credential"):
    campaignDraft.template = "login_template";
    break;

  case text.includes("HR"):
    campaignDraft.template = "hr_template";
    break;

  default:
    campaignDraft.template = "default";
}

campaignDraft.goal = text;

        campaignDraft.goal = text;
      });
    });
  }

  /* ===============================
     STEP 2
  =============================== */

  function renderStep2() {
    backBtn.disabled = false;

    stepContainer.innerHTML = `
      <h5>Step 2 — Targets</h5>
      <p class="text-muted">All users will be targeted (MVP)</p>

      <div class="alert alert-info">
        All organization users will receive this campaign.
      </div>
    `;
  }

  /* ===============================
     STEP 3
  =============================== */

  function renderStep3() {
    backBtn.disabled = false;

    stepContainer.innerHTML = `
      <h5>Step 3 — Review</h5>

      <div class="card p-3">
        <p><strong>Goal:</strong> ${campaignDraft.goal}</p>
        <p><strong>Template:</strong> ${campaignDraft.template}</p>
        <p><strong>Targets:</strong> All Users</p>
      </div>
    `;

    nextBtn.textContent = "Launch Campaign 🚀";
  }

  /* ===============================
     NEXT BUTTON
  =============================== */

  nextBtn.addEventListener("click", async () => {

  // ===============================
  // STEP 1 → STEP 2
  // ===============================
  if (currentStep === 1) {
    if (!campaignDraft.template) {
      alert("Please select a goal first");
      return;
    }

    renderStep2();
    currentStep = 2;
    return;
  }

  // ===============================
  // STEP 2 → STEP 3
  // ===============================
  if (currentStep === 2) {
    renderStep3();
    currentStep = 3;
    return;
  }

  // ===============================
  // FINAL STEP → LAUNCH CAMPAIGN
  // ===============================
  if (currentStep === 3) {
    try {

      // 🔒 Prevent multiple clicks
      nextBtn.disabled = true;
      nextBtn.textContent = "Launching...";

      const stateModule = await import("./state.js");
      const state = stateModule.getState();

      // 1️⃣ Create campaign
      const campaignRes = await apiFetch("/phishing/campaign", {
        method: "POST",
        body: JSON.stringify({
          name: `${campaignDraft.goal} Campaign`,
          template_id: campaignDraft.template,
          group_id: null
        })
      });

      const campaignId = campaignRes?.[0]?.id;

      if (!campaignId) {
        throw new Error("Campaign creation failed");
      }

      // 2️⃣ Fetch users (targets)
      const users = await apiFetch("/employees");

      if (!users || users.length === 0) {
        alert("No users available to send campaign");
        nextBtn.disabled = false;
        nextBtn.textContent = "Launch Campaign 🚀";
        return;
      }

      const recipients = users.map(u => ({
        email: u.email,
        name: u.name
      }));

      // 3️⃣ Add recipients
      await apiFetch(`/phishing/campaign/${campaignId}/recipients`, {
        method: "POST",
        body: JSON.stringify({ recipients })
      });

      // 4️⃣ Send campaign
      await apiFetch(`/phishing/campaign/${campaignId}/send`, {
        method: "POST"
      });

      alert("Campaign launched successfully 🚀");

      // Reset UI
      resetWizard();
      loadCampaigns();

    } catch (err) {
      console.error(err);
      alert("Failed to launch campaign");

    } finally {
      // 🔁 Restore button state
      nextBtn.disabled = false;
      nextBtn.textContent = "Next Step";
    }
  }

});

  /* ===============================
     BACK BUTTON
  =============================== */

  backBtn.addEventListener("click", () => {

    if (currentStep === 2) {
      renderStep1();
      currentStep = 1;
    }

    else if (currentStep === 3) {
      renderStep2();
      nextBtn.textContent = "Next Step";
      currentStep = 2;
    }

  });

  renderStep1();
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
    initPhishingUI();

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
