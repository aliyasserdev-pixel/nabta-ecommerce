import { Router } from "express";
import { productController } from "../controllers/productController.js";

const router = Router();

// قائمة المنتجات
router.get("/", productController.getAll);

// المنتجات المميزة
router.get("/featured", productController.getFeatured);

// منتج واحد بالـ slug
router.get("/:slug", productController.getBySlug);

// منتجات ذات صلة
router.get("/:id/related", productController.getRelated);

export default router;
