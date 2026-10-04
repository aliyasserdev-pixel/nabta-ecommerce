// خدمة الطلبات — تستدعي API الحقيقي على /api/orders

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include", // مهم لإرسال cookies
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("فشل في قراءة استجابة الخادم");
  }

  if (!res.ok) {
    const error = new Error(data?.message || "حدث خطأ في الطلب");
    error.statusCode = res.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const orderService = {
  // إنشاء طلب جديد
  async create(payload) {
    const res = await fetchJson("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // طلباتي
  async getAll() {
    const res = await fetchJson("/api/orders");
    return res.data;
  },

  // تفاصيل طلب
  async getById(id) {
    const res = await fetchJson(`/api/orders/${id}`);
    return res.data;
  },

  // إلغاء طلب
  async cancel(id) {
    const res = await fetchJson(`/api/orders/${id}/cancel`, {
      method: "POST",
    });
    return res.data;
  },
};
