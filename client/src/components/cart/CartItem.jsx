import { Link } from "react-router-dom";
import QuantitySelector from "../product/QuantitySelector";
import ProductPlaceholder from "../common/ProductPlaceholder";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../hooks/useCart";
import styles from "./CartItem.module.css";

const CATEGORY_ICONS = {
  seeds: "🌱",
  seedlings: "🌿",
  soil: "🪴",
  fertilizers: "💧",
  tools: "🛠️",
  pots: "🏺",
};

export default function CartItem({ item }) {
  const { increase, decrease, setQuantity, removeItem } = useCart();

  const itemTotal = item.price * item.quantity;
  const icon = CATEGORY_ICONS[item.categorySlug] || "🌱";

  return (
    <article className={styles.item}>
      <Link to={`/products/${item.slug}`} className={styles.imageWrap}>
        <ProductPlaceholder icon={icon} label={item.name} />
      </Link>

      <div className={styles.info}>
        <Link to={`/products/${item.slug}`} className={styles.name}>
          {item.name}
        </Link>

        <div className={styles.priceRow}>
          <span className={styles.unitPrice}>{formatPrice(item.price)}</span>
          {item.oldPrice && (
            <span className={styles.oldPrice}>
              {formatPrice(item.oldPrice)}
            </span>
          )}
        </div>

        <div className={styles.controls}>
          <QuantitySelector
            value={item.quantity}
            onChange={(q) => setQuantity(item.id, q)}
            max={item.stock}
          />

          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => {
              if (window.confirm(`إزالة "${item.name}" من السلة؟`)) {
                removeItem(item.id);
              }
            }}
            aria-label={`حذف ${item.name} من السلة`}
          >
            🗑️ حذف
          </button>
        </div>
      </div>

      <div className={styles.totalCol}>
        <span className={styles.totalLabel}>الإجمالي</span>
        <span className={styles.total}>{formatPrice(itemTotal)}</span>
      </div>
    </article>
  );
}
