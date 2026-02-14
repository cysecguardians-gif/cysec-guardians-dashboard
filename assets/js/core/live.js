// live.js
// WebSocket-ready Live Engine

import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";

const listeners = new Set();

let started = false;
let ws = null;
let fallbackInterval = null;

const POLL_INTERVAL = 60000;

/* ======================================================
   PUBLIC SUBSCRIBE
====================================================== */

export function onLiveUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (err) {
      console.error("Live listener error:", err);
    }
  });
}

/* ======================================================
   CACHE REFRESH (fallback polling)
====================================================== */

async function refreshCache() {
  try {
    setCache(
      "dashboard_summary",
      await apiFetch("/dashboard/summary")
    );

    setCache(
      "phishing_trend",
      await apiFetch("/analytics/phishing-trend")
    );

    setCache(
      "department_risk",
      await apiFetch("/analytics/department-risk")
    );

    setCache(
      "phishing_campaigns",
      await apiFetch("/phishing/campaigns")
    );

    emit();

  } catch (err) {
    console.error("Cache refresh failed:", err);
  }
}

/* ======================================================
   WEBSOCKET MODE
====================================================== */

function connectWebSocket() {
  try {
    ws = new WebSocket("wss://cysec-backend.onrender.com/ws/live");

    ws.onopen = () => {
      console.log("Live WS connected");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        // expected format:
        // { key: "dashboard_summary", payload: {...} }

        if (data.key) {
          setCache(data.key, data.payload);
          emit();
        }

      } catch (err) {
        console.error("WS message error:", err);
      }
    };

    ws.onclose = () => {
      console.warn("WS closed → fallback polling");
      startPollingFallback();
    };

    ws.onerror = () => {
      console.warn("WS error → fallback polling");
      startPollingFallback();
    };

  } catch (err) {
    console.warn("WebSocket failed → polling mode");
    startPollingFallback();
  }
}

/* ======================================================
   FALLBACK POLLING
====================================================== */

function startPollingFallback() {
  if (fallbackInterval) return;

  refreshCache();

  fallbackInterval = setInterval(
    refreshCache,
    POLL_INTERVAL
  );
}

/* ======================================================
   START ENGINE
====================================================== */

export function startLiveEngine() {
  if (started) return;
  started = true;

  connectWebSocket();
}

/* ======================================================
   STOP ENGINE
====================================================== */

export function stopLiveEngine() {
  if (ws) ws.close();
  if (fallbackInterval) clearInterval(fallbackInterval);

  ws = null;
  fallbackInterval = null;
  started = false;
}
