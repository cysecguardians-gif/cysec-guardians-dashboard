import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";

const REFRESH_INTERVAL = 60000;

/* ===============================
   HELPERS
=============================== */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "--";
}

/* ===============================
   LOADERS
=============================== */

async function loadKPIs() {
  const data = await apiFetch("/dashboard/summary");

  setText("kpi-total-users", data.total_users);
  setText("kpi-compliant-users", data.compliant_users);
  setText("kpi-pending-training", data.pending_training);
  setText("kpi-failed-phishing", data.failed_phishing);
  setText("kpi-awareness-score", data.awareness_score);
}

async function loadAnalytics() {
  const trend = await apiFetch("/analytics/phishing-trend");
  const dept = await apiFetch("/analytics/department-risk");

  // chart rendering here...
}

/* ===============================
   MAIN LOAD
=============================== */

async function loadDashboard() {
  await Promise.all([
    loadKPIs(),
    loadAnalytics()
  ]);
}

/* ===============================
   UNIVERSAL PAGE INIT
=============================== */

createPage(() => {
  loadDashboard();
  setInterval(loadDashboard, REFRESH_INTERVAL);
});
