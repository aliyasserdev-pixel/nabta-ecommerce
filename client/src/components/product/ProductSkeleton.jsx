import styles from "./ProductSkeleton.module.css";

export default function ProductSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.line} style={{ width: "80%" }} />
        <div className={styles.line} style={{ width: "50%" }} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
