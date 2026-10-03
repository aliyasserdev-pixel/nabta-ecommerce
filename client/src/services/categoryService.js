// خدمة التصنيفات — تستدعي API الحقيقي على /api/categories

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

export const categoryService = {
  async getAll() {
    const res = await fetchJson("/api/categories");
    return res.data;
  },

  async getBySlug(slug) {
    const res = await fetchJson(`/api/categories/${slug}`);
    return res.data;
  },
};
