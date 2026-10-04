import { Router } from "express";
import { orderController } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/orderValidator.js";

const router = Router();

// كل مسارات الطلبات تتطلب تسجيل دخول
router.use(authenticate);

router.post("/", validate(createOrderSchema), orderController.create);
router.get("/", orderController.getMyOrders);
router.get("/:id", orderController.getById);
router.post("/:id/cancel", orderController.cancel);

export default router;
