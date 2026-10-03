import { useState, useEffect } from "react";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import CategoryCard from "../product/CategoryCard";
import { categoryService } from "../../services/categoryService";
import styles from "./CategoriesSection.module.css";

export default function CategoriesSection() {
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
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="تصفح حسب التصنيف"
          subtitle="اختر ما يناسب احتياجك من مجموعتنا المتنوعة"
        />

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
            ⏳ جاري التحميل...
          </p>
        ) : (
          <div className={styles.grid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
