// ui.js

/* ===============================
   Global Loader
=============================== */

export function showLoader() {
  let loader = document.getElementById("globalLoader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "globalLoader";
    loader.innerHTML = `
      <div class="loader-backdrop">
        <div class="spinner-border text-primary"></div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  loader.style.display = "flex";
}

export function hideLoader() {
  const loader = document.getElementById("globalLoader");
  if (loader) loader.style.display = "none";
}

/* ===============================
   Toast Notifications
=============================== */

export function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.className = `toast align-items-center text-bg-${type} border-0 show position-fixed bottom-0 end-0 m-3`;
  toast.style.zIndex = 9999;

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto"></button>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
