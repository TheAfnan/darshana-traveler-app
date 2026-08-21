/**
 * API Configuration
 * Automatically detects dev vs production environment
 */

export const getBackendUrl = (): string => {
  // Check if we're in production
  const isProduction = typeof window !== 'undefined' && 
    (window.location.hostname.includes('vercel.app') || 
     window.location.hostname.includes('herokuapp.com') ||
     window.location.hostname.includes('railway.app') ||
     window.location.hostname.includes('onrender.com'));

  // Try to get backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (isProduction) {
    if (backendUrl && backendUrl.trim()) {
      return backendUrl;
    }
    console.error('❌ VITE_BACKEND_URL not configured for production!');
    console.error('Please set VITE_BACKEND_URL in Vercel environment variables');
    console.error('Example value: https://darshana-backend.onrender.com');
    return '';
  }

  // Development: Use localhost or env variable
  return backendUrl || 'http://localhost:3001';
};

export const API_BASE_URL = getBackendUrl();

// Dev helpers: try both 3001 (default) and 3000 (used in some scripts)
const devBackends = Array.from(new Set([
  API_BASE_URL,
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean)));

export const API_ENDPOINTS = {
  ROUTES: `${API_BASE_URL}/api/routes`,
  ROUTE_HISTORY: `${API_BASE_URL}/api/routes`,
  HEALTH: `${API_BASE_URL}/health`,
};

export const ROUTE_ENDPOINTS = devBackends.map((base) => `${base}/api/routes`);
