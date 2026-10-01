import { Link } from "react-router-dom";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className={styles.card}
      style={{ backgroundColor: category.color }}
    >
      <span className={styles.icon} aria-hidden="true">
        {category.icon}
      </span>
      <h3 className={styles.name}>{category.name}</h3>
      <p className={styles.description}>{category.description}</p>
    </Link>
  );
}
