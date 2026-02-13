// api.js

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
   Universal API Function
=============================== */

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options
  });

  // Auto logout if unauthorized
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login.html";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "API request failed");
  }

  return res.json();
}
