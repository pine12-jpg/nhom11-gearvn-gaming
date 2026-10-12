import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "gvn_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Giỏ hàng được lưu tại trình duyệt (localStorage) — mỗi phần tử gồm
 * { productId, quantity, snapshot } trong đó snapshot là thông tin sản phẩm
 * tại thời điểm thêm vào giỏ, chỉ dùng để hiển thị ngay lập tức (US12: cập nhật
 * realtime) trong khi giá/tồn kho chính xác luôn được xác nhận lại qua API
 * /orders/preview trước khi thanh toán.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { productId: product.id, quantity, snapshot: product }];
    });
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.floor(quantity)) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotalLocal = useMemo(
    () => items.reduce((s, i) => s + (i.snapshot?.finalPrice || 0) * i.quantity, 0),
    [items]
  );

  const value = { items, addItem, updateQuantity, removeItem, clear, totalCount, subtotalLocal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng bên trong <CartProvider>");
  return ctx;
}
