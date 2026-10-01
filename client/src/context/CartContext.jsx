import { createContext, useReducer, useEffect, useMemo } from "react";
import { cartReducer, initialCartState } from "./cartReducer";
import { loadCart, saveCart } from "../utils/cartStorage";

// سياق السلة — يُوفّر الحالة والدوال لكل المكونات
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // عند أول تحميل: نقرأ السلة من localStorage
  useEffect(() => {
    const saved = loadCart();
    if (saved.length > 0) {
      dispatch({ type: "HYDRATE", payload: saved });
    }
  }, []);

  // كلما تغيرت السلة: نحفظها في localStorage
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  // الدوال المساعدة — محسّنة بـ useMemo لتقليل إعادة الإنشاء
  const value = useMemo(() => {
    const items = state.items;

    // حساب المجموع الفرعي
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // التوصيل — ثابت الآن، سيتغير لاحقًا حسب المنطقة
    const shipping = items.length === 0 ? 0 : 500;

    // الإجمالي النهائي — نحسبه مباشرة (بدون getter)
    const total = subtotal + shipping;

    return {
      items,

      // عدد المنتجات الكلي (مجموع الكميات)
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal,
      shipping,
      total,

      // عدد المنتجات الفريدة
      uniqueCount: items.length,

      // التحقق من وجود منتج
      hasItem: (id) => items.some((item) => item.id === id),

      // جلب كمية منتج
      getQuantity: (id) => items.find((item) => item.id === id)?.quantity ?? 0,

      // عمليات التعديل
      addItem: (product, quantity = 1) =>
        dispatch({ type: "ADD_ITEM", payload: { product, quantity } }),

      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),

      setQuantity: (id, quantity) =>
        dispatch({ type: "SET_QUANTITY", payload: { id, quantity } }),

      increase: (id) => dispatch({ type: "INCREASE", payload: { id } }),

      decrease: (id) => dispatch({ type: "DECREASE", payload: { id } }),

      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
