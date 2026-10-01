import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import { useCart } from "../hooks/useCart";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, uniqueCount } = useCart();

  return (
    <Container>
      <Breadcrumbs items={[{ label: "السلة" }]} />

      <header className={styles.header}>
        <h1 className={styles.title}>سلة التسوق</h1>
        {uniqueCount > 0 && (
          <p className={styles.subtitle}>
            لديك {uniqueCount} {uniqueCount === 1 ? "منتج" : "منتجات"} في السلة.
          </p>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className={styles.grid}>
          <div className={styles.itemsCol}>
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.summaryCol}>
            <CartSummary />
          </div>
        </div>
      )}
    </Container>
  );
}
