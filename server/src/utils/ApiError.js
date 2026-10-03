// كلاس مخصص للأخطاء — يحمل رمز الحالة HTTP + رسالة واضحة
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // خطأ متوقع، وليس خطأ برمجي
    Error.captureStackTrace(this, this.constructor);
  }

  // دوال مختصرة
  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "غير مصرح") {
    return new ApiError(401, message);
  }

  static forbidden(message = "ممنوع") {
    return new ApiError(403, message);
  }

  static notFound(message = "غير موجود") {
    return new ApiError(404, message);
  }

  static conflict(message, details) {
    return new ApiError(409, message, details);
  }

  static internal(message = "خطأ في الخادم") {
    return new ApiError(500, message);
  }
}
