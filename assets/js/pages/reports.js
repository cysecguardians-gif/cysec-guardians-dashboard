import { apiFetch } from "/assets/js/core/api.js";
import { getState } from "../core/state.js";
async function download(type) {
  try {
    const res = await apiFetch(`/reports/${type}`);
    window.open(res.url, "_blank");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("downloadTrainingReport")
  ?.addEventListener("click", () => download("training"));

document.getElementById("downloadPhishingReport")
  ?.addEventListener("click", () => download("phishing"));

document.getElementById("downloadComplianceReport")
  ?.addEventListener("click", () => download("compliance"));
