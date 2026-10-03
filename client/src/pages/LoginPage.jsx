import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // المسار اللي نرجع له بعد الدخول
  const from = location.state?.from?.pathname || "/";

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>تسجيل الدخول</h1>
          <p className={styles.subtitle}>مرحبًا بعودتك إلى نَبْتة 🌱</p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                dir="ltr"
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          <p className={styles.footer}>
            ليس لديك حساب؟{" "}
            <Link to="/register" className={styles.link}>
              أنشئ حسابًا
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
