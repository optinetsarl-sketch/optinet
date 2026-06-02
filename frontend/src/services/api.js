// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:8000",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Intercepteur pour ajouter le token JWT à chaque requête
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("access");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;