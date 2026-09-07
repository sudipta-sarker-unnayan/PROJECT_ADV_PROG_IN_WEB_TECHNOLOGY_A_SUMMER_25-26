import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the access token to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sbms_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-logout on an expired/invalid token; tag 403s so callers can
// distinguish "not logged in" from "logged in but not permitted"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("sbms_token");
        localStorage.removeItem("sbms_user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else if (error.response?.status === 403) {
        error.isForbidden = true;
      }
    }
    return Promise.reject(error);
  },
);
