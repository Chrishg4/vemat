// src/api/axios.js
import axios from 'axios';
// Importación directa de la URL base para evitar problemas de importación
const API_BASE_URL = 'https://vemat.onrender.com';

// Crear una instancia de axios con la configuración base
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición API:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;