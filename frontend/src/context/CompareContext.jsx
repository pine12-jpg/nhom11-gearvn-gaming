import { createContext, useContext, useEffect, useState } from "react";

const CompareContext = createContext(null);
const STORAGE_KEY = "gvn_compare";
const MAX_COMPARE = 3;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** US11 — So sánh cấu hình 2-3 sản phẩm cùng lúc */
export function CompareProvider({ children }) {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  function toggle(productId) {
    setIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= MAX_COMPARE) return prev; // đã đủ 3 sản phẩm
      return [...prev, productId];
    });
  }

  function clear() {
    setIds([]);
  }

  const value = { ids, toggle, clear, isFull: ids.length >= MAX_COMPARE, canCompare: ids.length >= 2 };
  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare phải được dùng bên trong <CompareProvider>");
  return ctx;
}
