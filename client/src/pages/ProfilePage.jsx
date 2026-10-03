import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <Container>
      <Breadcrumbs items={[{ label: "حسابي" }]} />

      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.avatar} aria-hidden="true">
            {user.name.charAt(0)}
          </div>

          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.email} dir="ltr">
            {user.email}
          </p>

          {user.phone && (
            <p className={styles.phone} dir="ltr">
              {user.phone}
            </p>
          )}

          <div className={styles.roleBadge}>
            {user.role === "ADMIN" && "👑 مدير"}
            {user.role === "ASSISTANT" && "🛡️ مساعد إداري"}
            {user.role === "CUSTOMER" && "👤 عميل"}
          </div>

          <div className={styles.actions}>
            <Button onClick={handleLogout} variant="outline" fullWidth>
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
