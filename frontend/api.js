// api.js

const API_BASE_URL = 'http://localhost:3000'; // Change l'URL si besoin

// Fonction pour s'inscrire
async function register(name, email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    return await response.json();
}

// Fonction pour se connecter
async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

// Fonction pour récupérer toutes les plateformes
async function getPlatforms(token) {
    const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await response.json();
}

// Fonction pour ajouter une plateforme
async function addPlatform(platformData, token) {
    const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(platformData)
    });
    return await response.json();
}

// Fonction pour modifier une plateforme
async function updatePlatform(id, platformData, token) {
    const response = await fetch(`${API_BASE_URL}/platforms/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(platformData)
    });
    return await response.json();
}

// Fonction pour supprimer une plateforme
async function deletePlatform(id, token) {
    const response = await fetch(`${API_BASE_URL}/platforms/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return await response.json();
}
