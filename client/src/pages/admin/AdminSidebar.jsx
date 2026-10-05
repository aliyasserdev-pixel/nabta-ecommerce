import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AdminSidebar.module.css";

export default function AdminSidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const links = [
    { to: "/admin", label: "لوحة التحكم", icon: "📊", end: true },
    { to: "/admin/orders", label: "الطلبات", icon: "📦" },
    { to: "/admin/products", label: "المنتجات", icon: "🌱" },
    ...(isAdmin
      ? [{ to: "/admin/users", label: "المستخدمون", icon: "👥" }]
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
          <span className={styles.brand}>🌱 نبتة Admin</span>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="إغلاق"
          >
            ✕
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
              <span className={styles.icon}>{link.icon}</span>
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
