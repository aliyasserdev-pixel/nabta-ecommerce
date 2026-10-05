import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// حماية مسارات الإدارة — تسمح لـ Admin و Assistant فقط
export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        ⏳ جاري التحقق...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN" && user.role !== "ASSISTANT") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
