import styles from "./ProductFilters.module.css";

// خيارات الترتيب
const SORT_OPTIONS = [
  { value: "default", label: "الافتراضي" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييمًا" },
];

export default function ProductFilters({
  sort,
  onSortChange,
  resultCount,
  loading,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.count}>
        {loading ? "جاري التحميل..." : `${resultCount} منتج`}
      </div>

      <div className={styles.sortWrap}>
        <label htmlFor="sort" className={styles.label}>
          ترتيب حسب:
        </label>
        <select
          id="sort"
          className={styles.select}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
