// API URL configuration
// Uses environment variable in production (set at build time via Docker)
// Falls back to localhost for development
// VITE_API_URL is the API origin (e.g. https://api.example.com); "/api" is appended here.
// A trailing "/" or "/api" in the variable is stripped so a misconfigured build-arg
// cannot produce ".../api/api" URLs.
const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "").replace(/\/api$/, "");

export const API_URL = API_ORIGIN + "/api";
