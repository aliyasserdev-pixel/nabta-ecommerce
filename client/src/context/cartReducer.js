// Reducer لإدارة حالات السلة — يحدد كل عمليات التعديل الممكنة

export const initialCartState = {
  items: [], // [{ id, slug, name, price, oldPrice, image, stock, quantity }]
};

export function cartReducer(state, action) {
  switch (action.type) {
    // إضافة منتج أو زيادة كميته إن كان موجودًا
    case "ADD_ITEM": {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.id === product.id,
      );

      if (existingIndex !== -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingIndex];
        const newQuantity = Math.min(
          existing.quantity + quantity,
          product.stock || 99,
        );
        updatedItems[existingIndex] = { ...existing, quantity: newQuantity };
        return { ...state, items: updatedItems };
      }

      // منتج جديد
      const newItem = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        categorySlug: product.categorySlug,
        stock: product.stock ?? 99,
        quantity: Math.min(quantity, product.stock || 99),
      };
      return { ...state, items: [...state.items, newItem] };
    }

    // حذف منتج بالكامل
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    // تعيين كمية معينة
    case "SET_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item,
        ),
      };
    }

    // زيادة كمية
    case "INCREASE": {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id && item.quantity < item.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    }

    // تقليل كمية
    case "DECREASE": {
      const { id } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    }

    // تفريغ السلة بالكامل
    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    // استبدال السلة كاملة (عند التحميل من localStorage)
    case "HYDRATE": {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
}
