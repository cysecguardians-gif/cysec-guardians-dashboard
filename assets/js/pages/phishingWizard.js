// phishingWizard.js
// Intelligent Wizard Engine (KnowBe4-style)

import { showToast } from "../core/ui.js";
import { getCache } from "../core/cache.js";


/* ======================================================
   ELEMENTS
====================================================== */

const homeView = document.getElementById("phishingHomeView");
const wizardView = document.getElementById("campaignWizardView");

const stepContainer = document.getElementById("wizardStepContainer");

const btnLaunch = document.getElementById("createCampaignBtn");
const btnCancel = document.getElementById("cancelWizardBtn");
const btnNext = document.getElementById("wizardNextBtn");
const btnBack = document.getElementById("wizardBackBtn");

const stepIndicators =
  document.querySelectorAll(".wizard-step");

/* ======================================================
   STATE
====================================================== */

let currentStep = 0;

const campaignDraft = {
  goal: null,
  targets: null,
  template: null,
  domain: null,
  schedule: null
};

/* ======================================================
   STEP CONFIG
====================================================== */

const steps = [
  {
    render: renderGoalStep,
    validate: () => !!campaignDraft.goal
  },
  {
    render: renderTargetsStep,
    validate: () => true
  },
  {
    render: renderTemplateStep,
    validate: () => true
  },
  {
    render: renderDomainStep,
    validate: () => true
  },
  {
    render: renderScheduleStep,
    validate: () => true
  },
  {
    render: renderReviewStep,
    validate: () => true
  }
];

/* ======================================================
   VIEW TOGGLE
====================================================== */

function openWizard() {
  homeView.classList.add("d-none");
  wizardView.classList.remove("d-none");

  currentStep = 0;
  renderStep();
}

function closeWizard() {
  wizardView.classList.add("d-none");
  homeView.classList.remove("d-none");
}

/* ======================================================
   STEP CONTROL
====================================================== */

function renderStep() {

  updateStepIndicator();

  steps[currentStep].render();

  btnBack.disabled = currentStep === 0;

  btnNext.textContent =
    currentStep === steps.length - 1
      ? "Launch Campaign"
      : "Next Step";

  updateNextButton();
}

function updateNextButton() {

  const valid = steps[currentStep].validate();
  btnNext.disabled = !valid;
}

function nextStep() {

  if (!steps[currentStep].validate()) {
    showToast("Please complete this step", "error");
    return;
  }

  if (currentStep === steps.length - 1) {
    launchCampaign();
    return;
  }

  currentStep++;
  renderStep();
}

function prevStep() {
  if (currentStep === 0) return;

  currentStep--;
  renderStep();
}

/* ======================================================
   STEP INDICATOR
====================================================== */

function updateStepIndicator() {
  stepIndicators.forEach((el, i) => {
    el.classList.toggle("active", i === currentStep);
  });
}

/* ======================================================
   STEP 1 — GOAL (INTELLIGENT)
====================================================== */

function renderGoalStep() {

  stepContainer.innerHTML = `
    <h5>Step 1 — Campaign Goal</h5>
    <p class="text-muted">
      Select what you want to test.
    </p>

    <div class="row g-3">
      ${goalBtn("invoice","Invoice Fraud")}
      ${goalBtn("credential","Credential Theft")}
      ${goalBtn("hr","HR / Payroll")}
    </div>
  `;

  document.querySelectorAll(".goal-btn")
    .forEach(btn => {
      btn.addEventListener("click", () => {

        campaignDraft.goal =
          btn.dataset.goal;

        showToast("Goal selected","success");

        // 🔥 Intelligent reaction:
        applyGoalDefaults();

        updateNextButton();
      });
    });
}

function goalBtn(id,label){
  return `
  <div class="col-md-4">
    <button class="btn btn-outline-primary w-100 goal-btn"
      data-goal="${id}">
      ${label}
    </button>
  </div>`;
}

/* ======================================================
   SMART DEFAULTS
====================================================== */

function applyGoalDefaults() {

  // intelligent recommendation logic
  if (campaignDraft.goal === "invoice") {
    campaignDraft.template = "invoice_template";
  }

  if (campaignDraft.goal === "credential") {
    campaignDraft.template = "login_template";
  }

  if (campaignDraft.goal === "hr") {
    campaignDraft.template = "hr_template";
  }

  console.log("Smart defaults applied", campaignDraft);
}

/* ======================================================
   STEP 2
====================================================== */

function renderTargetsStep() {
  stepContainer.innerHTML = `
    <h5>Step 2 — Target Users</h5>
    <p class="text-muted">
      Target selector coming next.
    </p>
  `;
}

/* ======================================================
   STEP 3 (SMART TEMPLATE)
====================================================== */

function renderTemplateStep() {

  stepContainer.innerHTML = `
    <h5>Step 3 — Template</h5>

    <div class="alert alert-info">
      Recommended template:
      <strong>${campaignDraft.template || "None"}</strong>
    </div>

    <p class="text-muted">
      Template selector UI here.
    </p>
  `;
}

/* ======================================================
   STEP 4
====================================================== */

function renderDomainStep() {
  stepContainer.innerHTML = `
    <h5>Step 4 — Domain</h5>
    <p class="text-muted">Domain setup here.</p>
  `;
}

/* ======================================================
   STEP 5
====================================================== */

function renderScheduleStep() {
  stepContainer.innerHTML = `
    <h5>Step 5 — Schedule</h5>
    <p class="text-muted">Schedule settings here.</p>
  `;
}

/* ======================================================
   STEP 6 — REVIEW
====================================================== */

function renderReviewStep() {

  stepContainer.innerHTML = `
    <h5>Step 6 — Review</h5>

    <div class="alert alert-info">
      <strong>Goal:</strong> ${campaignDraft.goal || "--"}<br>
    </div>
  `;
}

/* ======================================================
   FINAL
====================================================== */

function launchCampaign() {

  console.log("Launching:", campaignDraft);

  showToast("Campaign launched!", "success");

  closeWizard();
}

/* ======================================================
   EVENTS
====================================================== */

btnLaunch?.addEventListener("click", openWizard);
btnCancel?.addEventListener("click", closeWizard);

btnNext?.addEventListener("click", nextStep);
btnBack?.addEventListener("click", prevStep);

/* ======================================================
   INIT
====================================================== */

export function initPhishingWizard() {
  console.log("Intelligent wizard ready");
}
