import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import Button from "../components/common/Button";
import QuantitySelector from "../components/product/QuantitySelector";
import ProductGallery from "../components/product/ProductGallery";
import ProductGrid from "../components/product/ProductGrid";
import EmptyState from "../components/common/EmptyState";
import { productService } from "../services/productService";
import { useCart } from "../hooks/useCart";
import { formatPrice, getDiscountPercent } from "../utils/formatPrice";
import styles from "./ProductDetailsPage.module.css";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  // الوصول للسلة
  const { addItem, getQuantity } = useCart();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await productService.getBySlug(slug);
        if (cancelled) return;
        setProduct(p);
        setQuantity(1);

        const r = await productService.getRelated(p.id, 4);
        if (!cancelled) setRelated(r);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Container>
        <div className={styles.loading}>⏳ جاري تحميل المنتج...</div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <EmptyState
          icon="🌾"
          title="المنتج غير موجود"
          message="ربما تم حذفه أو أن الرابط غير صحيح."
          actionLabel="العودة للمتجر"
          actionTo="/products"
        />
      </Container>
    );
  }

  const discount = getDiscountPercent(product.price, product.oldPrice);
  const inStock = product.stock > 0;
  const inCartQty = getQuantity(product.id);

  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { label: "المتجر", to: "/products" },
            { label: product.name },
          ]}
        />

        <div className={styles.grid}>
          <div className={styles.galleryCol}>
            <ProductGallery product={product} />
          </div>

          <div className={styles.infoCol}>
            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.rating}>⭐ {product.rating} / 5</div>

            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className={styles.oldPrice}>
                    {formatPrice(product.oldPrice)}
                  </span>
                  <span className={styles.discountBadge}>خصم {discount}%</span>
                </>
              )}
            </div>

            <div className={styles.stock}>
              {inStock ? (
                <span className={styles.inStock}>
                  ✅ متوفر ({product.stock} قطعة)
                </span>
              ) : (
                <span className={styles.outStock}>❌ غير متوفر حاليًا</span>
              )}
            </div>

            <p className={styles.description}>
              منتج عالي الجودة من نَبْتة — مناسب للزراعة المنزلية. (الوصف الكامل
              سيُضاف عند ربط قاعدة البيانات.)
            </p>

            <div className={styles.actions}>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock || 1}
              />
              <Button
                size="lg"
                disabled={!inStock}
                onClick={() => {
                  addItem(product, quantity);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
              >
                {!inStock
                  ? "نفد المخزون"
                  : added
                    ? "✓ تمت الإضافة"
                    : "أضف إلى السلة"}
              </Button>
            </div>

            {inCartQty > 0 && (
              <Link to="/cart" className={styles.viewCart}>
                عرض السلة ({inCartQty})
              </Link>
            )}

            <ul className={styles.meta}>
              <li>🚚 توصيل سريع</li>
              <li>🌱 منتج أصلي</li>
              <li>💬 دعم زراعي</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>منتجات ذات صلة</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </Container>
    </>
  );
}
