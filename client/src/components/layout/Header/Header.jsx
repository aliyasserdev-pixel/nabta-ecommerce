import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "../../common/Container";
import Logo from "../../common/Logo";
import MobileMenu from "./MobileMenu";
import { ar } from "../../../locales/ar";
import styles from "./Header.module.css";

// روابط التنقل الرئيسية
const NAV_LINKS = [
  { to: "/", label: ar.nav.home, exact: true },
  { to: "/products", label: ar.nav.shop },
  { to: "/categories", label: ar.nav.categories },
  { to: "/home-garden", label: ar.nav.homeGarden },
  { to: "/blog", label: ar.nav.blog },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // إغلاق قائمة الموبايل عند تغيير المقاس للـ Desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // منع التمرير في الصفحة عند فتح قائمة الموبايل
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        {/* زر القائمة للموبايل */}
        <button
          className={styles.menuBtn}
          onClick={() => setMobileMenuOpen(true)}
          aria-label={ar.actions.menu}
          aria-expanded={isMobileMenuOpen}
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
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Logo />

        {/* التنقل للـ Desktop */}
        <nav className={styles.nav} aria-label="التنقل الرئيسي">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* الأزرار على اليسار */}
        <div className={styles.actions}>
          <button className={styles.iconBtn} aria-label={ar.actions.search}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            to="/login"
            className={styles.iconBtn}
            aria-label={ar.actions.account}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <Link
            to="/cart"
            className={`${styles.iconBtn} ${styles.cartBtn}`}
            aria-label={ar.actions.cart}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </Link>
        </div>
      </Container>

      {/* قائمة الموبايل */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}
