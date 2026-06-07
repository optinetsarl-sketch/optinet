import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour gérer les réponses 401 (token expiré)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si erreur 401 et pas déjà une tentative de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem("refresh");
                
                if (refreshToken) {
                    // Essayer de rafraîchir le token
                    const response = await axios.post(
                        "http://127.0.0.1:8000/api/refresh/",
                        { refresh: refreshToken },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    if (response.data.access) {
                        // Stocker le nouveau token
                        localStorage.setItem("access", response.data.access);
                        
                        // Mettre à jour le header de la requête originale
                        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                        
                        // Renvoyer la requête originale
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Si refresh échoue, nettoyer et rediriger vers login
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;