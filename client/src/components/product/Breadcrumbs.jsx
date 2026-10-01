import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

// مسار التنقل — يقبل مصفوفة { label, to? }
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="مسار التنقل" className={styles.nav}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.link}>
            الرئيسية
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className={styles.item}>
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
              {item.to && !isLast ? (
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
