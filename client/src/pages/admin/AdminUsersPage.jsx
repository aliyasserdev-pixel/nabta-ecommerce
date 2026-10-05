import { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { useAuth } from "../../hooks/useAuth";
import styles from "./AdminUsersPage.module.css";

const ROLE_LABELS = {
  ADMIN: "مدير",
  ASSISTANT: "مساعد",
  CUSTOMER: "عميل",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      adminService
        .getUsers({ role, search, limit: 50 })
        .then((data) => setUsers(data.items))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [role, search]);

  async function changeRole(userId, newRole) {
    try {
      const updated = await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)),
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function toggleActive(userId) {
    try {
      const updated = await adminService.toggleUserActive(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: updated.isActive } : u,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>المستخدمون</h1>
        <p className={styles.subtitle}>إدارة الحسابات والصلاحيات</p>
      </header>

      <div className={styles.filters}>
        <input
          type="search"
          className={styles.search}
          placeholder="🔍 ابحث بالاسم أو البريد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">كل الأدوار</option>
          <option value="ADMIN">مدير</option>
          <option value="ASSISTANT">مساعد</option>
          <option value="CUSTOMER">عميل</option>
        </select>
      </div>

      {loading && <p className={styles.status}>⏳ جاري التحميل...</p>}
      {error && <p className={styles.error}>⚠️ {error}</p>}

      {!loading && users.length > 0 && (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>الاسم</div>
            <div>البريد</div>
            <div>الدور</div>
            <div>الحالة</div>
            <div>الطلبات</div>
            <div></div>
          </div>

          {users.map((u) => {
            const isSelf = u.id === currentUser?.id;
            return (
              <div key={u.id} className={styles.row}>
                <div className={styles.name}>{u.name}</div>
                <div className={styles.email} dir="ltr">
                  {u.email}
                </div>
                <div>
                  <select
                    className={styles.roleSelect}
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    disabled={isSelf}
                  >
                    <option value="ADMIN">مدير</option>
                    <option value="ASSISTANT">مساعد</option>
                    <option value="CUSTOMER">عميل</option>
                  </select>
                </div>
                <div>
                  <span
                    className={u.isActive ? styles.active : styles.inactive}
                  >
                    {u.isActive ? "نشط" : "معطّل"}
                  </span>
                </div>
                <div className={styles.orders}>{u._count?.orders ?? 0}</div>
                <div>
                  {!isSelf && (
                    <button
                      className={
                        u.isActive ? styles.toggleOff : styles.toggleOn
                      }
                      onClick={() => toggleActive(u.id)}
                    >
                      {u.isActive ? "تعطيل" : "تفعيل"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
