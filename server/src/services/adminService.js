import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const adminService = {
  // ============ الإحصائيات ============
  async getStats() {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      totalUsers,
      lowStockCount,
      salesAggregate,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lt: 5 }, isActive: true } }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      totalUsers,
      lowStockCount,
      totalSales: salesAggregate._sum.total || 0,
    };
  },

  // ============ الطلبات ============
  async getOrders({ status, search, page = 1, limit = 20 } = {}) {
    const where = {};

    if (status) where.status = status;

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search } },
      ];
    }

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { select: { id: true, productName: true, quantity: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  },

  async getOrderById(orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
      },
    });

    if (!order) throw ApiError.notFound("الطلب غير موجود");
    return order;
  },

  async updateOrderStatus(orderId, newStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw ApiError.notFound("الطلب غير موجود");

    // قواعد التحويل
    const ALLOWED_TRANSITIONS = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PROCESSING", "CANCELLED"],
      PROCESSING: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    const allowed = ALLOWED_TRANSITIONS[order.status] || [];
    if (!allowed.includes(newStatus)) {
      throw ApiError.badRequest(
        `لا يمكن تغيير الحالة من "${order.status}" إلى "${newStatus}"`,
      );
    }

    // لو أصبح ملغى: نُعيد المخزون
    if (newStatus === "CANCELLED") {
      return prisma.$transaction(async (tx) => {
        const orderItems = await tx.orderItem.findMany({ where: { orderId } });
        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        return tx.order.update({
          where: { id: orderId },
          data: { status: newStatus },
          include: { items: true },
        });
      });
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { items: true },
    });
  },

  // ============ المنتجات ============
  async getProducts({ search, categoryId, page = 1, limit = 20 } = {}) {
    const where = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
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

  async createProduct(data) {
    // التحقق من عدم تكرار slug
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw ApiError.conflict("الـ slug مستخدم مسبقًا");

    // التحقق من وجود التصنيف
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw ApiError.badRequest("التصنيف غير موجود");

    return prisma.product.create({
      data: {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() || null,
        shortDesc: data.shortDesc?.trim() || null,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        stock: data.stock,
        categoryId: data.categoryId,
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  async updateProduct(productId, data) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw ApiError.notFound("المنتج غير موجود");

    // لو تغيّر slug، تحقق أنه غير مستخدم
    if (data.slug && data.slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: { slug: data.slug },
      });
      if (existing) throw ApiError.conflict("الـ slug مستخدم مسبقًا");
    }

    // لو تغيّر التصنيف، تحقق
    if (data.categoryId && data.categoryId !== product.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) throw ApiError.badRequest("التصنيف غير موجود");
    }

    return prisma.product.update({
      where: { id: productId },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  },

  async deleteProduct(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw ApiError.notFound("المنتج غير موجود");

    // تحقق: هل المنتج في طلبات؟
    const inOrders = await prisma.orderItem.count({ where: { productId } });
    if (inOrders > 0) {
      // بدلًا من الحذف: نُلغيه
      return prisma.product.update({
        where: { id: productId },
        data: { isActive: false },
      });
    }

    // لا يوجد في طلبات — نحذف نهائيًا
    await prisma.product.delete({ where: { id: productId } });
    return { deleted: true };
  },

  // ============ المستخدمين (Admin فقط) ============
  async getUsers({ role, search, page = 1, limit = 20 } = {}) {
    const where = {};

    if (role) where.role = role;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: safeLimit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  },

  async createStaffUser(data, currentAdminId) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) throw ApiError.conflict("البريد مستخدم مسبقًا");

    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || null,
        passwordHash,
        role: data.role || "ASSISTANT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  async updateUserRole(userId, newRole, currentAdminId) {
    if (userId === currentAdminId) {
      throw ApiError.badRequest("لا يمكنك تغيير دورك بنفسك");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("المستخدم غير موجود");

    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  },

  async toggleUserActive(userId, currentAdminId) {
    if (userId === currentAdminId) {
      throw ApiError.badRequest("لا يمكنك تعطيل حسابك بنفسك");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.notFound("المستخدم غير موجود");

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  },
};
