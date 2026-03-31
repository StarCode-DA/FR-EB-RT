/**
 * Configuración de EclipseBar
 */

// API Gateway
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Microservicios
export const MS_AUTH_URL = import.meta.env.VITE_MS_AUTH_URL || 'http://localhost:8001/auth';
export const MS_PRODUCT_URL = import.meta.env.VITE_MS_PRODUCT_URL || 'http://localhost:8002/products';

// Configuracion de la aplicación
export const APP_CONFIG = {
  name: 'EclipseBar',
  version: '1.0.0',
};

const config = {
  API_BASE_URL,
  MS_AUTH_URL,
  MS_PRODUCT_URL
};

export default config;