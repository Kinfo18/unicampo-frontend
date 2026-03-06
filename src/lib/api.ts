import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token JWT automáticamente
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('unicampo_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor: rechaza el error para que cada componente lo maneje
// No redirigimos automáticamente para evitar recargas que borran el store
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);

export default api;
