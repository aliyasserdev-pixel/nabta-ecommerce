import { Link } from "react-router-dom";
import Button from "./Button";
import styles from "./EmptyState.module.css";

export default function EmptyState({
  icon = "🌱",
  title = "لا يوجد شيء هنا",
  message,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {actionLabel &&
        (actionTo ? (
          <Link to={actionTo}>
            <Button>{actionLabel}</Button>
          </Link>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        ))}
    </div>
  );
}
