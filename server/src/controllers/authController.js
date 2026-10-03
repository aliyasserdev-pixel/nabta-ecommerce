import { authService } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";

// تحويل بيانات المستخدم لصيغة آمنة (بدون passwordHash)
function sanitizeUser(user) {
  const { passwordHash, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
}

export const authController = {
  // POST /api/auth/register
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    // توليد توكن ودخول تلقائي
    const token = generateToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: "تم إنشاء الحساب بنجاح",
      data: sanitizeUser(user),
    });
  }),

  // POST /api/auth/login
  login: asyncHandler(async (req, res) => {
    const user = await authService.login(req.body);

    const token = generateToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      data: sanitizeUser(user),
    });
  }),

  // POST /api/auth/logout
  logout: asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    res.json({
      success: true,
      message: "تم تسجيل الخروج",
    });
  }),

  // GET /api/auth/me
  me: asyncHandler(async (req, res) => {
    const user = await authService.getById(req.user.id);
    res.json({ success: true, data: user });
  }),
};
