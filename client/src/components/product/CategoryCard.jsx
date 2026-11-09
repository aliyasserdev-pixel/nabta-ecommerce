import { Link } from "react-router-dom";
import { Sprout, Leaf, Droplets, Wrench, Flower2, Package } from "lucide-react";
import styles from "./CategoryCard.module.css";

// خريطة تربط كل تصنيف (عبر الـ slug) بالأيقونة المناسبة له
const ICON_MAP = {
  seedlings: Sprout, // شتول
  seeds: Leaf, // بذور
  soil: Package, // تربة
  fertilizers: Droplets, // أسمدة
  tools: Wrench, // أدوات
  pots: Flower2, // أصص
};

export default function CategoryCard({ category }) {
  // نختار الأيقونة بناءً على الـ slug، وإذا لم توجد نستخدم Sprout كافتراضي
  const IconComponent = ICON_MAP[category.slug] || Sprout;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className={styles.card}
      style={{ backgroundColor: category.color }}
    >
      <div className={styles.iconWrap}>
        <IconComponent className={styles.icon} strokeWidth={1.8} />
      </div>
      <h3 className={styles.name}>{category.name}</h3>
      <p className={styles.description}>{category.description}</p>
    </Link>
  );
}
