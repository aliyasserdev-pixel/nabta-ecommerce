import ProductPlaceholder from "../common/ProductPlaceholder";
import styles from "./ProductGallery.module.css";

const CATEGORY_ICONS = {
  seeds: "🌱",
  seedlings: "🌿",
  soil: "🪴",
  fertilizers: "💧",
  tools: "🛠️",
  pots: "🏺",
};

// معرض الصور — حاليًا صورة مؤقتة واحدة، وسيُطوَّر لدعم صور متعددة
export default function ProductGallery({ product }) {
  const icon = CATEGORY_ICONS[product.categorySlug] || "🌱";

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        <ProductPlaceholder icon={icon} label={product.name} />
      </div>
    </div>
  );
}
