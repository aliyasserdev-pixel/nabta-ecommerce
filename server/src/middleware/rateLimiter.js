import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

// ⚠️ للتطوير فقط: تعطيل كامل
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 100 : 100000, // ⬅️ رقم ضخم للتطوير
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "طلبات كثيرة جدًا. حاول لاحقًا.",
  },
  skip: () => !env.isProduction, // ⬅️ يُعطَّل تمامًا في التطوير
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProduction ? 5 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "محاولات كثيرة. حاول بعد 15 دقيقة.",
  },
  skipSuccessfulRequests: true,
});
