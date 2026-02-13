export function requireAuth() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    window.location.href = "/login.html";
  }
}

export function logout() {
  localStorage.clear();
  window.location.href = "/login.html";
}

window.logout = logout;
