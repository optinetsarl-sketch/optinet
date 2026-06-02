// import axios from "axios";
// import api from "./api";

// // Plain axios instance (no auth interceptor) — used for the login call
// // so an expired token in localStorage doesn't block authentication.
// const publicApi = axios.create({
//     baseURL: "http://localhost:8000",
//     headers: { "Content-Type": "application/json" },
// });

// export const loginUser = async (data) => {
//     return await publicApi.post("/api/users/login/", data);
// };

// // liste des utilisateurs
// export const getUsers = async () => {
//     return await api.get("api/users/liste-users/");
// };

// // activer / désactiver un utilisateur
// export const toggleUserStatus = async (userId) => {
//     return await api.post(`api/users/${userId}/toggle-status/`);
// };

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