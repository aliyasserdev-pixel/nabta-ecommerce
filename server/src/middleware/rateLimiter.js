import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// حد عام لكل الطلبات
// في الإنتاج: 100 / 15 دقيقة
// في التطوير: 1000 / 15 دقيقة (مرن للتطوير)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 100 : 10, // ⬅️ للتجربة فقط
  legacyHeaders: false,
  message: {
    success: false,
    message: "طلبات كثيرة جدًا. حاول لاحقًا.",
  },
  // في الإنتاج: نُفعّلها دائمًا
  // في التطوير: نُفعّلها بأريحية
  skip: () => false,
});

// حد صارم لمحاولات الدخول
// 5 محاولات / 15 دقيقة (حتى في التطوير)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 5 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "محاولات كثيرة. حاول بعد 15 دقيقة.",
  },
  skipSuccessfulRequests: true,
});
