import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import ProductCard from "../product/ProductCard";
import { featuredProducts } from "../../data/products";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="منتجات مميزة"
          subtitle="اختيارات موثوقة لعشّاق الزراعة المنزلية"
        />

        {featuredProducts.length === 0 ? (
          <p className={styles.empty}>لا توجد منتجات متاحة حاليًا.</p>
        ) : (
          <div className={styles.grid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className={styles.more}>
          <Link to="/products">
            <Button variant="outline">تصفح كل المنتجات</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
