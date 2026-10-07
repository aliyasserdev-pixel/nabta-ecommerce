import { useState, useEffect } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import styles from "./OrderDetailsPage.module.css";

const STATUS_LABELS = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  PROCESSING: "قيد التجهيز",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغى",
};

const PAYMENT_LABELS = {
  CASH_ON_DELIVERY: "الدفع عند الاستلام",
  BANK_TRANSFER: "تحويل بنكي",
  ONLINE: "دفع إلكتروني",
};

// كامل التحديثات: كل 15 ثانية
const POLL_INTERVAL = 15000;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const justCreated = location.state?.justCreated;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // جلب الطلب
  async function fetchOrder(silent = false) {
    if (!silent) setLoading(true);

    try {
      const data = await orderService.getById(id);
      setOrder(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // التحميل الأولي
  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Polling — تحديث دوري
  useEffect(() => {
    // لا نُحدّث لو الطلب ملغى أو تم التوصيل (نهائي)
    if (!order) return;
    if (order.status === "CANCELLED" || order.status === "DELIVERED") return;

    const interval = setInterval(() => {
      fetchOrder(true); // silent — بدون loading
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [order?.status, id]);

  async function handleCancel() {
    if (!window.confirm("هل تريد إلغاء هذا الطلب؟")) return;

    setCancelling(true);
    try {
      const updated = await orderService.cancel(id);
      setOrder((prev) => ({ ...prev, status: updated.status }));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <Container>
        <p className={styles.status}>⏳ جاري التحميل...</p>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <EmptyState
          icon="❓"
          title="الطلب غير موجود"
          message="ربما تم حذفه أو أن الرابط غير صحيح."
          actionLabel="طلباتي"
          actionTo="/orders"
        />
      </Container>
    );
  }

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
  const isTracking =
    order.status !== "CANCELLED" && order.status !== "DELIVERED";

  return (
    <Container>
      <Breadcrumbs
        items={[
          { label: "طلباتي", to: "/orders" },
          { label: `#${order.orderNumber}` },
        ]}
      />

      {justCreated && (
        <div className={styles.successBanner}>
          ✅ تم إنشاء طلبك بنجاح! سنتواصل معك قريبًا للتأكيد.
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>طلب #{order.orderNumber}</h1>
          <p className={styles.date}>
            {new Date(order.createdAt).toLocaleString("ar-SD", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span className={styles.statusBadge}>
          {STATUS_LABELS[order.status]}
        </span>
      </header>

      {isTracking && (
        <div className={styles.tracking}>
          🔄 جاري متابعة حالة الطلب تلقائيًا...
          {lastUpdated && (
            <span className={styles.lastUpdated}>
              آخر تحديث: {lastUpdated.toLocaleTimeString("ar-SD")}
            </span>
          )}
        </div>
      )}

      <div className={styles.grid}>
        {/* المنتجات */}
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
              <dd>
                {order.shipping === 0 ? "مجاني" : formatPrice(order.shipping)}
              </dd>
            </div>
            <div className={styles.totalRow}>
              <dt>الإجمالي</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>

        {/* العنوان والدفع */}
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

          <div className={styles.infoBlock}>
            <div className={styles.infoLabel}>طريقة الدفع</div>
            <div className={styles.infoValue}>
              {PAYMENT_LABELS[order.paymentMethod]}
            </div>
          </div>

          {canCancel && (
            <Button
              variant="outline"
              fullWidth
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "⏳ جاري الإلغاء..." : "إلغاء الطلب"}
            </Button>
          )}
        </section>
      </div>

      <div className={styles.actions}>
        <Link to="/orders">
          <Button variant="ghost">← كل الطلبات</Button>
        </Link>
        <Link to="/products">
          <Button>تصفح المزيد</Button>
        </Link>
      </div>
    </Container>
  );
}
