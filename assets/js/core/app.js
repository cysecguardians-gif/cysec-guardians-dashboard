import { loadAppState } from "./state.js";
import { startLiveEngine } from "./live.js";
import { startPrefetchEngine } from "./prefetch.js";
import { startNavigationAI } from "./navigationAI.js";
import { initObservabilityUI } from "./observability.js";

async function bootstrap() {
  try {
    await loadAppState();

    //startLiveEngine();
    //startPrefetchEngine();
    //startNavigationAI();

    initObservabilityUI();

    console.log("App bootstrapped");

  } catch (err) {
    console.error("Bootstrap failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", bootstrap);
