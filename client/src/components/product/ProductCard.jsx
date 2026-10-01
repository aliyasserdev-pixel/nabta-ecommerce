import { Link } from "react-router-dom";
import ProductPlaceholder from "../common/ProductPlaceholder";
import { formatPrice, getDiscountPercent } from "../../utils/formatPrice";
import styles from "./ProductCard.module.css";

// أيقونة تُختار حسب التصنيف — تعطي شكلاً بصريًا مميزًا لكل منتج
const CATEGORY_ICONS = {
  seeds: "🌱",
  seedlings: "🌿",
  soil: "🪴",
  fertilizers: "💧",
  tools: "🛠️",
  pots: "🏺",
};

export default function ProductCard({ product }) {
  const discount = getDiscountPercent(product.price, product.oldPrice);
  const outOfStock = product.stock === 0;

  return (
    <article className={styles.card}>
      <Link
        to={`/products/${product.slug}`}
        className={styles.imageWrap}
        aria-label={product.name}
      >
        {discount && <span className={styles.badge}>خصم {discount}%</span>}
        {outOfStock && (
          <span className={`${styles.badge} ${styles.outOfStock}`}>
            نفد المخزون
          </span>
        )}
        <ProductPlaceholder
          icon={CATEGORY_ICONS[product.categorySlug] || "🌱"}
          label={product.name}
        />
      </Link>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <button
          type="button"
          className={styles.addBtn}
          disabled={outOfStock}
          aria-label={`إضافة ${product.name} إلى السلة`}
        >
          {outOfStock ? "غير متوفر" : "أضف للسلة"}
        </button>
      </div>
    </article>
  );
}
