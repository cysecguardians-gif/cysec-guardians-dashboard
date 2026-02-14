import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";

/* ======================================================
   DOM HELPERS
====================================================== */

function getAssignedTable() {
  return document.getElementById("assignedTrainingTable");
}

function getCatalogTable() {
  return document.getElementById("trainingCatalogTable");
}

/* ======================================================
   RENDERERS
====================================================== */

function renderAssigned(data = []) {
  const table = getAssignedTable();
  if (!table) return;

  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML =
      `<tr><td colspan="4" class="text-center">
        No assigned trainings
      </td></tr>`;
    return;
  }

  data.forEach(t => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${t.name || ""}</td>
      <td>${t.users_assigned ?? 0}</td>
      <td>${t.completion ?? 0}%</td>
      <td>
        <button class="btn btn-sm btn-warning">
          Reassign
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

function renderCatalog(data = []) {
  const table = getCatalogTable();
  if (!table) return;

  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML =
      `<tr><td colspan="4" class="text-center">
        No trainings available
      </td></tr>`;
    return;
  }

  data.forEach(t => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${t.name || ""}</td>
      <td>${t.category || ""}</td>
      <td>${t.difficulty || ""}</td>
      <td>
        <button class="btn btn-sm btn-primary">
          Assign
        </button>
      </td>
    `;

    table.appendChild(row);
  });
}

/* ======================================================
   LOADERS
====================================================== */

async function loadTrainings() {
  try {
    const [assigned, catalog] = await Promise.all([
      apiFetch("/trainings/assigned"),
      apiFetch("/trainings/catalog")
    ]);

    renderAssigned(assigned);
    renderCatalog(catalog);

  } catch (err) {
    console.error("Failed loading trainings:", err);
  }
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {
  loadTrainings();
});
