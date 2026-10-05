import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import { adminService } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./AdminOrdersPage.module.css";

const STATUS_FILTERS = [
  { value: "", label: "الكل" },
  { value: "PENDING", label: "قيد المراجعة" },
  { value: "CONFIRMED", label: "مؤكدة" },
  { value: "PROCESSING", label: "قيد التجهيز" },
  { value: "SHIPPED", label: "مشحونة" },
  { value: "DELIVERED", label: "مُسلّمة" },
  { value: "CANCELLED", label: "ملغاة" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      adminService
        .getOrders({ status, search, limit: 30 })
        .then((data) => setOrders(data.items))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [status, search]);

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>الطلبات</h1>
        <p className={styles.subtitle}>إدارة وتتبع كل الطلبات</p>
      </header>

      <div className={styles.filters}>
        <input
          type="search"
          className={styles.search}
          placeholder="🔍 ابحث برقم الطلب، الاسم، الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.tabs}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              className={`${styles.tab} ${status === f.value ? styles.tabActive : ""}`}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className={styles.status}>⏳ جاري التحميل...</p>}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className={styles.empty}>لا توجد طلبات مطابقة</div>
      )}

      {!loading && orders.length > 0 && (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>رقم الطلب</div>
            <div>العميل</div>
            <div>الهاتف</div>
            <div>الإجمالي</div>
            <div>الحالة</div>
            <div>التاريخ</div>
            <div></div>
          </div>

          {orders.map((order) => (
            <div key={order.id} className={styles.tableRow}>
              <div className={styles.orderNum} dir="ltr">
                #{order.orderNumber}
              </div>
              <div>{order.customerName}</div>
              <div dir="ltr" className={styles.phone}>
                {order.customerPhone}
              </div>
              <div className={styles.total}>{formatPrice(order.total)}</div>
              <div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className={styles.date}>
                {new Date(order.createdAt).toLocaleDateString("ar-SD")}
              </div>
              <div>
                <Link to={`/admin/orders/${order.id}`} className={styles.link}>
                  عرض
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
