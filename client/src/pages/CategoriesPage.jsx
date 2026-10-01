import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import CategoryCard from "../components/product/CategoryCard";
import { categories } from "../data/categories";
import styles from "./CategoriesPage.module.css";

export default function CategoriesPage() {
  return (
    <Container>
      <Breadcrumbs items={[{ label: "التصنيفات" }]} />

      <header className={styles.header}>
        <h1 className={styles.title}>كل التصنيفات</h1>
        <p className={styles.subtitle}>
          اختر التصنيف الذي يناسبك لتصفح المنتجات المتعلقة به.
        </p>
      </header>

      <div className={styles.grid}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </Container>
  );
}
