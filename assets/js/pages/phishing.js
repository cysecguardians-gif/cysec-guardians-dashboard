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
        <td>${c.created_at || ""}</td>
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
      alert("Predefined templates will be available soon");
    });

  document
    .getElementById("createTemplateBtn")
    ?.addEventListener("click", () => {
      alert("Custom templates are currently disabled for compliance");
    });

  document
    .getElementById("manageDomainsBtn")
    ?.addEventListener("click", () => {
      alert("Domain management handled via SendGrid");
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
