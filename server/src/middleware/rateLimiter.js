import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// حد عام لكل الطلبات (100 طلب في 15 دقيقة)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "طلبات كثيرة جدًا. حاول لاحقًا.",
  },
  skip: () => !env.isProduction, // تخطّى في التطوير
});

// حد صارم لمحاولات الدخول (5 محاولات في 15 دقيقة)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "محاولات كثيرة. حاول بعد 15 دقيقة.",
  },
  skipSuccessfulRequests: true, // لا تحسب الطلبات الناجحة
});
