import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// يسمح فقط للـ Admin (ليس Assistant)
export default function AdminRouteOnly() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
