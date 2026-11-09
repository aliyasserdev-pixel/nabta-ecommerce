import { Link } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";
import { Sprout } from "lucide-react";
import styles from "./HomeGardenBanner.module.css";

export default function HomeGardenBanner() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.banner}>
          <div className={styles.content}>
            <span className={styles.tag}>
              <Sprout size={16} strokeWidth={2.5} />
              الزراعة المنزلية
            </span>
            <h2 className={styles.title}>
              ابدأ حديقتك المنزلية حتى في مساحة صغيرة
            </h2>
            <p className={styles.text}>
              لا تحتاج إلى حديقة كبيرة — شرفة أو نافذة مشمسة تكفي. نمنحك كل
              الأدوات والنصائح للبدء بثقة.
            </p>
            <Link to="/home-garden">
              <Button size="lg" variant="secondary">
                تعرّف على الزراعة المنزلية
              </Button>
            </Link>
          </div>

          {/* هنا وضعنا صورة الأصيص الحقيقية بدلاً من الإيموجي */}
          <div className={styles.visual} aria-hidden="true">
            <Sprout
              size={160}
              strokeWidth={1}
              className={styles.bannerImage}
              style={{ color: "var(--color-primary-dark)" }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
