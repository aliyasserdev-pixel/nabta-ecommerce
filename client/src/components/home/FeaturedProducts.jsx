import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";
import ProductCard from "../product/ProductCard";
import { productService } from "../../services/productService";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getFeatured(4)
      .then(setProducts)
      .catch((err) => console.error("خطأ في تحميل المنتجات المميزة:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="منتجات مميزة"
          subtitle="اختيارات موثوقة لعشّاق الزراعة المنزلية"
        />

        {loading ? (
          <p className={styles.empty}>⏳ جاري التحميل...</p>
        ) : products.length === 0 ? (
          <p className={styles.empty}>لا توجد منتجات متاحة حاليًا.</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
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
