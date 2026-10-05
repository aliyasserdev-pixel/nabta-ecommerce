import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import Button from "../../components/common/Button";
import { adminService } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./AdminOrderDetailsPage.module.css";

// الحالات المسموحة من كل حالة
const NEXT_STATUSES = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_LABELS = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "تأكيد الطلب",
  PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "إلغاء",
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    adminService
      .getOrderById(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(newStatus) {
    setUpdating(true);
    try {
      const updated = await adminService.updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: updated.status }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className={styles.status}>⏳ جاري التحميل...</p>;
  if (error || !order)
    return <p className={styles.error}>⚠️ {error || "الطلب غير موجود"}</p>;

  const nextOptions = NEXT_STATUSES[order.status] || [];

  return (
    <div>
      <header className={styles.header}>
        <div>
          <Link to="/admin/orders" className={styles.back}>
            ← كل الطلبات
          </Link>
          <h1 className={styles.title} dir="ltr">
            #{order.orderNumber}
          </h1>
          <p className={styles.date}>
            {new Date(order.createdAt).toLocaleString("ar-SD")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      {nextOptions.length > 0 && (
        <div className={styles.actions}>
          <div className={styles.actionsLabel}>تحديث الحالة:</div>
          {nextOptions.map((nextStatus) => (
            <Button
              key={nextStatus}
              onClick={() => changeStatus(nextStatus)}
              disabled={updating}
              variant={nextStatus === "CANCELLED" ? "outline" : "primary"}
            >
              {STATUS_LABELS[nextStatus] || nextStatus}
            </Button>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>المنتجات</h2>
          <ul className={styles.itemsList}>
            {order.items.map((item) => (
              <li key={item.id} className={styles.itemRow}>
                <div>
                  <div className={styles.itemName}>{item.productName}</div>
                  <div className={styles.itemMeta}>
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  {formatPrice(item.total)}
                </div>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div>
              <dt>المجموع الفرعي</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div>
              <dt>التوصيل</dt>
              <dd>{formatPrice(order.shipping)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>الإجمالي</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>بيانات التوصيل</h2>

          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>الاسم</div>
            <div className={styles.infoValue}>{order.customerName}</div>
          </div>
          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>الهاتف</div>
            <div className={styles.infoValue} dir="ltr">
              {order.customerPhone}
            </div>
          </div>
          {order.customerEmail && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>البريد</div>
              <div className={styles.infoValue} dir="ltr">
                {order.customerEmail}
              </div>
            </div>
          )}
          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>العنوان</div>
            <div className={styles.infoValue}>
              {order.state} — {order.city}
              <br />
              {order.street}
            </div>
          </div>
          {order.notes && (
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>ملاحظات</div>
              <div className={styles.infoValue}>{order.notes}</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
