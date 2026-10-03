// دوال التحقق — تُستخدم مع middleware validate
// كل دالة ترمي خطأ لو البيانات غير صحيحة

export function registerSchema(body) {
  const { name, email, phone, password, confirmPassword } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw new Error("الاسم مطلوب (حرفان على الأقل)");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    throw new Error("البريد الإلكتروني غير صحيح");
  }

  if (phone && !/^[+\d\s-]{7,20}$/.test(phone)) {
    throw new Error("رقم الهاتف غير صحيح");
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
  }

  if (!/\d/.test(password)) {
    throw new Error("كلمة المرور يجب أن تحتوي على رقم");
  }

  if (password !== confirmPassword) {
    throw new Error("كلمتا المرور غير متطابقتين");
  }
}

export function loginSchema(body) {
  const { email, password } = body;

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new Error("البريد الإلكتروني مطلوب");
  }

  if (!password || typeof password !== "string") {
    throw new Error("كلمة المرور مطلوبة");
  }
}
