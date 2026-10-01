import { useCart } from "../../hooks/useCart";
import styles from "./CartBadge.module.css";

// شارة صغيرة تُعرض فوق أيقونة السلة في الـ Header
export default function CartBadge() {
  const { totalItems } = useCart();

  if (totalItems === 0) return null;

  return (
    <span className={styles.badge} aria-label={`${totalItems} منتج في السلة`}>
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}
