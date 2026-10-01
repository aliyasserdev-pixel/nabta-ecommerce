import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../common/Logo";
import { ar } from "../../../locales/ar";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ isOpen, onClose, links }) {
  // إغلاق بزر Escape
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {/* الطبقة الخلفية */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* القائمة الجانبية */}
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
        </nav>

        <div className={styles.footer}>
          <NavLink to="/login" className={styles.authLink} onClick={onClose}>
            {ar.actions.login}
          </NavLink>
          <NavLink
            to="/register"
            className={styles.authLinkPrimary}
            onClick={onClose}
          >
            {ar.actions.register}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
