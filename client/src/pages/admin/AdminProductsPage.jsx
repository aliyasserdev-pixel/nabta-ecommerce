import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./AdminProductsPage.module.css";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      adminService
        .getProducts({ search, limit: 50 })
        .then((data) => setProducts(data.items))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleDelete(product) {
    if (!window.confirm(`هل تريد حذف "${product.name}"؟`)) return;

    try {
      const result = await adminService.deleteProduct(product.id);
      if (result.deleted) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isActive: false } : p,
          ),
        );
      }
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>المنتجات</h1>
          <p className={styles.subtitle}>إدارة كتالوج المنتجات</p>
        </div>
        {isAdmin && (
          <Link to="/admin/products/new">
            <Button>+ منتج جديد</Button>
          </Link>
        )}
      </header>

      <input
        type="search"
        className={styles.search}
        placeholder="🔍 ابحث باسم المنتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p className={styles.status}>⏳ جاري التحميل...</p>}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {!loading && products.length === 0 && (
        <div className={styles.empty}>لا توجد منتجات</div>
      )}

      {!loading && products.length > 0 && (
        <div className={styles.table}>
          {products.map((product) => (
            <div key={product.id} className={styles.row}>
              <div className={styles.info}>
                <div className={styles.name}>{product.name}</div>
                <div className={styles.meta}>
                  {product.category.name} • {product.slug}
                </div>
              </div>
              <div className={styles.price}>{formatPrice(product.price)}</div>
              <div className={styles.stock}>
                <span className={product.stock === 0 ? styles.stockOut : ""}>
                  {product.stock} قطعة
                </span>
              </div>
              <div className={styles.badges}>
                {product.isFeatured && (
                  <span className={styles.badge}>مميز</span>
                )}
                {!product.isActive && (
                  <span className={`${styles.badge} ${styles.badgeInactive}`}>
                    معطّل
                  </span>
                )}
              </div>
              <div className={styles.actions}>
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className={styles.link}
                >
                  تعديل
                </Link>
                {isAdmin && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(product)}
                  >
                    حذف
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
