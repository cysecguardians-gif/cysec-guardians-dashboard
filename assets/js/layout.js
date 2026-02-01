async function initLayout() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch("https://cysec-backend.onrender.com/me", {
    headers: { "Authorization": "Bearer " + token }
  });

  const me = await res.json();

  // Hide entire sidebar until rules applied
  document.getElementById("sidebar").style.visibility = "hidden";

  if (!me.training_enabled) {
    document.querySelectorAll(".menu-training").forEach(e => e.remove());
  }

  if (!me.phishing_enabled) {
    document.querySelectorAll(".menu-phishing").forEach(e => e.remove());
  }

  if (me.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(e => e.remove());
  }

  document.getElementById("sidebar").style.visibility = "visible";
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", initLayout);
