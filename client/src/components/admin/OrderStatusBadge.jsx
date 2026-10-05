import styles from "./OrderStatusBadge.module.css";

const STATUS_MAP = {
  PENDING: { text: "قيد المراجعة", variant: "warning" },
  CONFIRMED: { text: "مؤكد", variant: "info" },
  PROCESSING: { text: "قيد التجهيز", variant: "info" },
  SHIPPED: { text: "تم الشحن", variant: "primary" },
  DELIVERED: { text: "تم التوصيل", variant: "success" },
  CANCELLED: { text: "ملغى", variant: "danger" },
};

export default function OrderStatusBadge({ status }) {
  const info = STATUS_MAP[status] || { text: status, variant: "info" };
  return (
    <span className={`${styles.badge} ${styles[info.variant]}`}>
      {info.text}
    </span>
  );
}
