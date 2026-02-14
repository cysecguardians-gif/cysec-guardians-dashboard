// phishingWizard.js
// Universal Wizard Engine (KnowBe4-style)

import { showToast } from "../core/ui.js";

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
   WIZARD STATE
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
   STEP DEFINITIONS
====================================================== */

const steps = [
  renderGoalStep,
  renderTargetsStep,
  renderTemplateStep,
  renderDomainStep,
  renderScheduleStep,
  renderReviewStep
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

  const renderer = steps[currentStep];
  if (renderer) renderer();

  btnBack.disabled = currentStep === 0;

  btnNext.textContent =
    currentStep === steps.length - 1
      ? "Launch Campaign"
      : "Next Step";
}

function nextStep() {

  // final submit
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

  stepIndicators.forEach((el, index) => {

    el.classList.remove("active");

    if (index === currentStep) {
      el.classList.add("active");
    }
  });
}

/* ======================================================
   STEP RENDERERS
====================================================== */

function renderGoalStep() {

  stepContainer.innerHTML = `
    <h5>Step 1 — Campaign Goal</h5>
    <p class="text-muted">
      What type of phishing scenario do you want to simulate?
    </p>

    <div class="row g-3">

      ${goalButton("invoice", "Invoice Fraud")}
      ${goalButton("credential", "Credential Theft")}
      ${goalButton("hr", "HR / Payroll")}

    </div>
  `;

  attachGoalEvents();
}

function goalButton(id, label) {
  return `
    <div class="col-md-4">
      <button class="btn btn-outline-primary w-100 goal-btn"
        data-goal="${id}">
        ${label}
      </button>
    </div>
  `;
}

function attachGoalEvents() {
  document.querySelectorAll(".goal-btn")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        campaignDraft.goal =
          btn.dataset.goal;

        showToast("Goal selected", "success");
      });
    });
}

/* ---------- STEP 2 ---------- */

function renderTargetsStep() {
  stepContainer.innerHTML = `
    <h5>Step 2 — Target Users</h5>
    <p class="text-muted">
      Target selection UI comes next.
    </p>
  `;
}

/* ---------- STEP 3 ---------- */

function renderTemplateStep() {
  stepContainer.innerHTML = `
    <h5>Step 3 — Template</h5>
    <p class="text-muted">
      Template selector goes here.
    </p>
  `;
}

/* ---------- STEP 4 ---------- */

function renderDomainStep() {
  stepContainer.innerHTML = `
    <h5>Step 4 — Sending Domain</h5>
    <p class="text-muted">
      Domain selection UI here.
    </p>
  `;
}

/* ---------- STEP 5 ---------- */

function renderScheduleStep() {
  stepContainer.innerHTML = `
    <h5>Step 5 — Schedule</h5>
    <p class="text-muted">
      Scheduling UI here.
    </p>
  `;
}

/* ---------- STEP 6 ---------- */

function renderReviewStep() {

  stepContainer.innerHTML = `
    <h5>Step 6 — Review Campaign</h5>

    <div class="alert alert-info">
      <strong>Goal:</strong> ${campaignDraft.goal || "--"}
    </div>

    <p class="text-muted">
      Final review before launch.
    </p>
  `;
}

/* ======================================================
   FINAL LAUNCH
====================================================== */

function launchCampaign() {

  console.log("CAMPAIGN READY:", campaignDraft);

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
  console.log("Wizard engine ready");
}
