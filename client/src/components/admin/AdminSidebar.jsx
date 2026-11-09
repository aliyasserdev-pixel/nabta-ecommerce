import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LayoutDashboard, Package, Sprout, Users, X } from "lucide-react";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const links = [
    { to: "/admin", label: "لوحة التحكم", Icon: LayoutDashboard, end: true },
    { to: "/admin/orders", label: "الطلبات", Icon: Package },
    { to: "/admin/products", label: "المنتجات", Icon: Sprout },
    ...(isAdmin
      ? [{ to: "/admin/users", label: "المستخدمون", Icon: Users }]
      : []),
  ];

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          {/* تحديث اسم اللوجو ليطابق ملفك */}
          <span className={styles.brand}>
            <img src="/logo.png" alt="نبتة" className={styles.brandLogo} />
            Admin
          </span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="إغلاق"
          >
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
              onClick={onClose}
            >
              <link.Icon size={20} strokeWidth={2} className={styles.icon} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userRole}>
              {user?.role === "ADMIN" ? "مدير" : "مساعد"}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
