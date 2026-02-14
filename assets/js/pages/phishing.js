import { apiFetch } from "/assets/js/core/api.js";
import { getState } from "../core/state.js";
const table = document.getElementById("campaignTable");

function renderCampaigns(data) {
  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML =
      `<tr><td colspan="3" class="text-center">No campaigns found</td></tr>`;
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

async function loadCampaigns() {
  try {
    const data = await apiFetch("/phishing/campaigns");
    renderCampaigns(data);
  } catch (err) {
    console.error(err);
  }
}

loadCampaigns();
