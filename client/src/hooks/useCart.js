import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// Hook مختصر للوصول للسلة من أي مكون
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  }
  return context;
}
