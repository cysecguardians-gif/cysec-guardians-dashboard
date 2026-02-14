// dashboard.js
import { apiFetch } from "../core/api.js";
import { subscribe } from "../core/state.js";

/* ======================================================
   CONFIG
====================================================== */

const REFRESH_INTERVAL = 60000;

/* ======================================================
   HELPERS
====================================================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

function showError(err) {
  console.error("Dashboard Error:", err);
}

/* ======================================================
   KPI LOADERS
====================================================== */

async function loadKPIs() {
  const data = await apiFetch("/dashboard/summary");

  setText("kpi-total-users", data.total_users);
  setText("kpi-compliant-users", data.compliant_users);
  setText("kpi-pending-training", data.pending_training);
  setText("kpi-failed-phishing", data.failed_phishing);
  setText("kpi-awareness-score", data.awareness_score);
}

/* ======================================================
   CHARTS
====================================================== */

let phishingChart = null;
let departmentChart = null;

function createPhishingTrendChart(labels = [], values = []) {
  const ctx = document.getElementById("phishingTrendChart");
  if (!ctx) return;

  if (phishingChart) phishingChart.destroy();

  phishingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Phishing Failures",
        data: values,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

function createDepartmentRiskChart(labels = [], values = []) {
  const ctx = document.getElementById("departmentRiskChart");
  if (!ctx) return;

  if (departmentChart) departmentChart.destroy();

  departmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Risk Score",
        data: values
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

/* ======================================================
   ANALYTICS
====================================================== */

async function loadAnalytics() {
  const trend = await apiFetch("/analytics/phishing-trend");

  createPhishingTrendChart(
    trend.map(i => i.date),
    trend.map(i => i.value)
  );

  const dept = await apiFetch("/analytics/department-risk");

  createDepartmentRiskChart(
    dept.map(i => i.department),
    dept.map(i => i.risk_score)
  );
}

/* ======================================================
   MAIN DASHBOARD LOAD
====================================================== */

async function loadDashboard() {
  try {
    await Promise.all([
      loadKPIs(),
      loadAnalytics()
    ]);
  } catch (err) {
    showError(err);
  }
}

/* ======================================================
   EXPORT INIT (IMPORTANT)
====================================================== */

export function init() {

  // wait until global state is ready
  subscribe((state) => {
    if (state.user) {
      loadDashboard();
    }
  });

  // optional auto-refresh
  setInterval(loadDashboard, REFRESH_INTERVAL);
}
