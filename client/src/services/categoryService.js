import { apiFetch } from "./api";

export const categoryService = {
  async getAll() {
    const res = await apiFetch("/api/categories");
    return res.data;
  },

  async getBySlug(slug) {
    const res = await apiFetch(`/api/categories/${slug}`);
    return res.data;
  },
};
