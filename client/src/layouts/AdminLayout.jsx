import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../hooks/useAuth";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="القائمة"
          >
            ☰
          </button>

          <Link to="/" className={styles.backLink}>
            ← العودة للمتجر
          </Link>

          <div className={styles.userActions}>
            <span className={styles.userName}>{user?.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              خروج
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
