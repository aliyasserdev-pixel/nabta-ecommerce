// خدمة المصادقة — تستدعي API
// ملاحظة: نستخدم credentials: 'include' لإرسال الكوكيز مع الطلب

const API_BASE = "/api/auth";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // ⬅️ مهم: لإرسال HttpOnly cookies
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

export const authService = {
  // تسجيل حساب جديد
  async register({ name, email, phone, password, confirmPassword }) {
    const res = await request(`${API_BASE}/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password, confirmPassword }),
    });
    return res.data;
  },

  // تسجيل الدخول
  async login({ email, password }) {
    const res = await request(`${API_BASE}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },

  // تسجيل الخروج
  async logout() {
    return request(`${API_BASE}/logout`, { method: "POST" });
  },

  // جلب المستخدم الحالي
  async getCurrentUser() {
    try {
      const res = await request(`${API_BASE}/me`, { method: "GET" });
      return res.data;
    } catch (error) {
      // لو غير مسجل — نرجع null بدل خطأ
      if (error.statusCode === 401) return null;
      throw error;
    }
  },
};
