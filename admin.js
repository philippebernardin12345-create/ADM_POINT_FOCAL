// ============================================================
// POINT FOCAL ADMIN V1
// ============================================================

const ADMIN_CONFIG = {
    API_URL: "https://point-focal.onrender.com/api",
    TOKEN_KEY: "point_focal_admin_token",
    USER_KEY: "point_focal_admin_user"
};


// ============================================================
// TOKEN
// ============================================================

function getAdminToken() {
    return localStorage.getItem(
        ADMIN_CONFIG.TOKEN_KEY
    );
}

function saveAdminToken(token) {
    localStorage.setItem(
        ADMIN_CONFIG.TOKEN_KEY,
        token
    );
}

function removeAdminToken() {
    localStorage.removeItem(
        ADMIN_CONFIG.TOKEN_KEY
    );
}


// ============================================================
// ADMINISTRATEUR
// ============================================================

function getAdminUser() {

    const savedUser = localStorage.getItem(
        ADMIN_CONFIG.USER_KEY
    );

    if (!savedUser) {
        return null;
    }

    try {

        return JSON.parse(
            savedUser
        );

    } catch {

        return null;
    }
}

function saveAdminUser(user) {

    localStorage.setItem(
        ADMIN_CONFIG.USER_KEY,
        JSON.stringify(user)
    );
}

function removeAdminUser() {

    localStorage.removeItem(
        ADMIN_CONFIG.USER_KEY
    );
}


// ============================================================
// APPELS API
// ============================================================

async function adminApiCall(
    endpoint,
    options = {}
) {

    const token =
        getAdminToken();

    const headers = {
        "Content-Type":
            "application/json",

        ...(options.headers || {})
    };

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;
    }

    const response =
        await fetch(
            `${ADMIN_CONFIG.API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Erreur serveur."
        );
    }

    return data;
}


// ============================================================
// PROTECTION
// ============================================================

function protectAdminPage() {

    const token =
        getAdminToken();

    const currentPage =
        window.location.pathname;

    const isLoginPage =
        currentPage.includes(
            "login-admin.html"
        );

    if (
        !token &&
        !isLoginPage
    ) {

        window.location.href =
            "login-admin.html";
    }
}


// ============================================================
// DÉCONNEXION
// ============================================================

function logoutAdmin() {

    removeAdminToken();

    removeAdminUser();

    window.location.href =
        "login-admin.html";
}


// ============================================================
// MESSAGE
// ============================================================

function showAdminMessage(
    elementId,
    message,
    color = "#ffffff"
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.style.color =
        color;
}
