import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para peticiones (ej. adjuntar tokens si se requiere más adelante)
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo global de errores (ej. 401, 500)
    return Promise.reject(error);
  }
);

export default axiosClient;
