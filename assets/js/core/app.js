// app.js
// Global Application Bootstrap

import { loadAppState } from "./state.js";
import { startLiveEngine } from "./live.js";

/* ======================================================
   APP BOOTSTRAP
====================================================== */

async function bootstrap() {
  try {
    // 1️⃣ Load global user/org state once
    await loadAppState();

    // 2️⃣ Start global live update engine
    startLiveEngine();

    console.log("App bootstrapped successfully");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

/* ======================================================
   START APP
====================================================== */

document.addEventListener("DOMContentLoaded", bootstrap);
