// page.js
import { subscribe, getState } from "./state.js";

/* ======================================================
   Universal Page Initializer
====================================================== */

export function createPage(onReady) {

  let initialized = false;

  function run(state) {
    if (initialized) return;
    if (!state.user) return;

    initialized = true;
    onReady(state);
  }

  // run immediately if already ready
  run(getState());

  // listen for future updates
  subscribe(run);
}
