import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ما زال يتحقق من الجلسة
  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        ⏳ جاري التحقق...
      </div>
    );
  }

  // غير مسجّل → نحوّل لصفحة الدخول
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // صلاحيات مطلوبة ولم تتحقق
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        🚫 ليست لديك الصلاحية للوصول لهذه الصفحة
      </div>
    );
  }

  // ✅ الحل: نُعيد Outlet لعرض المسار الفرعي
  return <Outlet />;
}
