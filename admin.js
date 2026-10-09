const ADMIN_CONFIG = {
  API_URL: "https://point-focal.onrender.com/api",
  TOKEN_KEY: "point_focal_admin_token",
  USER_KEY: "point_focal_admin_user"
};

function getAdminToken() {
  return localStorage.getItem(ADMIN_CONFIG.TOKEN_KEY);
}

function saveAdminToken(token) {
  localStorage.setItem(ADMIN_CONFIG.TOKEN_KEY, token);
}

function removeAdminToken() {
  localStorage.removeItem(ADMIN_CONFIG.TOKEN_KEY);
}

function getAdminUser() {
  const savedUser = localStorage.getItem(ADMIN_CONFIG.USER_KEY);
  if (!savedUser) return null;
  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Utilisateur administrateur invalide :", error);
    return null;
  }
}

function saveAdminUser(user) {
  localStorage.setItem(ADMIN_CONFIG.USER_KEY, JSON.stringify(user));
}

function removeAdminUser() {
  localStorage.removeItem(ADMIN_CONFIG.USER_KEY);
}

async function adminApiCall(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  const token = getAdminToken();
  if (token) headers.Authorization = "Bearer " + token;

  let response;
  try {
    response = await fetch(ADMIN_CONFIG.API_URL + endpoint, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error("Le serveur est momentanément inaccessible. Vérifiez votre connexion et réessayez.");
  }

  const responseText = await response.text();
  let payload = {};
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch (error) {
      throw new Error("Le serveur a retourné une réponse illisible.");
    }
  }
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "Erreur serveur " + response.status + ".");
  }
  return payload.data ?? payload;
}

function protectAdminPage() {
  const currentPage = window.location.pathname;
  if (!getAdminToken() && !currentPage.includes("login-admin.html")) {
    window.location.replace("login-admin.html?release=20261009-admin-refresh2");
  }
}

function logoutAdmin() {
  removeAdminToken();
  removeAdminUser();
  window.location.replace("login-admin.html?release=20261009-admin-refresh2");
}

function showAdminMessage(elementOrId, messageText, color = "#ff5b5b") {
  const element = typeof elementOrId === "string"
    ? document.getElementById(elementOrId)
    : elementOrId;
  if (!element) return;
  element.textContent = messageText;
  element.style.color = color;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
