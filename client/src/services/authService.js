import { apiFetch } from "./api";

export const authService = {
  async register({ name, email, phone, password, confirmPassword }) {
    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password, confirmPassword }),
    });
    return res.data;
  },

  async login({ email, password }) {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  async logout() {
    return apiFetch("/api/auth/logout", { method: "POST" });
  },

  async getCurrentUser() {
    try {
      const res = await apiFetch("/api/auth/me");
      return res.data;
    } catch (error) {
      if (error.statusCode === 401) return null;
      throw error;
    }
  },
};
