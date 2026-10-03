import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

// منطق التصنيفات
export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  },

  async getBySlug(slug) {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category || !category.isActive) {
      throw ApiError.notFound("التصنيف غير موجود");
    }

    return category;
  },
};
