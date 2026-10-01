// تنسيق السعر بالعملة العربية
export function formatPrice(amount) {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("ar-SD", {
    style: "currency",
    currency: "SDG",
    maximumFractionDigits: 0,
  }).format(amount);
}

// حساب نسبة الخصم
export function getDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
