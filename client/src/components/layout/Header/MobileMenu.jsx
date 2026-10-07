import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import Logo from "../../common/Logo";
import { useAuth } from "../../../hooks/useAuth";
import { ar } from "../../../locales/ar";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ isOpen, onClose, links }) {
  const { user, isAdmin, isAssistant, logout } = useAuth();

  // إغلاق بزر Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  async function handleLogout() {
    if (!window.confirm("هل تريد تسجيل الخروج؟")) return;
    await logout();
    onClose();
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-label={ar.actions.menu}
        aria-modal="true"
      >
        <div className={styles.header}>
          <Logo />
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={ar.actions.close}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* حالة المستخدم */}
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{user.name?.charAt(0) || "؟"}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>
                {isAdmin ? "مدير" : isAssistant ? "مساعد" : "عميل"}
              </div>
            </div>
          </div>
        )}

        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
              onClick={onClose}
            >
              {link.label}
            </NavLink>
          ))}

          {/* روابط إضافية للمستخدمين المسجّلين */}
          {user && (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                onClick={onClose}
              >
                حسابي
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                onClick={onClose}
              >
                طلباتي
              </NavLink>
              {(isAdmin || isAssistant) && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                  onClick={onClose}
                >
                  لوحة الإدارة
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className={styles.footer}>
          {user ? (
            <button onClick={handleLogout} className={styles.authLinkPrimary}>
              تسجيل الخروج
            </button>
          ) : (
            <>
              <Link to="/login" className={styles.authLink} onClick={onClose}>
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className={styles.authLinkPrimary}
                onClick={onClose}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
