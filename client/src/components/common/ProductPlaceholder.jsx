import styles from "./ProductPlaceholder.module.css";

// صورة منتج مؤقتة — تُستبدل لاحقًا بصورة حقيقية من الـ API
export default function ProductPlaceholder({ icon = "🌱", label = "" }) {
  return (
    <div
      className={styles.placeholder}
      role="img"
      aria-label={label || "صورة منتج"}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </div>
  );
}
