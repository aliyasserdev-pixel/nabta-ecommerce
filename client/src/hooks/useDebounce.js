import { useState, useEffect } from "react";

// تأجيل تنفيذ قيمة — يُستخدم في البحث لتقليل عدد الطلبات
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
