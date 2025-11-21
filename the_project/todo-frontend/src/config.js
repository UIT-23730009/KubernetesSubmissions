const API_BASE = import.meta.env.VITE_API_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

export const CONFIG = {
  env: import.meta.env.VITE_ENV,
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,
  apiVersion: API_VERSION,
  apiBaseUrl: API_BASE,
  apiUrl: import.meta.env.MODE === "production"
  ? `${API_BASE}/api/${API_VERSION}`
  : "http://todo-app:3000/api/v1.4" // Production API
  
};
