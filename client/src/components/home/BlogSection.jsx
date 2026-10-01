import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import { blogPosts } from "../../data/blogPosts";
import styles from "./BlogSection.module.css";

export default function BlogSection() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="نصائح ومقالات"
          subtitle="تعلّم أسرار الزراعة المنزلية من مقالات مختصرة"
        />

        <div className={styles.grid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.card}>
              <Link to={`/blog/${post.slug}`} className={styles.imageWrap}>
                <span className={styles.imageEmoji} aria-hidden="true">
                  📖
                </span>
              </Link>
              <div className={styles.body}>
                <h3 className={styles.title}>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <span className={styles.meta}>⏱ {post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
