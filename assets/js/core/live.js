import { apiFetch } from "./api.js";
import { setCache } from "./cache.js";
import { onVisibilityChange } from "./scheduler.js";

const listeners = new Set();

let ws = null;
let pollTimer = null;

let started = false;

/* ======================================================
   INTERVALS
====================================================== */

const FAST_INTERVAL = 30000;   // active tab
const SLOW_INTERVAL = 180000;  // hidden tab (3 mins)

let currentInterval = FAST_INTERVAL;

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
   CACHE REFRESH
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
    console.error("Live refresh failed:", err);
  }
}

/* ======================================================
   POLLING MODE
====================================================== */

function restartPolling(interval) {

  currentInterval = interval;

  if (pollTimer) {
    clearInterval(pollTimer);
  }

  refreshCache();

  pollTimer = setInterval(
    refreshCache,
    currentInterval
  );

  console.log(
    "Live polling interval:",
    currentInterval
  );
}

/* ======================================================
   WEBSOCKET MODE
====================================================== */

function connectWebSocket() {

  try {
    ws = new WebSocket(
      "wss://cysec-backend.onrender.com/ws/live"
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        if (data.key) {
          setCache(data.key, data.payload);
          emit();
        }

      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onclose = () => {
      console.warn("WS closed → polling fallback");
      restartPolling(FAST_INTERVAL);
    };

    ws.onerror = () => {
      console.warn("WS error → polling fallback");
      restartPolling(FAST_INTERVAL);
    };

  } catch {
    restartPolling(FAST_INTERVAL);
  }
}

/* ======================================================
   ADAPTIVE BEHAVIOR
====================================================== */

function setupAdaptiveScheduling() {

  onVisibilityChange((visible) => {

    if (ws && ws.readyState === WebSocket.OPEN) {
      // websocket already efficient
      return;
    }

    if (visible) {
      restartPolling(FAST_INTERVAL);
    } else {
      restartPolling(SLOW_INTERVAL);
    }
  });
}

/* ======================================================
   START ENGINE
====================================================== */

export function startLiveEngine() {
  if (started) return;

  started = true;

  connectWebSocket();
  setupAdaptiveScheduling();

  console.log("Adaptive Live Engine started");
}

/* ======================================================
   STOP ENGINE
====================================================== */

export function stopLiveEngine() {
  if (ws) ws.close();
  if (pollTimer) clearInterval(pollTimer);

  ws = null;
  pollTimer = null;
  started = false;
}
