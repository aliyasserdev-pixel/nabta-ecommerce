// أداة حفظ وقراءة السلة من localStorage
// نستخدمها لتبقى السلة موجودة حتى بعد إغلاق المتصفح

const STORAGE_KEY = "nabta_cart_v1";

export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // تحقق من أن البيانات مصفوفة صحيحة
    if (!Array.isArray(parsed)) return [];

    // فلترة أي عنصر غير صالح
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch (error) {
    console.warn("تعذّر قراءة السلة من التخزين:", error);
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("تعذّر حفظ السلة في التخزين:", error);
  }
}

export function clearCart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("تعذّر حذف السلة من التخزين:", error);
  }
}
