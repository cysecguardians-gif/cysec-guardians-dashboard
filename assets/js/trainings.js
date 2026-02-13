import { apiFetch } from "/assets/js/api.js";

const assignedTable = document.getElementById("assignedTrainingTable");
const catalogTable = document.getElementById("trainingCatalogTable");

function renderAssigned(data) {
  assignedTable.innerHTML = "";

  data.forEach(t => {
    assignedTable.innerHTML += `
      <tr>
        <td>${t.name}</td>
        <td>${t.users_assigned}</td>
        <td>${t.completion}%</td>
        <td><button class="btn btn-sm btn-warning">Reassign</button></td>
      </tr>
    `;
  });
}

function renderCatalog(data) {
  catalogTable.innerHTML = "";

  data.forEach(t => {
    catalogTable.innerHTML += `
      <tr>
        <td>${t.name}</td>
        <td>${t.category}</td>
        <td>${t.difficulty}</td>
        <td><button class="btn btn-sm btn-primary">Assign</button></td>
      </tr>
    `;
  });
}

async function loadTrainings() {
  try {
    renderAssigned(await apiFetch("/trainings/assigned"));
    renderCatalog(await apiFetch("/trainings/catalog"));
  } catch (err) {
    console.error(err);
  }
}

loadTrainings();
