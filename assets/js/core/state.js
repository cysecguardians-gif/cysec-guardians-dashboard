// state.js
import { apiFetch } from "./api.js";

/* ===============================
   GLOBAL APP STATE
=============================== */

const state = {
  user: null,
  org: null,
  loaded: false
};

/* ===============================
   Load App State (once)
=============================== */

export async function loadAppState() {
  if (state.loaded) return state;

  try {
    const me = await apiFetch("/me");

    state.user = me;
    state.org = {
      id: me.org_id
    };

    state.loaded = true;

    return state;

  } catch (err) {
    console.error("Failed loading app state", err);
    throw err;
  }
}

/* ===============================
   Get State
=============================== */

export function getState() {
  return state;
}
