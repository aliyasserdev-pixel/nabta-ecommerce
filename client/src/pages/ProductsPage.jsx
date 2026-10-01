import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/common/Container";
import Breadcrumbs from "../components/product/Breadcrumbs";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import { useProducts } from "../hooks/useProducts";
import styles from "./ProductsPage.module.css";

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  // قراءة الفلاتر من URL (مفيد للبحث والمشاركة)
  const categorySlug = searchParams.get("category") || undefined;
  const search = searchParams.get("q") || undefined;

  const params = useMemo(
    () => ({
      categorySlug,
      search,
      sort: sort === "default" ? undefined : sort,
      page,
      limit: PAGE_SIZE,
    }),
    [categorySlug, search, sort, page],
  );

  const { data, loading, error } = useProducts(params);

  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  function handlePageChange(newPage) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Container>
      <Breadcrumbs items={[{ label: "المتجر" }]} />

      <header className={styles.header}>
        <h1 className={styles.title}>كل المنتجات</h1>
        <p className={styles.subtitle}>
          تصفح مجموعتنا الكاملة من مستلزمات الزراعة المنزلية.
        </p>
      </header>

      <ProductFilters
        sort={sort}
        onSortChange={handleSortChange}
        resultCount={data?.total ?? 0}
        loading={loading}
      />

      {error && (
        <div className={styles.error}>
          ⚠️ حدث خطأ أثناء تحميل المنتجات. حاول مرة أخرى.
        </div>
      )}

      {!loading && !error && data?.items.length === 0 && (
        <EmptyState
          icon="🔍"
          title="لا توجد منتجات"
          message="لم نجد أي منتج يطابق بحثك. جرّب كلمات أخرى."
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
          onChange={handlePageChange}
        />
      )}
    </Container>
  );
}
