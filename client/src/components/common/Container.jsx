import styles from "./Container.module.css";

// حاوية بعرض ثابت في المنتصف — تُستخدم في كل صفحة
export default function Container({ children, className = "" }) {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
}
