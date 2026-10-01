import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import CategoryCard from "../product/CategoryCard";
import { categories } from "../../data/categories";
import styles from "./CategoriesSection.module.css";

export default function CategoriesSection() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="تصفح حسب التصنيف"
          subtitle="اختر ما يناسب احتياجك من مجموعتنا المتنوعة"
        />

        <div className={styles.grid}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
