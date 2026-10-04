// دوال التحقق من بيانات الطلب
// تُستخدم مع middleware validate

export function createOrderSchema(body) {
  const {
    customerName,
    customerPhone,
    customerEmail,
    state,
    city,
    street,
    notes,
    paymentMethod,
    items,
  } = body;

  // ===== التحقق من بيانات العميل =====

  if (
    !customerName ||
    typeof customerName !== "string" ||
    customerName.trim().length < 2
  ) {
    throw new Error("اسم العميل مطلوب (حرفان على الأقل)");
  }

  if (
    !customerPhone ||
    typeof customerPhone !== "string" ||
    !/^[+\d\s-]{7,20}$/.test(customerPhone)
  ) {
    throw new Error("رقم الهاتف غير صحيح");
  }

  if (customerEmail && typeof customerEmail === "string") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      throw new Error("البريد الإلكتروني غير صحيح");
    }
  }

  // ===== التحقق من العنوان =====

  if (!state || typeof state !== "string" || state.trim().length < 2) {
    throw new Error("الولاية مطلوبة");
  }

  if (!city || typeof city !== "string" || city.trim().length < 2) {
    throw new Error("المدينة مطلوبة");
  }

  if (!street || typeof street !== "string" || street.trim().length < 5) {
    throw new Error("العنوان التفصيلي مطلوب (5 أحرف على الأقل)");
  }

  if (notes && typeof notes === "string" && notes.length > 500) {
    throw new Error("الملاحظات طويلة جدًا (500 حرف كحد أقصى)");
  }

  // ===== التحقق من طريقة الدفع =====

  const validPaymentMethods = ["CASH_ON_DELIVERY", "BANK_TRANSFER", "ONLINE"];
  if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
    throw new Error("طريقة الدفع غير صحيحة");
  }

  // ===== التحقق من المنتجات =====

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("يجب إضافة منتج واحد على الأقل");
  }

  if (items.length > 50) {
    throw new Error("عدد المنتجات كبير جدًا (50 كحد أقصى)");
  }

  for (const item of items) {
    if (!item || typeof item !== "object") {
      throw new Error("بيانات المنتج غير صحيحة");
    }

    if (!item.productId || typeof item.productId !== "string") {
      throw new Error("معرّف المنتج مطلوب");
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("كمية المنتج يجب أن تكون رقمًا صحيحًا موجبًا");
    }

    if (item.quantity > 100) {
      throw new Error("الكمية كبيرة جدًا (100 كحد أقصى)");
    }
  }
}
