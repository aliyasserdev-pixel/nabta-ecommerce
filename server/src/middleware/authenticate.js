import { getAuthCookie } from "../utils/cookies.js";
import { verifyToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";

// التحقق من المصادقة عبر JWT
export async function authenticate(req, res, next) {
  try {
    const token = getAuthCookie(req);

    if (!token) {
      return next(ApiError.unauthorized("يجب تسجيل الدخول"));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return next(ApiError.unauthorized("الجلسة منتهية، سجّل الدخول من جديد"));
    }

    // التحقق أن المستخدم لا يزال موجودًا ونشطًا
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return next(ApiError.unauthorized("الحساب غير مفعّل"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
