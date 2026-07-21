// ============================================================
// POINT FOCAL ADMIN V1
// Configuration et fonctions communes
// ============================================================

const ADMIN_CONFIG = {
    API_URL: "https://point-focal.onrender.com/api",
    TOKEN_KEY: "point_focal_admin_token",
    USER_KEY: "point_focal_admin_user"
};


// ============================================================
// GESTION DU TOKEN
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
// GESTION DE L’ADMINISTRATEUR
// ============================================================

function getAdminUser() {
    const savedUser = localStorage.getItem(
        ADMIN_CONFIG.USER_KEY
    );

    if