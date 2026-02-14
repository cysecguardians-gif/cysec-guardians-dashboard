import { createPage } from "../core/page.js";
import { getCache, subscribeCache } from "../core/cache.js";
import { initPhishingWizard } from "./phishingWizard.js";

/* ======================================================
   HELPERS
====================================================== */

function getTable() {
  return document.getElementById("campaignTable");
}

function renderCampaigns(data) {
  const table = getTable();
  if (!table) return;

  table.innerHTML = "";

  if (!Array.isArray(data) || !data.length) {
    table.innerHTML = `
      <tr>
        <td colspan="3" class="text-center">
          No campaigns found
        </td>
      </tr>`;
    return;
  }

  data.forEach(c => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${c.name || ""}</td>
      <td>${c.status || ""}</td>
      <td>${c.launch_date || ""}</td>
    `;

    table.appendChild(row);
  });
}

/* ======================================================
   LOAD FROM CACHE
====================================================== */

function loadCampaignsFromCache() {
  renderCampaigns(
    getCache("phishing_campaigns") || []
  );
}

/* ======================================================
   PAGE INIT
====================================================== */

createPage(() => {

  // initial render
  loadCampaignsFromCache();

  // wizard init (runs once)
  initPhishingWizard();

  // live updates subscription
  const unsubscribe = subscribeCache(
    "phishing_campaigns",
    loadCampaignsFromCache
  );

  // cleanup (important for enterprise architecture)
  return () => {
    unsubscribe();
  };
});
