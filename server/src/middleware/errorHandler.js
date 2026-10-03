import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// معالج الأخطاء المركزي — يُستخدم في آخر سلسلة الـ middleware
export function errorHandler(err, req, res, next) {
  // إذا كانت الاستجابة قد بدأت، لا نفعل شيئًا
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "حدث خطأ غير متوقع";
  let details = err.details || null;

  // معالجة أخطاء Prisma الخاصة
  if (err.code === "P2002") {
    statusCode = 409;
    message = "القيمة موجودة مسبقًا";
    details = err.meta?.target ? [`الحقل: ${err.meta.target}`] : null;
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "العنصر غير موجود";
  }

  // تسجيل الخطأ
  if (statusCode >= 500) {
    console.error("❌ خطأ في الخادم:", err);
  } else {
    console.warn(`⚠️ ${statusCode}: ${message}`);
  }

  // في الإنتاج: لا نكشف تفاصيل حساسة
  const response = {
    success: false,
    message:
      env.isProduction && statusCode >= 500 ? "حدث خطأ في الخادم" : message,
  };

  if (details) response.details = details;

  // Stack Trace في التطوير فقط
  if (!env.isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

// معالج المسارات غير الموجودة (404)
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `المسار ${req.originalUrl} غير موجود`,
  });
}
