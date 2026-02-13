import { showLoader, hideLoader, showToast } from "./ui.js";

const API_BASE = "https://cysec-backend.onrender.com";

/* ===============================
   Headers
=============================== */

function getHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

/* ===============================
   Universal API
=============================== */

export async function apiFetch(path, options = {}) {
  try {
    showLoader();

    const res = await fetch(`${API_BASE}${path}`, {
      headers: getHeaders(),
      ...options
    });

    if (res.status === 401) {
      localStorage.clear();
      window.location.href = "/login.html";
      throw new Error("Session expired");
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "API Error");
    }

    return await res.json();

  } catch (err) {
    showToast(err.message, "danger");
    throw err;
  } finally {
    hideLoader();
  }
}
