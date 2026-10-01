import { Link } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>🌱 الزراعة المنزلية صارت أسهل</span>

          <h1 className={styles.title}>
            كل ما تحتاجه لـ
            <span className={styles.highlight}> زراعة منزلية </span>
            ناجحة
          </h1>

          <p className={styles.subtitle}>
            شتول، بذور، تربة، أسمدة، وأدوات — نوصلها لبابك. ابدأ حديقتك المنزلية
            اليوم ولو كانت مساحتك صغيرة.
          </p>

          <div className={styles.actions}>
            <Link to="/products">
              <Button size="lg">ابدأ التسوق</Button>
            </Link>
            <Link to="/categories">
              <Button size="lg" variant="outline">
                تصفح التصنيفات
              </Button>
            </Link>
          </div>

          <ul className={styles.features}>
            <li>✅ توصيل سريع</li>
            <li>✅ منتجات طبيعية</li>
            <li>✅ دعم زراعي</li>
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.plantCard}>
            <span className={styles.plantEmoji}>🌿</span>
          </div>
          <div className={`${styles.plantCard} ${styles.card2}`}>
            <span className={styles.plantEmoji}>🌱</span>
          </div>
          <div className={`${styles.plantCard} ${styles.card3}`}>
            <span className={styles.plantEmoji}>🪴</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
