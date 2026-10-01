import { Link } from "react-router-dom";
import Button from "../common/Button";
import styles from "./EmptyCart.module.css";

export default function EmptyCart() {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden="true">
        🛒
      </div>
      <h2 className={styles.title}>سلتك فاضية</h2>
      <p className={styles.message}>
        لم تُضف أي منتجات بعد. تصفح منتجاتنا وابدأ حديقتك المنزلية.
      </p>
      <Link to="/products">
        <Button size="lg">تصفح المنتجات</Button>
      </Link>
    </div>
  );
}
