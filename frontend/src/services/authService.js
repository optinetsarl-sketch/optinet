import axios from "axios";
import api from "./api";

// Plain axios instance (no auth interceptor) — used for the login call
// so an expired token in localStorage doesn't block authentication.
const API_URL = import.meta.env.VITE_API_URL;

const publicApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const loginUser = async (data) => {
    return await publicApi.post("/api/login/", data);
};

export const sendMessage = async (data) => {
    return await publicApi.post("/api/messages/create/", data);
};
export const getUsers = async () => {
    return await api.get("/api/users/");
};
export const getMessages = async () => {
    return await api.get("/api/messages/");
};
export const getMessageDetail = async (id) => {
    return await api.get(`/api/messages/${id}/`);
};
export const deleteMessage = async (id) => {
    return await api.delete(`/api/messages/delete/${id}/`);
};
export const updateMessageStatus = async (id, status) => {
    return await api.patch(`/api/messages/update/${id}/`, { statut: status });
};

// --- Portfolio & Categories ---

export const getCategories = async () => {
    // Both public and admin can read categories
    return await publicApi.get("/api/categories/");
};

export const getPortfolios = async () => {
    // Both public and admin can read portfolios
    return await publicApi.get("/api/portfolio/");
};

export const createPortfolio = async (data) => {
    return await api.post("/api/portfolio/", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updatePortfolio = async (id, data) => {
    return await api.patch(`/api/portfolio/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deletePortfolio = async (id) => {
    return await api.delete(`/api/portfolio/${id}/`);
};

// --- Photos ---

export const getPhotos = async () => {
    // Both public and admin can read photos
    return await publicApi.get("/api/photos/");
};

export const getPhotoDetail = async (id) => {
    return await publicApi.get(`/api/photos/${id}/`);
};

export const createPhoto = async (data) => {
    return await api.post("/api/photos/create/", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updatePhoto = async (id, data) => {
    return await api.patch(`/api/photos/update/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deletePhoto = async (id) => {
    return await api.delete(`/api/photos/delete/${id}/`);
};

export const toggleUserStatus = async (userId) => {
    return await api.post(`/api/users/${userId}/toggle-status/`);
};

export const createUser = async (data) => {
    return await api.post(`/api/users/create/`, data);
};

export const updateUser = async (userId, data) => {
    return await api.put(`/api/users/${userId}/`, data);
};

export const deleteUser = async (userId) => {
    return await api.delete(`/api/users/${userId}/`);
};

// --- Produits (boutique e-commerce) ---

export const getProduits = async () => {
    return await publicApi.get("/api/produits/");
};

export const getProduitDetail = async (id) => {
    return await publicApi.get(`/api/produits/${id}/`);
};

// data = FormData (champs texte + fichiers multiples 'images')
export const createProduit = async (data) => {
    return await api.post("/api/produits/create/", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updateProduit = async (id, data) => {
    return await api.patch(`/api/produits/update/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deleteProduit = async (id) => {
    return await api.delete(`/api/produits/delete/${id}/`);
};

// ajoute UNE photo (FormData: image, est_principale)
export const addProduitPhoto = async (id, data) => {
    return await api.post(`/api/produits/${id}/photos/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deleteProduitPhoto = async (photoId) => {
    return await api.delete(`/api/produit-photos/delete/${photoId}/`);
};

// --- Actualités (Le Journal) ---

export const getActualites = async (categorie) => {
    const q = categorie ? `?categorie=${encodeURIComponent(categorie)}` : "";
    return await publicApi.get(`/api/actualites/${q}`);
};

export const getActualiteDetail = async (id) => {
    return await publicApi.get(`/api/actualites/${id}/`);
};

export const getActualitesByService = async (service) => {
    return await publicApi.get(`/api/actualites/?service=${encodeURIComponent(service)}`);
};

// --- Boutique : catégories & commandes ---

export const getCategoriesProduits = async () => {
    return await publicApi.get("/api/categories-produits/");
};

// data = { client_nom, client_telephone, client_adresse, client_ville, note, mode_paiement, total, items:[...] }
export const createCommande = async (data) => {
    return await publicApi.post("/api/commandes/create/", data);
};

export const getCommandes = async () => {
    return await api.get("/api/commandes/");
};

export const updateCommande = async (id, data) => {
    return await api.patch(`/api/commandes/update/${id}/`, data);
};

export const createActualite = async (data) => {
    return await api.post("/api/actualites/create/", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const updateActualite = async (id, data) => {
    return await api.patch(`/api/actualites/update/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deleteActualite = async (id) => {
    return await api.delete(`/api/actualites/delete/${id}/`);
};

// ajoute UNE photo à une actualité existante (FormData: image)
export const addActualitePhoto = async (id, data) => {
    return await api.post(`/api/actualites/${id}/photos/`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const deleteActualitePhoto = async (photoId) => {
    return await api.delete(`/api/actualite-photos/delete/${photoId}/`);
};

// // récupérer ses infos (profil)
// export const getMe = async () => {
//     return await api.get("api/users/me/");
// };

// // changer de mot de passe directement
// export const changePassword = async (data) => {
//     return await api.post("api/users/change-password/", data);
// };

// // demander un lien de réinitialisation par mail
// export const requestPasswordReset = async (email) => {
//     return await api.post("api/users/reset-password-request/", { email });
// };

// // superadmin : réinitialiser le mot de passe d'un utilisateur
// export const adminResetPassword = async (userId, newPassword) => {
//     return await api.post(`api/users/${userId}/admin-reset-password/`, { new_password: newPassword });
// };

// --- Statistiques de visite ---

// signal anonyme envoyé par les pages publiques (jamais bloquant)
export const trackVisite = async (path) => {
    try { await publicApi.post("/api/track/", { path }); } catch { /* silencieux */ }
};

export const getStatsVisites = async () => {
    return await api.get("/api/stats-visites/");
};

// --- Contacts (Carnet) ---
export const getContacts = async () => {
    return await api.get(`/api/contacts/`);
};

export const getContact = async (id) => {
    return await api.get(`/api/contacts/${id}/`);
};

export const createContact = async (data) => {
    return await api.post(`/api/contacts/create/`, data);
};

export const updateContact = async (id, data) => {
    return await api.put(`/api/contacts/update/${id}/`, data);
};

export const deleteContact = async (id) => {
    return await api.delete(`/api/contacts/delete/${id}/`);
};