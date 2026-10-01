import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./CartSummary.module.css";

export default function CartSummary() {
  const { subtotal, shipping, total, totalItems } = useCart();

  return (
    <aside className={styles.summary} aria-label="ملخص الطلب">
      <h2 className={styles.title}>ملخص الطلب</h2>

      <dl className={styles.list}>
        <div className={styles.row}>
          <dt>عدد المنتجات</dt>
          <dd>{totalItems}</dd>
        </div>
        <div className={styles.row}>
          <dt>المجموع الفرعي</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className={styles.row}>
          <dt>التوصيل</dt>
          <dd>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</dd>
        </div>
      </dl>

      <div className={styles.totalRow}>
        <span>الإجمالي</span>
        <span className={styles.totalAmount}>{formatPrice(total)}</span>
      </div>

      <Link to="/checkout" className={styles.cta}>
        <Button fullWidth size="lg">
          متابعة الطلب
        </Button>
      </Link>

      <Link to="/products" className={styles.continue}>
        ← متابعة التسوق
      </Link>

      <p className={styles.note}>
        🔒 الدفع عند الاستلام متاح حاليًا. طرق دفع إضافية قريبًا.
      </p>
    </aside>
  );
}
