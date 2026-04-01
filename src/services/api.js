// Servicio API - Cliente HTTP para consumir microservicios
import axios from 'axios';
import { toast } from 'react-toastify';
import { MS_AUTH_URL, MS_USER_URL, MS_PRODUCT_URL } from '../config';

// Crear instancia de axios
const api = axios.create({
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// Interceptor para agregar token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 502 || error.response?.status === 504) {
      // Error de Gateway (Backend no disponible)
      console.error('❌ Gateway Error:', error.response.status);
      const errorMessage = '⚠️ The server is not responding. Please check your connection or try again later.';
      error.message = errorMessage;
      // Mostrar toast de error (evitar duplicados verificando si ya existe uno)
      if (!document.querySelector('.Toastify__toast--error')) {
        toast.error(errorMessage, {
          autoClose: 5000,
          position: 'top-right'
        });
      }
    } else if (!error.response) {
      // Error de red (sin respuesta del servidor)
      console.error('❌ Network error:', error.message);
      const errorMessage = '⚠️ Connection error. Please check your internet connection.';
      error.message = errorMessage;
      if (!document.querySelector('.Toastify__toast--error')) {
        toast.error(errorMessage, {
          autoClose: 5000,
          position: 'top-right'
        });
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH SERVICE
// ============================================================================
export const authService = {
  login: async (email, password) => {
    const response = await api.post(`${MS_AUTH_URL}/login`, {
      email,
      password
    });
    const data = response.data;

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("sede_id", data.sede_id ?? "null");

    return data;
  },

  me: async () => {
    const response = await api.get(`${MS_AUTH_URL}/me`);
    return response.data;
  },

};

// ============================================================================
// USER SERVICE
// ============================================================================
export const userService = {
  crearUsuario: async (data) => {
    const response = await api.post(`${MS_USER_URL}/`, data);
    return response.data;
  },

  listarUsuarios: async () => {
    const response = await api.get(`${MS_USER_URL}/`);
    return response.data;
  },

  cambiarPassword: async (nueva_password) => {
    const response = await api.patch(`${MS_USER_URL}/cambiar-password`, { nueva_password });
    return response.data;
  },

  actualizarUsuario: async (id, data) => {
    const response = await api.put(`${MS_USER_URL}/${id}`, data);
    return response.data;
  },

  toggleActivo: async (id) => {
    const response = await api.patch(`${MS_USER_URL}/${id}/toggle-activo`);
    return response.data;
  }
};

export default api;

// ============================================================================
// PRODUCT SERVICE
// ============================================================================

export const productService = {
  // Agregar parámetros opcionales name y category
  getProducts: (name = "", category = "") => {
    return api.get(`${MS_PRODUCT_URL}/product/`, {
      params: {
        name,      // se convierte en ?name=...
        category   // se convierte en &category=...
      }
    });
  },

  createProduct: (data) => api.post(`${MS_PRODUCT_URL}/product/`, data),

  updateProduct: (id, data) => api.put(`${MS_PRODUCT_URL}/product/${id}`, data),
};

