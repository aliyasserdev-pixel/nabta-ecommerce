import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import { Truck, Leaf, MessageCircle, ShieldCheck } from "lucide-react";
import styles from "./WhyNabta.module.css";

// مميزات المتجر - أيقونات Lucide
const FEATURES = [
  {
    Icon: Truck,
    title: "توصيل سريع",
    text: "نوصل طلبك لباب منزلك في أسرع وقت.",
  },
  {
    Icon: Leaf,
    title: "منتجات طبيعية",
    text: "بذور وشتول مختارة بعناية من مصادر موثوقة.",
  },
  {
    Icon: MessageCircle,
    title: "دعم زراعي",
    text: "نصائح وإرشادات مجانية من فريق مختص.",
  },
  {
    Icon: ShieldCheck,
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
              <div className={styles.iconWrap} aria-hidden="true">
                <feature.Icon size={28} strokeWidth={2} />
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
