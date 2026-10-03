import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const authService = {
  // تسجيل حساب جديد
  async register({ name, email, phone, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    // هل البريد موجود؟
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      throw ApiError.conflict("البريد الإلكتروني مستخدم مسبقًا");
    }

    // تشفير كلمة المرور
    const passwordHash = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    return user;
  },

  // تسجيل الدخول
  async login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // رسالة عامة (لا نكشف إن كان البريد موجودًا)
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("البريد أو كلمة المرور غير صحيحة");
    }

    // التحقق من كلمة المرور
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw ApiError.unauthorized("البريد أو كلمة المرور غير صحيحة");
    }

    return user;
  },

  // جلب المستخدم بالـ id
  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      throw ApiError.notFound("المستخدم غير موجود");
    }

    return user;
  },
};
