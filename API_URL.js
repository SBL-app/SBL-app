// API URL configuration
// Uses environment variable in production (set at build time via Docker)
// Falls back to localhost for development
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api";
