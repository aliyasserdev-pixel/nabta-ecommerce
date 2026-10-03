import { categoryService } from "../services/categoryService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const categoryController = {
  // GET /api/categories
  getAll: asyncHandler(async (req, res) => {
    const categories = await categoryService.getAll();
    res.json({ success: true, data: categories });
  }),

  // GET /api/categories/:slug
  getBySlug: asyncHandler(async (req, res) => {
    const category = await categoryService.getBySlug(req.params.slug);
    res.json({ success: true, data: category });
  }),
};
