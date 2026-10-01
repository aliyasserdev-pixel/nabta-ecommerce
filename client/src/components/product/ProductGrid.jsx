import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import styles from "./ProductGrid.module.css";

export default function ProductGrid({ products, loading, skeletonCount = 8 }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
