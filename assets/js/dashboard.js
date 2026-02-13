import { apiFetch } from './api.js';

async function loadDashboard() {
  const data = await apiFetch('/dashboard/summary');

  document.getElementById('total-users').innerText =
    data.total_users;

  document.getElementById('click-rate').innerText =
    data.click_rate + '%';
}

loadDashboard();

