// navigationAI.js
// Predictive Navigation Intelligence

import { prefetchForPath } from "./prefetch.js";

/* ======================================================
   SIMPLE NAVIGATION MEMORY
====================================================== */

let lastPath = null;

// transition frequencies
const transitions = {};

/* ======================================================
   TRACK NAVIGATION
====================================================== */

function trackNavigation() {

  const current = window.location.pathname;

  if (lastPath && lastPath !== current) {

    const key = `${lastPath}=>${current}`;
    transitions[key] = (transitions[key] || 0) + 1;
  }

  lastPath = current;
}

/* ======================================================
   PREDICT NEXT PAGE
====================================================== */

function predictNext(path) {

  let best = null;
  let bestScore = 0;

  Object.entries(transitions).forEach(([k, score]) => {

    const [from, to] = k.split("=>");

    if (from !== path) return;

    if (score > bestScore) {
      best = to;
      bestScore = score;
    }
  });

  return best;
}

/* ======================================================
   PREFETCH PREDICTION
====================================================== */

function runPrediction() {

  const current = window.location.pathname;
  const predicted = predictNext(current);

  if (!predicted) return;

  console.log("Predictive prefetch:", predicted);

  prefetchForPath(predicted);
}

/* ======================================================
   START ENGINE
====================================================== */

export function startNavigationAI() {

  // track immediately
  trackNavigation();

  // run prediction shortly after page load
  setTimeout(runPrediction, 1500);

  // track sidebar clicks
  document.querySelectorAll(".sidebar-nav a")
    .forEach(link => {

      link.addEventListener("click", () => {
        trackNavigation();
      });

    });

  console.log("Predictive navigation AI started");
}
