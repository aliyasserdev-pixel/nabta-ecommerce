import { useParams } from "react-router-dom";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import { useProducts } from "../hooks/useProducts";
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import styles from "./CategoryPage.module.css";

const PAGE_SIZE = 12;

export default function CategoryPage() {
  const { slug } = useParams();
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

 const [category, setCategory] = useState(null);
 const [categoryLoading, setCategoryLoading] = useState(true);

 useEffect(() => {
   categoryService
     .getBySlug(slug)
     .then(setCategory)
     .catch(() => setCategory(null))
     .finally(() => setCategoryLoading(false));
 }, [slug]);

  const { data, loading, error } = useProducts({
    categorySlug: slug,
    sort: sort === "default" ? undefined : sort,
    page,
    limit: PAGE_SIZE,
  });

  if (categoryLoading) {
    return (
      <Container>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          ⏳ جاري التحميل...
        </p>
      </Container>
    );
  }

  if (!category) {
    return (
      <Container>
        <EmptyState
          icon="📂"
          title="التصنيف غير موجود"
          message="ربما تم حذفه أو أن الرابط غير صحيح."
          actionLabel="تصفح كل التصنيفات"
          actionTo="/categories"
        />
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumbs
        items={[
          { label: "التصنيفات", to: "/categories" },
          { label: category.name },
        ]}
      />

      <header className={styles.header}>
        <div
          className={styles.icon}
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        >
          {category.icon}
        </div>
        <div>
          <h1 className={styles.title}>{category.name}</h1>
          <p className={styles.subtitle}>{category.description}</p>
        </div>
      </header>

      <ProductFilters
        sort={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        resultCount={data?.total ?? 0}
        loading={loading}
      />

      {error && <div className={styles.error}>⚠️ تعذّر تحميل المنتجات.</div>}

      {!loading && !error && data?.items.length === 0 && (
        <EmptyState
          icon="🌱"
          title="لا توجد منتجات"
          message="لا توجد منتجات في هذا التصنيف حاليًا."
          actionLabel="تصفح كل المنتجات"
          actionTo="/products"
        />
      )}

      {(loading || data?.items.length > 0) && (
        <ProductGrid products={data?.items || []} loading={loading} />
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </Container>
  );
}
