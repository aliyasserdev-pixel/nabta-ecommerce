import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import styles from "./WhyNabta.module.css";

// مميزات المتجر — نصوص ثابتة
const FEATURES = [
  {
    icon: "🚚",
    title: "توصيل سريع",
    text: "نوصل طلبك لباب منزلك في أسرع وقت.",
  },
  {
    icon: "🌿",
    title: "منتجات طبيعية",
    text: "بذور وشتول مختارة بعناية من مصادر موثوقة.",
  },
  {
    icon: "💬",
    title: "دعم زراعي",
    text: "نصائح وإرشادات مجانية من فريق مختص.",
  },
  {
    icon: "🔒",
    title: "دفع آمن",
    text: "خيارات دفع موثوقة ومتنوعة تناسبك.",
  },
];

export default function WhyNabta() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="لماذا نَبْتة؟"
          subtitle="نهتم بأدق التفاصيل لتنمو حديقتك بثقة"
        />

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <div className={styles.icon} aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.text}>{feature.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
