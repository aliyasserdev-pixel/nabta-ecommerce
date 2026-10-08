import styles from "./Logo.module.css";
import { ar } from "../../locales/ar";

// الشعار الرسمي لـ نبتة
// variant: "default" (للـ Header) أو "light" (للفوتر الداكن)
export default function Logo({ variant = "default" }) {
  const logoSrc = variant === "light" ? "/logo-white.png" : "/logo.png";

  return (
    <a
      href="/"
      className={`${styles.logo} ${styles[variant]}`}
      aria-label={ar.brand.name}
    >
      <img src={logoSrc} alt={ar.brand.name} className={styles.image} />
    </a>
  );
}
