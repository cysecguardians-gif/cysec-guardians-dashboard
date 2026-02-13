// dashboard.js
// Org Admin Dashboard Logic
// Requires: api.js (apiFetch function)

import { apiFetch } from './api.js';

/* ======================================================
   CONFIG
====================================================== */

const REFRESH_INTERVAL = 60000; // 60 sec auto refresh (optional)

/* ======================================================
   HELPERS
====================================================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

function showError(message) {
  console.error("Dashboard Error:", message);
}

/* ======================================================
   KPI LOADERS
====================================================== */

async function loadKPIs() {
  try {
    // Example endpoint (adjust to your backend)
    const data = await apiFetch('/dashboard/summary');

    setText("kpi-total-users", data.total_users);
    setText("kpi-compliant-users", data.compliant_users);
    setText("kpi-pending-training", data.pending_training);
    setText("kpi-failed-phishing", data.failed_phishing);
    setText("kpi-awareness-score", data.awareness_score);

  } catch (err) {
    showError(err);
  }
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
  try {
    // 1️⃣ Phishing trend
    const trend = await apiFetch('/analytics/phishing-trend');

    createPhishingTrendChart(
      trend.map(i => i.date),
      trend.map(i => i.value)
    );

    // 2️⃣ Department risk
    const dept = await apiFetch('/analytics/department-risk');

    createDepartmentRiskChart(
      dept.map(i => i.department),
      dept.map(i => i.risk_score)
    );

  } catch (err) {
    showError(err);
  }
}

/* ======================================================
   DASHBOARD INIT
====================================================== */

async function loadDashboard() {
  await Promise.all([
    loadKPIs(),
    loadAnalytics()
  ]);
}

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();

  // Optional auto refresh
  setInterval(loadDashboard, REFRESH_INTERVAL);
});
