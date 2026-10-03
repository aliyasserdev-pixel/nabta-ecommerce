import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// يحمي المسارات — يعيد التوجيه لصفحة الدخول إن لم يكن المستخدم مسجلًا
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // أثناء التحقق من المستخدم — لا نُعيد التوجيه بعد
  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        ⏳ جاري التحقق...
      </div>
    );
  }

  // غير مسجل → لصفحة الدخول
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // تحقق من الصلاحيات
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        🚫 ليست لديك الصلاحية للوصول لهذه الصفحة
      </div>
    );
  }

  return children;
}
