import styles from "./Pagination.module.css";

export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className={styles.nav} aria-label="ترقيم الصفحات">
      <button
        className={styles.btn}
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.btn} ${page === currentPage ? styles.active : ""}`}
          onClick={() => onChange(page)}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
      >
        ›
      </button>
    </nav>
  );
}
