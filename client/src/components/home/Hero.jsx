import { Link } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";
import styles from "./Hero.module.css";
import { PackageCheck, Leaf, Sprout } from "lucide-react";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <img src="/favicon.ico" alt="" className={styles.badgeIcon} />
            الزراعة المنزلية صارت أسهل
          </span>

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
            <li className={styles.featureItem}>
              <PackageCheck
                size={22}
                strokeWidth={2}
                className={styles.featureIcon}
              />
              <span>توصيل سريع</span>
            </li>
            <li className={styles.featureItem}>
              <Leaf size={22} strokeWidth={2} className={styles.featureIcon} />
              <span>منتجات طبيعية</span>
            </li>
            <li className={styles.featureItem}>
              <Sprout
                size={22}
                strokeWidth={2}
                className={styles.featureIcon}
              />
              <span>دعم زراعي</span>
            </li>
          </ul>
        </div>

        {/* التصميم الاحترافي الجديد للكروت */}
        <div className={styles.visual} aria-hidden="true">
          {/* كارت خلفي شمال */}
          <div className={`${styles.glassCard} ${styles.bgCardLeft}`}>
            <Leaf size={80} strokeWidth={1} className={styles.watermarkIcon} />
          </div>

          {/* كارت خلفي يمين */}
          <div className={`${styles.glassCard} ${styles.bgCardRight}`}>
            <Sprout
              size={80}
              strokeWidth={1}
              className={styles.watermarkIcon}
            />
          </div>

          {/* الكارت الأساسي اللي فيه الصورة (الدايرة البيضاء) */}
          <div className={styles.mainImageCard}>
            <img
              src="/icon-2.png"
              alt="نبتة منزلية"
              className={styles.heroImage}
              loading="eager"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
