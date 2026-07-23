const ADMIN_CONFIG = {
    API_URL:
        "https://point-focal.onrender.com/api",

    TOKEN_KEY:
        "point_focal_admin_token",

    USER_KEY:
        "point_focal_admin_user"
};// ============================================================
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

    const savedUser =
        localStorage.getItem(
            ADMIN_CONFIG.USER_KEY
        );

    if (!savedUser) {
        return null;
    }

    try {

        return JSON.parse(
            savedUser
        );

    } catch (error) {

        console.error(
            "Utilisateur administrateur invalide :",
            error
        );

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


    let response;

try {

    response = await fetch(
        `${ADMIN_CONFIG.API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

} catch (error) {

    console.error(
        "Erreur réseau :",
        error
    );

    throw new Error(
        error.message ||
        String(error)
    );
}

let data = {};

    const responseText =
        await response.text();


    if (responseText) {

        try {

            data =
                JSON.parse(responseText);

        } catch (error) {

            console.error(
                "Réponse non JSON :",
                responseText
            );

            throw new Error(
                "Le serveur a retourné une réponse invalide."
            );
        }
    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            data.error ||
            `Erreur serveur ${response.status}.`
        );
    }


    return data;
}


// ============================================================
// PROTECTION DES PAGES ADMIN
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
// AFFICHAGE DES MESSAGES
// ============================================================

function showAdminMessage(
    elementOrId,
    messageText,
    color = "#ff5b5b"
) {

    let element;


    if (
        typeof elementOrId ===
        "string"
    ) {

        element =
            document.getElementById(
                elementOrId
            );

    } else {

        element =
            elementOrId;
    }


    if (!element) {

        console.error(
            "Zone de message introuvable."
        );

        return;
    }


    element.textContent =
        messageText;

    element.style.color =
        color;
}
