import { apiFetch } from "/assets/js/api.js";

async function loadSettings() {
  const data = await apiFetch("/org/settings");

  orgName.value = data.org_name || "";
  adminEmail.value = data.admin_email || "";
  notifyPhishing.checked = !!data.notify_phishing;
  notifyTraining.checked = !!data.notify_training;
}

async function saveSettings() {
  await apiFetch("/org/settings", {
    method: "PUT",
    body: JSON.stringify({
      org_name: orgName.value,
      admin_email: adminEmail.value,
      notify_phishing: notifyPhishing.checked,
      notify_training: notifyTraining.checked
    })
  });

  alert("Settings saved");
}

document
  .getElementById("saveSettingsBtn")
  ?.addEventListener("click", saveSettings);

loadSettings();
