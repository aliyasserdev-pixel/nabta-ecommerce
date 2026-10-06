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
  imageUrl: "", // ⬅️ جديد
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
              imageUrl: product.imageUrl || "", // ⬅️ جديد
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
     const payload = {
       ...form,
       imageUrl: form.imageUrl || null, // ⬅️ جديد
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
          />
        </div>

        <div className={styles.field}>
          <label>الـ slug * (إنجليزي فقط، أحرف صغيرة وشرطات)</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            dir="ltr"
            pattern="[a-z0-9-]+"
          />
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
          <label>الوصف الكامل</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            maxLength={2000}
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
