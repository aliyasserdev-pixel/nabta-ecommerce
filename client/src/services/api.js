// عنوان الـ API الأساسي
// في التطوير: فارغ (نستخدم Vite proxy)
// في الإنتاج: عنوان Render
const API_URL = import.meta.env.VITE_API_URL || "";

// دالة fetch موحّدة
export async function apiFetch(path, options = {}) {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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
