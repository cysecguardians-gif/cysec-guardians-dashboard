import { createPage } from "../core/page.js";
import { getCache, subscribeCache } from "../core/cache.js";
import { initPhishingWizard } from "./phishingWizard.js";

/* ======================================================
   TABLE RENDER
====================================================== */

function getTable() {
  return document.getElementById("campaignTable");
}

function renderCampaigns(data) {
  const table = getTable();
  if (!table) return;

  table.innerHTML = "";

  if (!data?.length) {
    table.innerHTML =
      `<tr><td colspan="3" class="text-center">
        No campaigns found
      </td></tr>`;
    return;
  }

  data.forEach(c => {
    table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.status}</td>
        <td>${c.launch_date || ""}</td>
      </tr>
    `;
  });
}

/* ======================================================
   BUTTON ACTIONS (NEW)
====================================================== */

function bindButtons() {

  document
    .getElementById("manageTemplatesBtn")
    ?.addEventListener("click", () => {
      window.open(
        "https://34.135.161.255:3333/templates",
        "_blank"
      );
    });

  document
    .getElementById("createTemplateBtn")
    ?.addEventListener("click", () => {
      window.open(
        "https://34.135.161.255:3333/templates",
        "_blank"
      );
    });

  document
    .getElementById("manageDomainsBtn")
    ?.addEventListener("click", () => {
      window.open(
        "https://34.135.161.255:3333",
        "_blank"
      );
    });

  document
    .getElementById("createCampaignBtn")
    ?.addEventListener("click", () => {
      initPhishingWizard();
    });
}

/* ======================================================
   INIT
====================================================== */

function loadFromCache() {
  renderCampaigns(getCache("phishing_campaigns") || []);
}

createPage(() => {
  loadFromCache();
  subscribeCache("phishing_campaigns", loadFromCache);

  bindButtons();
});
