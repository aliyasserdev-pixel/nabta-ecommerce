import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import styles from "./OrdersPage.module.css";

// ترجمة حالات الطلب
const STATUS_LABELS = {
  PENDING: { text: "قيد المراجعة", color: "warning" },
  CONFIRMED: { text: "مؤكد", color: "info" },
  PROCESSING: { text: "قيد التجهيز", color: "info" },
  SHIPPED: { text: "تم الشحن", color: "info" },
  DELIVERED: { text: "تم التوصيل", color: "success" },
  CANCELLED: { text: "ملغى", color: "danger" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderService
      .getAll()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Breadcrumbs items={[{ label: "طلباتي" }]} />

      <header className={styles.header}>
        <h1 className={styles.title}>طلباتي</h1>
        <p className={styles.subtitle}>تابع حالة طلباتك السابقة</p>
      </header>

      {loading && <p className={styles.status}>⏳ جاري تحميل الطلبات...</p>}

      {error && <p className={styles.error}>⚠️ {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <EmptyState
          icon="📦"
          title="لا توجد طلبات بعد"
          message="ابدأ التسوق وستظهر طلباتك هنا."
          actionLabel="تصفح المنتجات"
          actionTo="/products"
        />
      )}

      {!loading && orders.length > 0 && (
        <div className={styles.list}>
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] || {
              text: order.status,
              color: "info",
            };

            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.orderNumber}>
                      #{order.orderNumber}
                    </div>
                    <div className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString("ar-SD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${styles[status.color]}`}
                  >
                    {status.text}
                  </span>
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.itemsCount}>
                    {order.items.length} منتج
                  </div>
                  <div className={styles.total}>{formatPrice(order.total)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
