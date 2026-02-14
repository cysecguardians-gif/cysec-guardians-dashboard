// state.js
import { apiFetch } from "./api.js";

/* ===============================
   INTERNAL STATE
=============================== */

const state = {
  user: null,
  org: null,
  loaded: false
};

const listeners = new Set();

/* ===============================
   SUBSCRIBE SYSTEM
=============================== */

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  listeners.forEach(fn => fn(state));
}

/* ===============================
   GET STATE
=============================== */

export function getState() {
  return state;
}

/* ===============================
   UPDATE STATE
=============================== */

export function updateState(updates) {
  Object.assign(state, updates);
  notify();
}

/* ===============================
   LOAD STATE ONCE
=============================== */

export async function loadAppState() {
  if (state.loaded) return state;

  const me = await apiFetch("/me");

  updateState({
    user: me,
    org: { id: me.org_id },
    loaded: true
  });

  return state;
}
