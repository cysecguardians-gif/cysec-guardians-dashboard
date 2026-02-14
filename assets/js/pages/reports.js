import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";

/* ======================================================
   DOWNLOAD HANDLER
====================================================== */

async function download(type) {
  try {
    const res = await apiFetch(`/reports/${type}`);

    if (res?.url) {
      window.open(res.url, "_blank");
    }

  } catch (err) {
    console.error("Report download failed:", err);
  }
}

/* ======================================================
   EVENT BINDINGS
====================================================== */

function bindEvents() {

  document.getElementById("downloadTrainingReport")
    ?.addEventListener("click", () => download("training"));

  document.getElementById("downloadPhishingReport")
    ?.addEventListener("click", () => download("phishing"));

  document.getElementById("downloadComplianceReport")
    ?.addEventListener("click", () => download("compliance"));
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {
  bindEvents();
});
