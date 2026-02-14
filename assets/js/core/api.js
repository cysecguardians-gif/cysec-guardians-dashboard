// api.js
// Self-Healing API Layer

import { logEvent } from "./observability.js";

/* ======================================================
   CONFIG
====================================================== */

const API_BASE = "https://cysec-backend.onrender.com";

const MAX_RETRIES = 3;
const BASE_DELAY = 800; // ms

/* ======================================================
   HELPERS
====================================================== */

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function backoffDelay(attempt) {
  // exponential + jitter
  const jitter = Math.random() * 300;
  return BASE_DELAY * (2 ** attempt) + jitter;
}

/* ======================================================
   CORE REQUEST WITH RETRY
====================================================== */

async function requestWithRetry(url, options, attempt = 0) {

  try {

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (attempt > 0) {
      logEvent("RECOVERY", `Recovered after retry (${attempt})`);
    }

    return data;

  } catch (err) {

    logEvent(
      "ERROR",
      `API failed (${attempt}) → ${url}`
    );

    if (attempt >= MAX_RETRIES) {

      logEvent(
        "ERROR",
        `Permanent failure: ${url}`
      );

      throw err;
    }

    const delay = backoffDelay(attempt);

    logEvent(
      "RECOVERY",
      `Retrying in ${Math.round(delay)}ms`
    );

    await sleep(delay);

    return requestWithRetry(
      url,
      options,
      attempt + 1
    );
  }
}

/* ======================================================
   PUBLIC API
====================================================== */

export async function apiFetch(path, options = {}) {

  const url = `${API_BASE}${path}`;

  const config = {
    method: options.method || "GET",
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    },
    body: options.body
  };

  return requestWithRetry(url, config);
}
