import { products } from "../data/products";
import { categories } from "../data/categories";

// خدمة المنتجات — وهمية الآن، ستتصل بـ API حقيقي في المرحلة السادسة
// الميزة: كل المكونات تستدعي هذه الدوال فقط، فتغيير المصدر لا يؤثر عليها

// محاكاة تأخير الشبكة
function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const productService = {
  // جلب كل المنتجات مع فلاتر
  async getAll({ categorySlug, search, sort, page = 1, limit = 12 } = {}) {
    await delay();

    let result = [...products];

    // فلترة حسب التصنيف
    if (categorySlug) {
      result = result.filter((p) => p.categorySlug === categorySlug);
    }

    // بحث في الاسم
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // ترتيب
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const items = result.slice(start, start + limit);

    return { items, total, totalPages, page };
  },

  // جلب منتج واحد بالـ slug
  async getBySlug(slug) {
    await delay(200);
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      const error = new Error("المنتج غير موجود");
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  // جلب المنتجات المميزة
  async getFeatured(limit = 4) {
    await delay(150);
    return products.filter((p) => p.isFeatured).slice(0, limit);
  },

  // جلب منتجات ذات صلة (نفس التصنيف)
  async getRelated(productId, limit = 4) {
    await delay(150);
    const current = products.find((p) => p.id === productId);
    if (!current) return [];
    return products
      .filter(
        (p) => p.categorySlug === current.categorySlug && p.id !== productId,
      )
      .slice(0, limit);
  },
};

export const categoryService = {
  async getAll() {
    await delay(150);
    return categories;
  },

  async getBySlug(slug) {
    await delay(150);
    const category = categories.find((c) => c.slug === slug);
    if (!category) {
      const error = new Error("التصنيف غير موجود");
      error.statusCode = 404;
      throw error;
    }
    return category;
  },
};
