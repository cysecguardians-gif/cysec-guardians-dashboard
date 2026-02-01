async function initLayout() {
  if (!localStorage.getItem("auth_token")) {
    window.location.href = "/login.html";
    return;
  }

  const res = await fetch("https://cysec-backend.onrender.com/me", {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("auth_token")
    }
  });

  const me = await res.json();

  // Hide features based on flags
  if (!me.training_enabled) {
    document.querySelectorAll(".menu-training").forEach(el => el.style.display = "none");
  }

  if (!me.phishing_enabled) {
    document.querySelectorAll(".menu-phishing").forEach(el => el.style.display = "none");
  }

  // Hide admin menus for users
  if (me.role !== "admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

document.addEventListener("DOMContentLoaded", initLayout);
