import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";
import { onLiveUpdate } from "../core/live.js";

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
    table.innerHTML =
      `<tr>
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
   LOADERS
====================================================== */

async function loadCampaigns() {
  try {
    const data = await apiFetch("/phishing/campaigns");
    renderCampaigns(data);
  } catch (err) {
    console.error("Failed loading campaigns:", err);
  }
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {

  // Initial load
  loadCampaigns();

  // ⭐ Global live updates
  onLiveUpdate(() => {
    loadCampaigns();
  });

});
