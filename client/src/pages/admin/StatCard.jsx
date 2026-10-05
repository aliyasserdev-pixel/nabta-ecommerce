import styles from "./StatCard.module.css";

export default function StatCard({
  icon,
  label,
  value,
  color = "primary",
  hint,
}) {
  return (
    <div className={styles.card}>
      <div className={`${styles.icon} ${styles[color]}`}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {hint && <div className={styles.hint}>{hint}</div>}
      </div>
    </div>
  );
}
