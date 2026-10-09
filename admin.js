// ============================================================
// ADMIN.JS - Version Smart Mode (Fonctionne avec ou sans API)
// ============================================================

const ADMIN_CONFIG = {
    API_URL: "https://point-focal.onrender.com/api",
    TOKEN_KEY: "point_focal_admin_token",
    USER_KEY: "point_focal_admin_user"
};

// ============================================================
// CONFIGURATION SMART MODE
// ============================================================

const SMART_MODE = {
    // ⚠️ METTRE A FALSE EN PRODUCTION
    ENABLED: false,
    AUTO_SIMULATE: false,
    AUTO_LOGIN: false
};

// ============================================================
// FONCTIONS DE BASE
// ============================================================

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

// ============================================================
// SMART API CALL - Fonctionne avec ou sans API
// ============================================================

async function adminApiCall(endpoint, options = {}) {
    const token = getAdminToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        // Tentative d'appel API réel
        const response = await fetch(`${ADMIN_CONFIG.API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const responseText = await response.text();
        let data = {};

        if (responseText) {
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error("Réponse non JSON :", responseText);
                throw new Error("Le serveur a retourné une réponse invalide.");
            }
        }

        if (!response.ok) {
            throw new Error(data.message || data.error || `Erreur serveur ${response.status}.`);
        }

        return data.data ?? data;

    } catch (error) {
        // Si l'API échoue ET que le mode auto-simulation est activé
        if (SMART_MODE.AUTO_SIMULATE) {
            console.warn('🔧 [SMART MODE] API hors ligne, utilisation des données simulées pour:', endpoint);
            return getSimulatedData(endpoint, options);
        }
        
        // Sinon, propager l'erreur
        console.error("Erreur réseau :", error);
        throw new Error(error.message || String(error));
    }
}

// ============================================================
// DONNÉES SIMULÉES (quand l'API est hors ligne)
// ============================================================

function getSimulatedData(endpoint, options = {}) {
    // Simuler le login
    if (endpoint === '/admin/login') {
        const body = options.body ? JSON.parse(options.body) : {};
        return {
            token: 'sim-token-' + Date.now(),
            user: {
                id: 'sim-1',
                email: body.email || 'admin@sim.local',
                role: 'admin'
            }
        };
    }

    // Simuler le dashboard
    if (endpoint === '/admin/dashboard') {
        return {
            users: 42,
            leaders: 8,
            payments: 156,
            opportunities: 12
        };
    }

    // Simuler les utilisateurs
    if (endpoint === '/admin/users') {
        return Array.from({ length: 15 }, (_, i) => ({
            id: `user-${i+1}`,
            email: `utilisateur${i+1}@pointfocal.com`,
            whatsapp: `+33${String(600000000 + i).padStart(9, '0')}`,
            is_leader: i % 3 === 0,
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
    }

    // Simuler les opportunités
    if (endpoint === '/admin/opportunities') {
        return [
            {
                id: 'opp-1',
                name: 'Victory World',
                description: 'Opportunité internationale de croissance',
                status: 'active',
                default_language: 'fr',
                prelaunch_enabled: true,
                public_open: false,
                url: 'https://victory-world.com',
                created_at: new Date().toISOString()
            },
            {
                id: 'opp-2',
                name: 'Eco Green Project',
                description: 'Projet écologique pour les entreprises',
                status: 'draft',
                default_language: 'en',
                prelaunch_enabled: false,
                public_open: true,
                url: 'https://eco-green.com',
                created_at: new Date().toISOString()
            },
            {
                id: 'opp-3',
                name: 'Digital Academy',
                description: 'Formation numérique pour les leaders',
                status: 'inactive',
                default_language: 'fr',
                prelaunch_enabled: true,
                public_open: false,
                url: 'https://digital-academy.com',
                created_at: new Date().toISOString()
            }
        ];
    }

    // Simuler la création/modification
    if (options.method === 'POST' || options.method === 'PUT') {
        const body = options.body ? JSON.parse(options.body) : {};
        return {
            success: true,
            id: 'sim-' + Date.now(),
            ...body
        };
    }

    // Réponse par défaut
    return { success: true, message: 'Mode simulation' };
}

// ============================================================
// AUTO-LOGIN (si activé)
// ============================================================

if (SMART_MODE.AUTO_LOGIN && !getAdminToken()) {
    const autoToken = 'auto-token-' + Date.now();
    saveAdminToken(autoToken);
    saveAdminUser({
        id: 'auto-1',
        email: 'admin@pointfocal.local',
        role: 'admin'
    });
    console.log('🔧 [SMART MODE] Session admin auto-créée');
}

// ============================================================
// PROTECTION DES PAGES ADMIN
// ============================================================

function protectAdminPage() {
    const token = getAdminToken();
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes("login-admin.html");

    // Si pas de token et pas sur la page de login
    if (!token && !isLoginPage) {
        window.location.href = "login-admin.html?release=989f8b9fcc4c";
    }
}

// ============================================================
// DÉCONNEXION
// ============================================================

function logoutAdmin() {
    removeAdminToken();
    removeAdminUser();
    window.location.href = "login-admin.html?release=989f8b9fcc4c";
}

// ============================================================
// AFFICHAGE DES MESSAGES
// ============================================================

function showAdminMessage(elementOrId, messageText, color = "#ff5b5b") {
    let element;
    if (typeof elementOrId === "string") {
        element = document.getElementById(elementOrId);
    } else {
        element = elementOrId;
    }

    if (!element) {
        console.error("Zone de message introuvable.");
        return;
    }

    element.textContent = messageText;
    element.style.color = color;
}

// ============================================================
// FONCTIONS UTILES POUR OPPORTUNITIES
// ============================================================

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

console.log('🚀 [SMART MODE] Admin.js chargé avec succès');