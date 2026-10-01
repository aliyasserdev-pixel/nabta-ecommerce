import { useState, useEffect } from "react";
import { productService } from "../services/productService";

// Hook لجلب المنتجات مع إدارة حالات التحميل والأخطاء
export function useProducts(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // نحوّل params إلى نص لاستخدامه كمفتاح مقارنة في useEffect
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await productService.getAll(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [paramsKey]);

  return { data, loading, error };
}
