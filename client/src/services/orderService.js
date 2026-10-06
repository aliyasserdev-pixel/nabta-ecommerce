import { apiFetch } from "./api";

export const orderService = {
  async create(payload) {
    const res = await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async getAll() {
    const res = await apiFetch("/api/orders");
    return res.data;
  },

  async getById(id) {
    const res = await apiFetch(`/api/orders/${id}`);
    return res.data;
  },

  async cancel(id) {
    const res = await apiFetch(`/api/orders/${id}/cancel`, {
      method: "POST",
    });
    return res.data;
  },
};
