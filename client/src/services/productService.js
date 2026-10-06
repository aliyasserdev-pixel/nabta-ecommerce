import { apiFetch } from "./api";

export const productService = {
  async getAll({ categorySlug, search, sort, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (search) params.set("q", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await apiFetch(`/api/products?${params.toString()}`);
    return res.data;
  },

  async getBySlug(slug) {
    const res = await apiFetch(`/api/products/${slug}`);
    return res.data;
  },

  async getFeatured(limit = 4) {
    const res = await apiFetch(`/api/products/featured?limit=${limit}`);
    return res.data;
  },

  async getRelated(productId, limit = 4) {
    const res = await apiFetch(
      `/api/products/${productId}/related?limit=${limit}`,
    );
    return res.data;
  },
};
