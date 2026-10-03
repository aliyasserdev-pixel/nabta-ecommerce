import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // تحقق سريع
    if (form.password !== form.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1 className={styles.title}>إنشاء حساب جديد</h1>
          <p className={styles.subtitle}>
            انضم إلى نَبْتة وابدأ حديقتك المنزلية 🌱
          </p>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="name">الاسم الكامل</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="مثال: أحمد محمد"
              />
            </div>

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
              <label htmlFor="phone">رقم الهاتف (اختياري)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                dir="ltr"
                placeholder="+249..."
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
                autoComplete="new-password"
                placeholder="8 أحرف على الأقل، تشمل رقمًا"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">تأكيد كلمة المرور</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="أعد كتابة كلمة المرور"
              />
            </div>

            <Button type="submit" size="lg" fullWidth disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>

          <p className={styles.footer}>
            لديك حساب؟{" "}
            <Link to="/login" className={styles.link}>
              سجّل الدخول
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
