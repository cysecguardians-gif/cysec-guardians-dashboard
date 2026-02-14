// observability.js
// Developer Observability Dashboard

const logs = [];
const listeners = new Set();

let enabled = false;

/* ======================================================
   LOG SYSTEM
====================================================== */

export function logEvent(type, message, data = null) {

  const entry = {
    time: new Date().toLocaleTimeString(),
    type,
    message,
    data
  };

  logs.unshift(entry);

  if (logs.length > 100) {
    logs.pop();
  }

  notify();
}

export function getLogs() {
  return logs;
}

/* ======================================================
   LISTENERS
====================================================== */

function notify() {
  listeners.forEach(fn => fn(logs));
}

export function subscribeLogs(fn) {
  listeners.add(fn);
  fn(logs);

  return () => listeners.delete(fn);
}

/* ======================================================
   TOGGLE
====================================================== */

export function toggleObservability() {
  enabled = !enabled;
  document.getElementById("dev-observability")
    ?.classList.toggle("show", enabled);
}

/* ======================================================
   INIT UI
====================================================== */

export function initObservabilityUI() {

  if (document.getElementById("dev-observability")) return;

  const panel = document.createElement("div");

  panel.id = "dev-observability";

  panel.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 380px;
    max-height: 400px;
    background:#111;
    color:#0f0;
    font-family: monospace;
    font-size:12px;
    overflow:auto;
    z-index:99999;
    padding:10px;
    border-radius:8px;
    display:none;
  `;

  panel.innerHTML = `<b>Developer Observability</b><hr/>`;

  document.body.appendChild(panel);

  subscribeLogs(renderLogs);

  // Ctrl + Shift + D
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
      toggleObservability();
    }
  });
}

/* ======================================================
   RENDER
====================================================== */

function renderLogs(logs) {
  const panel = document.getElementById("dev-observability");
  if (!panel) return;

  panel.innerHTML =
    `<b>Developer Observability</b><hr/>` +
    logs.map(l =>
      `<div>[${l.time}] <b>${l.type}</b> — ${l.message}</div>`
    ).join("");
}
