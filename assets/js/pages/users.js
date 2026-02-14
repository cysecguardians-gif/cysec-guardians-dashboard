import { apiFetch } from "/assets/js/api.js";
import { getState } from "../core/state.js";
const table = document.getElementById("usersTable");

function renderUsers(users) {
  table.innerHTML = "";

  if (!users.length) {
    table.innerHTML =
      `<tr><td colspan="3" class="text-center">No users found</td></tr>`;
    return;
  }

  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.name || ""}</td>
      <td>${u.email || ""}</td>
      <td>${u.department || ""}</td>
    `;
    table.appendChild(row);
  });
}

async function loadUsers() {
  try {
    const me = await apiFetch("/me");
    const users = await apiFetch(`/employees?org_id=${me.org_id}`);
    renderUsers(users);
  } catch (err) {
    console.error(err);
  }
}

loadUsers();
