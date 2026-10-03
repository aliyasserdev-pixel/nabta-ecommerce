import { useState, useEffect } from "react";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import CategoryCard from "../components/product/CategoryCard";
import { categoryService } from "../services/categoryService";
import styles from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch((err) => console.error("خطأ في تحميل التصنيفات:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <Breadcrumbs items={[{ label: "التصنيفات" }]} />

      <header className={styles.header}>
        <h1 className={styles.title}>كل التصنيفات</h1>
        <p className={styles.subtitle}>
          اختر التصنيف الذي يناسبك لتصفح المنتجات المتعلقة به.
        </p>
      </header>

      {loading ? (
        <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
          ⏳ جاري التحميل...
        </p>
      ) : categories.length === 0 ? (
        <p style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
          لا توجد تصنيفات حاليًا.
        </p>
      ) : (
        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </Container>
  );
}
