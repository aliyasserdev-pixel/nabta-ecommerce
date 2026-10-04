import { adminService } from "../services/adminService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminController = {
  // ============ الإحصائيات ============
  getStats: asyncHandler(async (req, res) => {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  }),

  // ============ الطلبات ============
  getOrders: asyncHandler(async (req, res) => {
    const result = await adminService.getOrders(req.query);
    res.json({ success: true, data: result });
  }),

  getOrderById: asyncHandler(async (req, res) => {
    const order = await adminService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  }),

  updateOrderStatus: asyncHandler(async (req, res) => {
    const order = await adminService.updateOrderStatus(
      req.params.id,
      req.body.status,
    );
    res.json({
      success: true,
      message: "تم تحديث حالة الطلب",
      data: order,
    });
  }),

  // ============ المنتجات ============
  getProducts: asyncHandler(async (req, res) => {
    const result = await adminService.getProducts(req.query);
    res.json({ success: true, data: result });
  }),

  createProduct: asyncHandler(async (req, res) => {
    const product = await adminService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: "تم إنشاء المنتج",
      data: product,
    });
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const product = await adminService.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: "تم تحديث المنتج",
      data: product,
    });
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const result = await adminService.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: result.deleted
        ? "تم حذف المنتج"
        : "تم تعطيل المنتج (موجود في طلبات)",
      data: result,
    });
  }),

  // ============ المستخدمين ============
  getUsers: asyncHandler(async (req, res) => {
    const result = await adminService.getUsers(req.query);
    res.json({ success: true, data: result });
  }),

  createUser: asyncHandler(async (req, res) => {
    const user = await adminService.createStaffUser(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "تم إنشاء المستخدم",
      data: user,
    });
  }),

  updateUserRole: asyncHandler(async (req, res) => {
    const user = await adminService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id,
    );
    res.json({
      success: true,
      message: "تم تحديث الدور",
      data: user,
    });
  }),

  toggleUserActive: asyncHandler(async (req, res) => {
    const user = await adminService.toggleUserActive(
      req.params.id,
      req.user.id,
    );
    res.json({
      success: true,
      message: user.isActive ? "تم تفعيل الحساب" : "تم تعطيل الحساب",
      data: user,
    });
  }),
};
