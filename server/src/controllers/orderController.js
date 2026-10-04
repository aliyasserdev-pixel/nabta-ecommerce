import { orderService } from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const orderController = {
  // POST /api/orders
  create: asyncHandler(async (req, res) => {
    const order = await orderService.create(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      data: order,
    });
  }),

  // GET /api/orders
  getMyOrders: asyncHandler(async (req, res) => {
    const orders = await orderService.getByUser(req.user.id);
    res.json({ success: true, data: orders });
  }),

  // GET /api/orders/:id
  getById: asyncHandler(async (req, res) => {
    const order = await orderService.getById(
      req.user.id,
      req.params.id,
      req.user.role,
    );
    res.json({ success: true, data: order });
  }),

  // POST /api/orders/:id/cancel
  cancel: asyncHandler(async (req, res) => {
    const order = await orderService.cancel(req.user.id, req.params.id);
    res.json({
      success: true,
      message: "تم إلغاء الطلب",
      data: order,
    });
  }),
};
