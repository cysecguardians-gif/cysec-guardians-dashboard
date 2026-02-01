if (!localStorage.getItem("auth_token")) {
  window.location.href = "/login.html";
}

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

  const sidebar = document.getElementById("sidebar");
  sidebar.style.visibility = "hidden";

  // Hide by CSS, DO NOT remove
  if (!me.training_enabled) {
    document.querySelectorAll(".menu-training").forEach(e => {
      e.style.display = "none";
    });
  }

  if (!me.phishing_enabled) {
    document.querySelectorAll(".menu-phishing").forEach(e => {
      e.style.display = "none";
    });
  }

  if (me.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(e => {
      e.style.display = "none";
    });
  }

  // Force CoreUI to recalc layout after visibility changes
  setTimeout(() => {
    sidebar.style.visibility = "visible";
    window.dispatchEvent(new Event('resize'));
  }, 50);
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", initLayout);
