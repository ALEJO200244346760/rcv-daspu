// URL del backend. Se define en build con REACT_APP_API_URL
// (en Cloudflare Pages: Settings → Environment variables).
export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8080').replace(/\/$/, '');
