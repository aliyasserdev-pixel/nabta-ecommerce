import styles from "./SectionTitle.module.css";

// عنوان قسم موحّد — يُستخدم في كل أقسام الصفحة الرئيسية
export default function SectionTitle({ title, subtitle, align = "center" }) {
  return (
    <div className={`${styles.wrap} ${styles[align]}`}>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
