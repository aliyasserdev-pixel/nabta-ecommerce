import styles from "./Logo.module.css";
import { ar } from "../../locales/ar";

// الشعار الحالي مؤقت — يمكن استبداله لاحقًا بصورة حقيقية
export default function Logo({ variant = "default" }) {
  return (
    <a
      href="/"
      className={`${styles.logo} ${styles[variant]}`}
      aria-label={ar.brand.name}
    >
      {/* مكان مخصص للشعار المستقبلي */}
      <div className={styles.mark} aria-hidden="true">
        🌱
      </div>
      <span className={styles.name}>{ar.brand.name}</span>
    </a>
  );
}
