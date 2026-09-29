import { env } from "../config/env.js";

// معالج الأخطاء العام — يُستخدم في آخر سلسلة الـ Middleware
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "حدث خطأ غير متوقع";

  // تسجيل الخطأ في الـ Console دائمًا
  console.error("❌ خطأ:", err);

  // في الإنتاج: لا نكشف تفاصيل حساسة
  const response = {
    success: false,
    message:
      env.isProduction && statusCode === 500 ? "حدث خطأ في الخادم" : message,
  };

  // في التطوير فقط: نرفق Stack Trace لتسهيل التصحيح
  if (!env.isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

// معالج المسارات غير الموجودة (404)
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "المسار المطلوب غير موجود",
  });
}
