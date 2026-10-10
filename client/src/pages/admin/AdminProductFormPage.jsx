import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import { adminService } from "../../services/adminService";
import { categoryService } from "../../services/categoryService";
import styles from "./AdminProductFormPage.module.css";
import ImageUploader from "../../components/admin/ImageUploader";

export default function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    shortDesc: "",
    imageUrl: "",
    price: 0,
    oldPrice: "",
    stock: 0,
    categoryId: "",
    isFeatured: false,
    isActive: true,
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    if (isEdit) {
      adminService
        .getProducts({ limit: 100 })
        .then((data) => {
          const product = data.items.find((p) => p.id === id);
          if (product) {
            setForm({
              name: product.name,
              slug: product.slug,
              description: product.description || "",
              shortDesc: product.shortDesc || "",
              imageUrl: product.imageUrl || "",
              price: product.price,
              oldPrice: product.oldPrice || "",
              stock: product.stock,
              categoryId: product.categoryId,
              isFeatured: product.isFeatured,
              isActive: product.isActive,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // ⚠️ توليد slug تلقائيًا من الاسم (اختياري)
  function generateSlug() {
    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // احذف الرموز
      .replace(/\s+/g, "-") // استبدل المسافات بـ -
      .replace(/-+/g, "-"); // احذف الشرطات المتكررة

    setForm((prev) => ({ ...prev, slug }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // ⚠️ تحقق من الـ slug
    if (!form.slug || !/^[a-z0-9-]+$/.test(form.slug)) {
      setError(
        "الـ slug يجب أن يحتوي فقط على: أحرف إنجليزية صغيرة، أرقام، وشرطات (-). مثال: tomato-seeds",
      );
      return;
    }

    // ⚠️ تحقق من السعر
    if (Number(form.price) <= 0) {
      setError("السعر يجب أن يكون أكبر من 0");
      return;
    }

    // ⚠️ تحقق من المخزون
    if (Number(form.stock) < 0) {
      setError("المخزون لا يمكن أن يكون سالبًا");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        slug: form.slug.trim().toLowerCase(),
        imageUrl: form.imageUrl || null,
        price: Number(form.price),
        oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
        stock: Number(form.stock),
      };

      if (isEdit) {
        await adminService.updateProduct(id, payload);
      } else {
        await adminService.createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className={styles.status}>⏳ جاري التحميل...</p>;

  return (
    <div>
      <header className={styles.header}>
        <Link to="/admin/products" className={styles.back}>
          ← المنتجات
        </Link>
        <h1 className={styles.title}>{isEdit ? "تعديل منتج" : "منتج جديد"}</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>اسم المنتج *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            minLength={2}
            maxLength={200}
          />
        </div>

        <div className={styles.field}>
          <label>
            الـ slug *
            <span className={styles.hint}>
              (إنجليزي فقط: أحرف صغيرة، أرقام، شرطات)
            </span>
          </label>
          <div className={styles.slugRow}>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              dir="ltr"
              placeholder="tomato-seeds"
            />
            <button
              type="button"
              className={styles.generateBtn}
              onClick={generateSlug}
              disabled={!form.name}
            >
              توليد تلقائي
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label>التصنيف *</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">اختر تصنيفًا</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>السعر *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="1"
            />
          </div>
          <div className={styles.field}>
            <label>السعر القديم</label>
            <input
              type="number"
              name="oldPrice"
              value={form.oldPrice}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="اتركه فارغًا"
            />
          </div>
          <div className={styles.field}>
            <label>المخزون *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>الوصف المختصر</label>
          <input
            name="shortDesc"
            value={form.shortDesc}
            onChange={handleChange}
            maxLength={200}
          />
        </div>

        <div className={styles.field}>
          <label>صورة المنتج</label>
          <ImageUploader
            currentUrl={form.imageUrl}
            onUploaded={(url) =>
              setForm((prev) => ({ ...prev, imageUrl: url || "" }))
            }
            disabled={submitting}
          />
        </div>

        <div className={styles.field}>
          <label>
            الوصف الكامل
            <span className={styles.hint}>
              (يمكن استخدام HTML: &lt;h2&gt;، &lt;ul&gt;، &lt;li&gt;،
              &lt;strong&gt;)
            </span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={12}
            placeholder="<h2>النبات</h2>
<ul>
  <li>نبات قوي</li>
  <li>إنتاج مستمر</li>
</ul>"
          />
        </div>

        <div className={styles.checkboxes}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            <span>منتج مميز</span>
          </label>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>نشط</span>
          </label>
        </div>

        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <div className={styles.actions}>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "⏳ جاري الحفظ..."
              : isEdit
                ? "حفظ التعديلات"
                : "إضافة المنتج"}
          </Button>
          <Link to="/admin/products">
            <Button type="button" variant="ghost">
              إلغاء
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
