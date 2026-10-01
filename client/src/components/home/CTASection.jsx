import { Link } from "react-router-dom";
import Container from "../common/Container";
import Button from "../common/Button";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.box}>
          <h2 className={styles.title}>جاهز لتبدأ حديقتك؟</h2>
          <p className={styles.text}>
            كل ما تحتاجه من بذور وشتول ومستلزمات — في مكان واحد.
          </p>
          <div className={styles.actions}>
            <Link to="/products">
              <Button size="lg">تسوق الآن</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="light">
                أنشئ حسابك
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
