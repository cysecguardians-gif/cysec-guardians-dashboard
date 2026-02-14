import { createPage } from "../core/page.js";
import { getCache, subscribeCache } from "../core/cache.js";

/* ======================================================
   HELPERS
====================================================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
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
   LOAD FROM CACHE
====================================================== */

function loadKPIsFromCache() {
  const data = getCache("dashboard_summary");
  if (!data) return;

  setText("kpi-total-users", data.total_users);
  setText("kpi-compliant-users", data.compliant_users);
  setText("kpi-pending-training", data.pending_training);
  setText("kpi-failed-phishing", data.failed_phishing);
  setText("kpi-awareness-score", data.awareness_score);
}

function loadAnalyticsFromCache() {
  const trend = getCache("phishing_trend") || [];
  const dept = getCache("department_risk") || [];

  createPhishingTrendChart(
    trend.map(i => i.date),
    trend.map(i => i.value)
  );

  createDepartmentRiskChart(
    dept.map(i => i.department),
    dept.map(i => i.risk_score)
  );
}

/* ======================================================
   PAGE INIT
====================================================== */

createPage(() => {

  // initial load from cache
  loadKPIsFromCache();
  loadAnalyticsFromCache();

  // reactive cache updates
  subscribeCache("dashboard_summary", loadKPIsFromCache);
  subscribeCache("phishing_trend", loadAnalyticsFromCache);
  subscribeCache("department_risk", loadAnalyticsFromCache);

});
