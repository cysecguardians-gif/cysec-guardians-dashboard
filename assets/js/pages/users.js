import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";
import { getState } from "../core/state.js";

/* ======================================================
   DOM HELPER
====================================================== */

function getTable() {
  return document.getElementById("usersTable");
}

/* ======================================================
   RENDER USERS
====================================================== */

function renderUsers(users = []) {
  const table = getTable();
  if (!table) return;

  table.innerHTML = "";

  if (!users.length) {
    table.innerHTML =
      `<tr>
        <td colspan="3" class="text-center">
          No users found
        </td>
      </tr>`;
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

/* ======================================================
   LOAD USERS
====================================================== */

async function loadUsers() {
  try {
    const { user } = getState();

    if (!user?.org_id) return;

    const users = await apiFetch(
      `/employees?org_id=${user.org_id}`
    );

    renderUsers(users);

  } catch (err) {
    console.error("Failed loading users:", err);
  }
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {
  loadUsers();
});
