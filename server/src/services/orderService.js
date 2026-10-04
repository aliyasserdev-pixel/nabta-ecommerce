import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

// تكلفة الشحن — ثابتة الآن، ستُطوَّر لاحقًا حسب الولاية
const SHIPPING_COST = 500;

// توليد رقم طلب فريد: NB-YYYYMMDD-XXXX
async function generateOrderNumber() {
  const today = new Date();
  const date = today.toISOString().slice(0, 10).replace(/-/g, "");

  const lastOrder = await prisma.order.findFirst({
    where: { orderNumber: { startsWith: `NB-${date}-` } },
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  let sequence = 1;
  if (lastOrder) {
    const lastSeq = parseInt(lastOrder.orderNumber.split("-")[2], 10);
    sequence = lastSeq + 1;
  }

  return `NB-${date}-${String(sequence).padStart(4, "0")}`;
}

export const orderService = {
  // ===== إنشاء طلب جديد =====
  async create(userId, data) {
    const {
      customerName,
      customerPhone,
      customerEmail,
      state,
      city,
      street,
      notes,
      paymentMethod = "CASH_ON_DELIVERY",
      items,
    } = data;

    // 1. جلب المنتجات من قاعدة البيانات (لا نثق بأسعار العميل)
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw ApiError.badRequest("بعض المنتجات غير موجودة أو غير متوفرة");
    }

    // 2. التحقق من المخزون + حساب المجموع
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (product.stock < item.quantity) {
        throw ApiError.badRequest(
          `الكمية المطلوبة من "${product.name}" غير متوفرة (المتاح: ${product.stock})`,
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: null,
        unitPrice: product.price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const shipping = SHIPPING_COST;
    const total = subtotal + shipping;

    // 3. توليد رقم الطلب
    const orderNumber = await generateOrderNumber();

    // 4. إنشاء الطلب + تحديث المخزون في transaction واحد
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim().toLowerCase() || null,
          state: state.trim(),
          city: city.trim(),
          street: street.trim(),
          notes: notes?.trim() || null,
          subtotal,
          shipping,
          total,
          status: "PENDING",
          paymentMethod,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // تقليل المخزون
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // حذف عناصر السلة (لو كانت محفوظة في DB)
      const cart = await tx.cart.findUnique({ where: { userId } });
      if (cart) {
        await tx.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId: { in: productIds },
          },
        });
      }

      return newOrder;
    });

    return order;
  },

  // ===== طلبات المستخدم =====
  async getByUser(userId) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPrice: true,
            total: true,
          },
        },
      },
    });
  },

  // ===== طلب واحد =====
  async getById(userId, orderId, role) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound("الطلب غير موجود");
    }

    const isOwner = order.userId === userId;
    const isAdmin = role === "ADMIN" || role === "ASSISTANT";

    if (!isOwner && !isAdmin) {
      throw ApiError.forbidden("ليس لديك صلاحية الوصول لهذا الطلب");
    }

    return order;
  },

  // ===== إلغاء طلب =====
  async cancel(userId, orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound("الطلب غير موجود");
    }

    if (order.userId !== userId) {
      throw ApiError.forbidden("ليس لديك صلاحية إلغاء هذا الطلب");
    }

    if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw ApiError.badRequest("لا يمكن إلغاء الطلب في حالته الحالية");
    }

    return prisma.$transaction(async (tx) => {
      // إرجاع المخزون
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // تحديث حالة الطلب
      return tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });
  },
};
