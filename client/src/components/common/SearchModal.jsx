import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productService } from "../../services/productService";
import { useDebounce } from "../../hooks/useDebounce";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./SearchModal.module.css";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  // إغلاق بزر Escape + تركيز تلقائي على الحقل
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // البحث عند تغير القيمة المؤجلة
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    productService
      .getAll({ search: debouncedQuery, limit: 6 })
      .then((res) => {
        if (!cancelled) setResults(res.items);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="ابحث عن منتج..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="حقل البحث"
          />
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="إغلاق البحث"
          >
            ✕
          </button>
        </form>

        <div className={styles.results}>
          {loading && <div className={styles.status}>جاري البحث...</div>}

          {!loading && query && results.length === 0 && (
            <div className={styles.status}>لا توجد نتائج مطابقة</div>
          )}

          {!loading && !query && (
            <div className={styles.status}>
              اكتب كلمة للبحث... (مثال: طماطم، بذور، تربة)
            </div>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              className={styles.resultItem}
              onClick={() => {
                navigate(`/products/${product.slug}`);
                onClose();
              }}
            >
              <span className={styles.resultName}>{product.name}</span>
              <span className={styles.resultPrice}>
                {formatPrice(product.price)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
