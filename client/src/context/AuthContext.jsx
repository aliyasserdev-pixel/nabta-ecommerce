import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // عند أول تحميل: نجلب المستخدم الحالي
  useEffect(() => {
    let cancelled = false;

    authService
      .getCurrentUser()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // تسجيل الدخول
  const login = useCallback(async (credentials) => {
    const u = await authService.login(credentials);
    setUser(u);
    return u;
  }, []);

  // تسجيل حساب جديد
  const register = useCallback(async (data) => {
    const u = await authService.register(data);
    setUser(u);
    return u;
  }, []);

  // تسجيل الخروج
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "ADMIN",
      isAssistant: user?.role === "ASSISTANT",
      isStaff: user?.role === "ADMIN" || user?.role === "ASSISTANT",
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
