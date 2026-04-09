// Configuración de EclipseBar

// API Gateway
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Microservicios
export const MS_AUTH_URL = import.meta.env.VITE_MS_AUTH_URL || 'http://localhost:8001/auth';
export const MS_USER_URL = import.meta.env.VITE_MS_USER_URL || 'http://localhost:8002/usuarios';
export const MS_PRODUCT_URL = import.meta.env.VITE_MS_PRODUCT_URL || 'http://localhost:8003/productos';
export const MS_INVENTORY_URL = import.meta.env.VITE_MS_INVENTORY_URL || 'http://localhost:8004';

// Configuracion de la aplicación
export const APP_CONFIG = {
  name: 'EclipseBar',
  version: '1.0.0',
};

// Exportar la configuración
const config = {
  API_BASE_URL,
  MS_AUTH_URL,
  MS_USER_URL,
  MS_PRODUCT_URL,
  MS_INVENTORY_URL
};

export default config;