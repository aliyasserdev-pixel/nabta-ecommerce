// خدمة المنتجات — تستدعي API الحقيقي على /api/products

// دالة مساعدة لتنفيذ طلبات fetch
async function fetchJson(url) {
  const res = await fetch(url);

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("فشل في قراءة استجابة الخادم");
  }

  if (!res.ok) {
    const error = new Error(data?.message || "حدث خطأ في الطلب");
    error.statusCode = res.status;
    throw error;
  }

  return data;
}

export const productService = {
  // جلب كل المنتجات مع فلاتر
  async getAll({ categorySlug, search, sort, page = 1, limit = 12 } = {}) {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (search) params.set("q", search);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetchJson(`/api/products?${params.toString()}`);
    return res.data; // { items, total, totalPages, page, limit }
  },

  // جلب منتج واحد بالـ slug
  async getBySlug(slug) {
    const res = await fetchJson(`/api/products/${slug}`);
    return res.data;
  },

  // جلب المنتجات المميزة
  async getFeatured(limit = 4) {
    const res = await fetchJson(`/api/products/featured?limit=${limit}`);
    return res.data;
  },

  // جلب منتجات ذات صلة — نحتاج ID
  async getRelated(productId, limit = 4) {
    const res = await fetchJson(
      `/api/products/${productId}/related?limit=${limit}`,
    );
    return res.data;
  },
};
