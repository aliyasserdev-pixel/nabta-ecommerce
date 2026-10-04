import { Router } from "express";
import { adminController } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator.js";
import {
  createUserSchema,
  updateUserRoleSchema,
  updateOrderStatusSchema,
} from "../validators/userValidator.js";

const router = Router();

// كل مسارات الإدارة تتطلب تسجيل دخول
router.use(authenticate);

// ============ متاح للـ Admin + Assistant ============

// الإحصائيات
router.get("/stats", authorize("ADMIN", "ASSISTANT"), adminController.getStats);

// الطلبات
router.get(
  "/orders",
  authorize("ADMIN", "ASSISTANT"),
  adminController.getOrders,
);
router.get(
  "/orders/:id",
  authorize("ADMIN", "ASSISTANT"),
  adminController.getOrderById,
);
router.patch(
  "/orders/:id/status",
  authorize("ADMIN", "ASSISTANT"),
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus,
);

// المنتجات — عرض وتعديل
router.get(
  "/products",
  authorize("ADMIN", "ASSISTANT"),
  adminController.getProducts,
);
router.put(
  "/products/:id",
  authorize("ADMIN", "ASSISTANT"),
  validate(updateProductSchema),
  adminController.updateProduct,
);

// ============ متاح للـ Admin فقط ============

// المنتجات — إنشاء وحذف
router.post(
  "/products",
  authorize("ADMIN"),
  validate(createProductSchema),
  adminController.createProduct,
);
router.delete(
  "/products/:id",
  authorize("ADMIN"),
  adminController.deleteProduct,
);

// المستخدمين
router.get("/users", authorize("ADMIN"), adminController.getUsers);
router.post(
  "/users",
  authorize("ADMIN"),
  validate(createUserSchema),
  adminController.createUser,
);
router.patch(
  "/users/:id/role",
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  adminController.updateUserRole,
);
router.patch(
  "/users/:id/toggle-active",
  authorize("ADMIN"),
  adminController.toggleUserActive,
);

export default router;
