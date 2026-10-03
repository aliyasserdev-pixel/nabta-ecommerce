import { ApiError } from "../utils/ApiError.js";

// التحقق من الصلاحيات — يستقبل قائمة أدوار مسموحة
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("يجب تسجيل الدخول"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("ليست لديك الصلاحية"));
    }

    next();
  };
}
