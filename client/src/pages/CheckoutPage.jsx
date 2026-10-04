import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Breadcrumbs from "../components/product/Breadcrumbs";
import EmptyState from "../components/common/EmptyState";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { orderService } from "../services/orderService";
import { formatPrice } from "../utils/formatPrice";
import styles from "./CheckoutPage.module.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    customerEmail: user?.email || "",
    state: "",
    city: "",
    street: "",
    notes: "",
    paymentMethod: "CASH_ON_DELIVERY",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // لو السلة فارغة → لا نكمل
  if (items.length === 0) {
    return (
      <Container>
        <EmptyState
          icon="🛒"
          title="السلة فارغة"
          message="أضف منتجات قبل إتمام الطلب"
          actionLabel="تصفح المنتجات"
          actionTo="/products"
        />
      </Container>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        items: items.map((it) => ({
          productId: it.id,
          quantity: it.quantity,
        })),
      };

      const order = await orderService.create(payload);

      // نجح — نفرّغ السلة وننتقل للتفاصيل
      clearCart();
      navigate(`/orders/${order.id}`, {
        state: { justCreated: true, orderNumber: order.orderNumber },
      });
    } catch (err) {
      setError(err.message || "فشل إنشاء الطلب");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container>
      <Breadcrumbs
        items={[{ label: "السلة", to: "/cart" }, { label: "إتمام الطلب" }]}
      />

      <header className={styles.header}>
        <h1 className={styles.title}>إتمام الطلب</h1>
        <p className={styles.subtitle}>املأ بياناتك لإتمام عملية الشراء</p>
      </header>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* بيانات العميل */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>بيانات العميل</h2>

            <div className={styles.field}>
              <label htmlFor="customerName">الاسم الكامل *</label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={form.customerName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="customerPhone">رقم الهاتف *</label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={form.customerPhone}
                  onChange={handleChange}
                  required
                  dir="ltr"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="customerEmail">البريد الإلكتروني</label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  dir="ltr"
                />
              </div>
            </div>
          </section>

          {/* العنوان */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>عنوان التوصيل</h2>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="state">الولاية *</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="city">المدينة *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="street">العنوان التفصيلي *</label>
              <textarea
                id="street"
                name="street"
                value={form.street}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={200}
                rows={3}
                placeholder="الحي، الشارع، رقم المبنى..."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="notes">ملاحظات (اختياري)</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                maxLength={500}
                rows={2}
                placeholder="معلومات إضافية للتوصيل"
              />
            </div>
          </section>

          {/* طريقة الدفع */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>طريقة الدفع</h2>

            <label className={styles.radioOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="CASH_ON_DELIVERY"
                checked={form.paymentMethod === "CASH_ON_DELIVERY"}
                onChange={handleChange}
              />
              <span>💵 الدفع عند الاستلام</span>
            </label>

            <p className={styles.note}>
              طرق دفع إضافية (تحويل بنكي، بطاقات) قريبًا.
            </p>
          </section>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting
              ? "⏳ جاري إرسال الطلب..."
              : `تأكيد الطلب (${formatPrice(total)})`}
          </Button>

          <Link to="/cart" className={styles.back}>
            ← العودة للسلة
          </Link>
        </form>

        {/* ملخص الطلب */}
        <aside className={styles.summary}>
          <h2 className={styles.sectionTitle}>ملخص الطلب</h2>

          <ul className={styles.itemsList}>
            {items.map((item) => (
              <li key={item.id} className={styles.itemRow}>
                <span className={styles.itemName}>
                  {item.name} × {item.quantity}
                </span>
                <span className={styles.itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className={styles.totals}>
            <div>
              <dt>المجموع الفرعي</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>التوصيل</dt>
              <dd>{shipping === 0 ? "مجاني" : formatPrice(shipping)}</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>الإجمالي</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </Container>
  );
}
