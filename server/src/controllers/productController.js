import { productService } from "../services/productService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const productController = {
  // GET /api/products
  getAll: asyncHandler(async (req, res) => {
    const { category, q, sort, page, limit } = req.query;

    const result = await productService.getAll({
      categorySlug: category,
      search: q,
      sort,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
    });

    res.json({
      success: true,
      data: result,
    });
  }),

  // GET /api/products/:slug
  getBySlug: asyncHandler(async (req, res) => {
    const product = await productService.getBySlug(req.params.slug);
    res.json({ success: true, data: product });
  }),

  // GET /api/products/featured
  getFeatured: asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;
    const products = await productService.getFeatured(limit);
    res.json({ success: true, data: products });
  }),

  // GET /api/products/:id/related
  getRelated: asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;
    const products = await productService.getRelated(req.params.id, limit);
    res.json({ success: true, data: products });
  }),
};
