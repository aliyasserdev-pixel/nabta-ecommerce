import { ApiError } from "../utils/ApiError.js";

// Factory للتحقق من المدخلات — يستقبل دالة تحقق ويرجع middleware
export function validate(schemaFn) {
  return (req, res, next) => {
    try {
      schemaFn(req.body);
      next();
    } catch (error) {
      next(ApiError.badRequest(error.message, error.details));
    }
  };
}
