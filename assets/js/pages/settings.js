import { apiFetch } from "../core/api.js";
import { createPage } from "../core/page.js";

/* ======================================================
   DOM HELPERS
====================================================== */

function getEl(id) {
  return document.getElementById(id);
}

/* ======================================================
   LOAD SETTINGS
====================================================== */

async function loadSettings() {
  try {
    const data = await apiFetch("/org/settings");

    getEl("orgName").value = data.org_name || "";
    getEl("adminEmail").value = data.admin_email || "";
    getEl("notifyPhishing").checked = !!data.notify_phishing;
    getEl("notifyTraining").checked = !!data.notify_training;

  } catch (err) {
    console.error("Failed loading settings:", err);
  }
}

/* ======================================================
   SAVE SETTINGS
====================================================== */

async function saveSettings() {
  try {
    await apiFetch("/org/settings", {
      method: "PUT",
      body: JSON.stringify({
        org_name: getEl("orgName").value,
        admin_email: getEl("adminEmail").value,
        notify_phishing: getEl("notifyPhishing").checked,
        notify_training: getEl("notifyTraining").checked
      })
    });

    alert("Settings saved");

  } catch (err) {
    console.error("Failed saving settings:", err);
  }
}

/* ======================================================
   EVENT BINDINGS
====================================================== */

function bindEvents() {
  getEl("saveSettingsBtn")
    ?.addEventListener("click", saveSettings);
}

/* ======================================================
   UNIVERSAL PAGE INIT
====================================================== */

createPage(() => {
  bindEvents();
  loadSettings();
});
