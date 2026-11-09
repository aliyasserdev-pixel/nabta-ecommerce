import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import OrderStatusBadge from "./OrderStatusBadge";
import { adminService } from "../../services/adminService";
import { formatPrice } from "../../utils/formatPrice";
import styles from "./AdminDashboardPage.module.css";
import {
  Package,
  Clock,
  CheckCircle2,
  Sprout,
  Users,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([adminService.getStats(), adminService.getOrders({ limit: 5 })])
      .then(([s, o]) => {
        setStats(s);
        setRecentOrders(o.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          textAlign: "center",
          padding: "3rem",
        }}
      >
        <Loader2 size={24} className="lucide-spin" />
        جاري التحميل...
      </p>
    );
  }

  if (error) {
    return (
      <p
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "var(--color-danger)",
          textAlign: "center",
          padding: "3rem",
        }}
      >
        <AlertCircle size={24} />
        {error}
      </p>
    );
  }

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>لوحة التحكم</h1>
        <p className={styles.subtitle}>نظرة عامة على المتجر</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          icon={<Package size={28} />}
          label="إجمالي الطلبات"
          value={stats.totalOrders}
          color="primary"
        />
        <StatCard
          icon={<Clock size={28} />}
          label="طلبات قيد المراجعة"
          value={stats.pendingOrders}
          color="warning"
        />
        <StatCard
          icon={<CheckCircle2 size={28} />}
          label="طلبات مُسلّمة"
          value={stats.deliveredOrders}
          color="success"
        />
        <StatCard
          icon={<Sprout size={28} />}
          label="منتجات نشطة"
          value={stats.totalProducts}
          color="info"
        />
        <StatCard
          icon={<Users size={28} />}
          label="مستخدمون"
          value={stats.totalUsers}
          color="info"
        />
        <StatCard
          icon={<AlertTriangle size={28} />}
          label="مخزون منخفض"
          value={stats.lowStockCount}
          color="danger"
        />
      </div>

      <section className={styles.sales}>
        <div className={styles.salesCard}>
          <div className={styles.salesLabel}>إجمالي المبيعات</div>
          <div className={styles.salesValue}>
            {formatPrice(stats.totalSales)}
          </div>
        </div>
      </section>

      <section className={styles.recent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>آخر الطلبات</h2>
          <Link to="/admin/orders" className={styles.viewAll}>
            عرض الكل ←
          </Link>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>رقم الطلب</div>
            <div>العميل</div>
            <div>الإجمالي</div>
            <div>الحالة</div>
            <div></div>
          </div>

          {recentOrders.map((order) => (
            <div key={order.id} className={styles.tableRow}>
              <div className={styles.orderNum} dir="ltr">
                #{order.orderNumber}
              </div>
              <div>{order.customerName}</div>
              <div className={styles.total}>{formatPrice(order.total)}</div>
              <div>
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <Link to={`/admin/orders/${order.id}`} className={styles.link}>
                  عرض
                </Link>
              </div>
            </div>
          ))}

          {recentOrders.length === 0 && (
            <div className={styles.empty}>لا توجد طلبات بعد</div>
          )}
        </div>
      </section>
    </div>
  );
}
