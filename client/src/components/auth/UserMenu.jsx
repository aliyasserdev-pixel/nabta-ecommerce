import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // إغلاق عند النقر خارج القائمة
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="قائمة الحساب"
      >
        <span className={styles.avatar}>{user.name.charAt(0)}</span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <div className={styles.header}>
            <strong>{user.name}</strong>
            <small dir="ltr">{user.email}</small>
          </div>

          <Link
            to="/profile"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            👤 حسابي
          </Link>

          <Link
            to="/orders"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            📦 طلباتي
          </Link>

          {user.role === "ADMIN" && (
            <Link
              to="/admin"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              ⚙️ لوحة التحكم
            </Link>
          )}

          {user.role === "ASSISTANT" && (
            <Link
              to="/assistant"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              🛡️ لوحة المساعد
            </Link>
          )}

          <button
            onClick={handleLogout}
            className={`${styles.item} ${styles.danger}`}
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}
