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

export default function ProductGallery({ product }) {
  const icon =
    CATEGORY_ICONS[product.category?.slug || product.categorySlug] || "🌱";

  return (
    <div className={styles.gallery}>
      <div className={styles.main}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
          />
        ) : (
          <ProductPlaceholder icon={icon} label={product.name} />
        )}
      </div>
    </div>
  );
}
