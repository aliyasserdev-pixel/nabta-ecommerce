import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

// منطق المنتجات — التعامل مباشرة مع قاعدة البيانات
export const productService = {
  // جلب قائمة المنتجات مع فلترة وترتيب وتقسيم صفحات
  async getAll({ categorySlug, search, sort, page = 1, limit = 12 } = {}) {
    // بناء شرط WHERE
    const where = { isActive: true };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    // بناء ORDER BY
    let orderBy = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { rating: "desc" };

    // تحقق من الصفحة
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const skip = (safePage - 1) * safeLimit;

    // تنفيذ الاستعلامين بالتوازي (أسرع)
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: safeLimit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, icon: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  },

  // جلب منتج واحد بالـ slug
  async getBySlug(slug) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product || !product.isActive) {
      throw ApiError.notFound("المنتج غير موجود");
    }

    return product;
  },

  // المنتجات المميزة
  async getFeatured(limit = 4) {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  // منتجات ذات صلة
  async getRelated(productId, limit = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) return [];

    return prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },
};
