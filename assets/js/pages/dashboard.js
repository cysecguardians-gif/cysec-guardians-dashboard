import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";
import { onLiveUpdate } from "../core/live.js";

/* ======================================================
   HELPERS
====================================================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

function safeArray(data) {
  return Array.isArray(data) ? data : [];
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
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
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
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

/* ======================================================
   ANALYTICS LOADERS
====================================================== */

async function loadAnalytics() {

  const trend = safeArray(
    await apiFetch("/analytics/phishing-trend")
  );

  createPhishingTrendChart(
    trend.map(i => i.date),
    trend.map(i => i.value)
  );

  const dept = safeArray(
    await apiFetch("/analytics/department-risk")
  );

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
    console.error("Dashboard load failed:", err);
  }
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {

  // Initial load
  loadDashboard();

  // ⭐ Global live engine updates
  onLiveUpdate(() => {
    loadDashboard();
  });

});
