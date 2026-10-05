// خدمة الإدارة — تستدعي /api/admin/*

const API_BASE = "/api/admin";

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("فشل في قراءة استجابة الخادم");
  }

  if (!res.ok) {
    const error = new Error(data?.message || "حدث خطأ");
    error.statusCode = res.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const adminService = {
  // ===== الإحصائيات =====
  async getStats() {
    const res = await fetchJson(`${API_BASE}/stats`);
    return res.data;
  },

  // ===== الطلبات =====
  async getOrders(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", params.page);
    if (params.limit) q.set("limit", params.limit);
    const res = await fetchJson(`${API_BASE}/orders?${q}`);
    return res.data;
  },

  async getOrderById(id) {
    const res = await fetchJson(`${API_BASE}/orders/${id}`);
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const res = await fetchJson(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return res.data;
  },

  // ===== المنتجات =====
  async getProducts(params = {}) {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.categoryId) q.set("categoryId", params.categoryId);
    if (params.page) q.set("page", params.page);
    if (params.limit) q.set("limit", params.limit);
    const res = await fetchJson(`${API_BASE}/products?${q}`);
    return res.data;
  },

  async createProduct(data) {
    const res = await fetchJson(`${API_BASE}/products`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await fetchJson(`${API_BASE}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteProduct(id) {
    const res = await fetchJson(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },

  // ===== المستخدمين =====
  async getUsers(params = {}) {
    const q = new URLSearchParams();
    if (params.role) q.set("role", params.role);
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", params.page);
    if (params.limit) q.set("limit", params.limit);
    const res = await fetchJson(`${API_BASE}/users?${q}`);
    return res.data;
  },

  async createUser(data) {
    const res = await fetchJson(`${API_BASE}/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await fetchJson(`${API_BASE}/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    return res.data;
  },

  async toggleUserActive(id) {
    const res = await fetchJson(`${API_BASE}/users/${id}/toggle-active`, {
      method: "PATCH",
    });
    return res.data;
  },
};
