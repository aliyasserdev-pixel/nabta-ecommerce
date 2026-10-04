// دوال التحقق من بيانات المستخدم (للـ Admin)

const VALID_ROLES = ["ADMIN", "ASSISTANT", "CUSTOMER"];

export function createUserSchema(body) {
  const { name, email, phone, password, role } = body;

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

  if (password.length > 72) {
    throw new Error("كلمة المرور طويلة جدًا");
  }

  if (role && !VALID_ROLES.includes(role)) {
    throw new Error("الدور غير صحيح");
  }
}

export function updateUserRoleSchema(body) {
  const { role } = body;

  if (!role || !VALID_ROLES.includes(role)) {
    throw new Error("الدور غير صحيح (ADMIN, ASSISTANT, CUSTOMER)");
  }
}

export function updateOrderStatusSchema(body) {
  const { status } = body;
  const VALID_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new Error("حالة الطلب غير صحيحة");
  }
}
