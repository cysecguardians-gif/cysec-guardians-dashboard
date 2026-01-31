const API_BASE = "https://cysec-backend.onrender.com";

// Helper to get token later (for now can be empty)
function getAuthHeaders() {
  const token = localStorage.getItem("auth_token"); // we’ll use this later
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
}

// Generic GET
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  return res.json();
}

// Generic POST
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  });

  return res.json();
}
