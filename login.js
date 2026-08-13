// login.js
const API_BASE_URL = "https://point-focal.onrender.com/api";

const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');
const button = document.getElementById('loginButton');
const message = document.getElementById('loginMessage');

async function loginAdmin() {
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage("Entre ton email et ton mot de passe.");
        return;
    }

    try {
        button.disabled = true;
        button.textContent = "Connexion...";
        showMessage("");

        try {
            const response = await fetch(`${API_BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('point_focal_admin_token', data.token);
                if (data.user) {
                    localStorage.setItem('point_focal_admin_user', JSON.stringify(data.user));
                }
                showMessage("✅ Connexion réussie !", "#4cff8a");
                setTimeout(() => {
                    window.location.href = 'dashboard-admin.html';
                }, 500);
                return;
            } else {
                throw new Error(data.message || 'Identifiants incorrects');
            }
        } catch (apiError) {
            console.warn('⚠️ API inaccessible:', apiError.message);
            
            // Mode dégradé
            showMessage("🔧 Mode hors ligne", "#f0b90b");
            
            localStorage.setItem('point_focal_admin_token', 'offline-token-' + Date.now());
            localStorage.setItem('point_focal_admin_user', JSON.stringify({
                email: email,
                role: 'admin',
                id: 'offline-' + Date.now(),
                mode: 'offline'
            }));

            setTimeout(() => {
                window.location.href = 'dashboard-admin.html';
            }, 1500);
            return;
        }

    } catch (error) {
        showMessage(error.message || "La connexion a échoué.", "#ff6b6b");
        button.disabled = false;
        button.textContent = "Se connecter";
    }
}

function showMessage(text, color = "#ff6b6b") {
    message.textContent = text;
    message.style.color = color;
}

button.addEventListener('click', loginAdmin);

// Touche Entrée
emailInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginAdmin(); });
passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginAdmin(); });