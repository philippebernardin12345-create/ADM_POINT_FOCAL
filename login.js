const API_BASE_URL = "https://point-focal.onrender.com/api";

const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");
const button = document.getElementById("loginButton");
const message = document.getElementById("loginMessage");

async function loginAdmin() {
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!email || !password) {
    showMessage("Entre ton email et ton mot de passe.");
    return;
  }

  button.disabled = true;
  button.textContent = "Connexion...";
  showMessage("");

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));
    const result = payload.data || payload;

    if (!response.ok || !result.token) {
      throw new Error(payload.message || "Identifiants incorrects.");
    }

    localStorage.setItem("point_focal_admin_token", result.token);
    if (result.user) {
      localStorage.setItem("point_focal_admin_user", JSON.stringify(result.user));
    }
    showMessage("Connexion réussie.", "#4cff8a");
    window.location.href = "dashboard-admin.html?release=20261009-admin-refresh2";
  } catch (error) {
    showMessage(error.message || "La connexion a échoué.");
    button.disabled = false;
    button.textContent = "Se connecter";
  }
}

function showMessage(text, color = "#ff6b6b") {
  message.textContent = text;
  message.style.color = color;
}

button.addEventListener("click", loginAdmin);
emailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginAdmin();
});
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginAdmin();
});
