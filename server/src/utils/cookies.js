import { env } from "../config/env.js";

// اسم الكوكي
const COOKIE_NAME = "nabta_token";

// إعدادات الكوكي
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام بالميلي ثانية
  path: "/",
};

// تعيين التوكن في كوكي
export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
}

// حذف الكوكي (عند تسجيل الخروج)
export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    path: "/",
  });
}

// قراءة التوكن من الكوكي
export function getAuthCookie(req) {
  return req.cookies?.[COOKIE_NAME] || null;
}
