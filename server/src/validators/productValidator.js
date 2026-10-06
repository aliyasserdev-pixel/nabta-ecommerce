// دوال التحقق من بيانات المنتج

export function createProductSchema(body) {
  const {
    name,
    slug,
    description,
    shortDesc,
    price,
    oldPrice,
    stock,
    categoryId,
    isFeatured,
    isActive,
  } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    throw new Error("اسم المنتج مطلوب (حرفان على الأقل)");
  }
  if (name.length > 200) {
    throw new Error("اسم المنتج طويل جدًا (200 حرف كحد أقصى)");
  }

  if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("الـ slug مطلوب (أحرف إنجليزية صغيرة، أرقام، شرطات فقط)");
  }

  if (!Number.isInteger(price) || price < 0) {
    throw new Error("السعر يجب أن يكون رقمًا صحيحًا موجبًا");
  }

  if (
    oldPrice !== undefined &&
    oldPrice !== null &&
    (!Number.isInteger(oldPrice) || oldPrice < 0)
  ) {
    throw new Error("السعر القديم يجب أن يكون رقمًا صحيحًا موجبًا");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("المخزون يجب أن يكون رقمًا صحيحًا موجبًا");
  }

  if (!categoryId || typeof categoryId !== "string") {
    throw new Error("التصنيف مطلوب");
  }

  if (description && description.length > 2000) {
    throw new Error("الوصف طويل جدًا (2000 حرف كحد أقصى)");
  }

  if (shortDesc && shortDesc.length > 200) {
    throw new Error("الوصف المختصر طويل جدًا (200 حرف كحد أقصى)");
  }

  if (isFeatured !== undefined && typeof isFeatured !== "boolean") {
    throw new Error("isFeatured يجب أن يكون boolean");
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    throw new Error("isActive يجب أن يكون boolean");
  }
}

export function updateProductSchema(body) {
  // نفس التحقق لكن كل الحقول اختيارية (partial update)
const allowedFields = [
  "name",
  "slug",
  "description",
  "shortDesc",
  "imageUrl",
  "price",
  "oldPrice",
  "stock",
  "categoryId",
  "isFeatured",
  "isActive",
];
  const providedFields = Object.keys(body);

  if (providedFields.length === 0) {
    throw new Error("يجب تقديم حقل واحد على الأقل للتعديل");
  }

  const invalid = providedFields.filter((f) => !allowedFields.includes(f));
  if (invalid.length > 0) {
    throw new Error(`حقول غير مسموح بها: ${invalid.join(", ")}`);
  }

  // استخدام نفس الشروط لكن مع السماح بالغياب
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      throw new Error("اسم المنتج غير صحيح");
    }
  }
  if (body.slug !== undefined) {
    if (typeof body.slug !== "string" || !/^[a-z0-9-]+$/.test(body.slug)) {
      throw new Error("الـ slug غير صحيح");
    }
  }
  if (body.price !== undefined) {
    if (!Number.isInteger(body.price) || body.price < 0) {
      throw new Error("السعر غير صحيح");
    }
  }
  if (body.stock !== undefined) {
    if (!Number.isInteger(body.stock) || body.stock < 0) {
      throw new Error("المخزون غير صحيح");
    }
  }
  if (body.categoryId !== undefined) {
    if (typeof body.categoryId !== "string" || body.categoryId.length < 1) {
      throw new Error("التصنيف غير صحيح");
    }
  }
}
