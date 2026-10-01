import { Link } from "react-router-dom";
import Container from "../../common/Container";
import Logo from "../../common/Logo";
import { ar } from "../../../locales/ar";
import styles from "./Footer.module.css";

// روابط الفوتر (سنوسّعها لاحقًا مع الصفحات الجديدة)
const SHOP_LINKS = [
  { to: "/products", label: "كل المنتجات" },
  { to: "/categories/seeds", label: "بذور" },
  { to: "/categories/seedlings", label: "شتول" },
  { to: "/categories/soil", label: "تربة" },
  { to: "/categories/fertilizers", label: "أسمدة" },
];

const IMPORTANT_LINKS = [
  { to: "/about", label: "عن نَبْتة" },
  { to: "/contact", label: "اتصل بنا" },
  { to: "/shipping", label: "سياسة الشحن" },
  { to: "/returns", label: "سياسة الاسترجاع" },
  { to: "/privacy", label: "سياسة الخصوصية" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "فيسبوك" },
  { href: "https://instagram.com", label: "إنستغرام" },
  { href: "https://twitter.com", label: "تويتر" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          {/* العمود 1: عن المتجر */}
          <div className={styles.col}>
            <Logo variant="light" />
            <p className={styles.about}>{ar.footer.aboutText}</p>
          </div>

          {/* العمود 2: المتجر */}
          <div className={styles.col}>
            <h3 className={styles.title}>{ar.footer.shopTitle}</h3>
            <ul className={styles.list}>
              {SHOP_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 3: روابط مهمة */}
          <div className={styles.col}>
            <h3 className={styles.title}>{ar.footer.importantTitle}</h3>
            <ul className={styles.list}>
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 4: التواصل */}
          <div className={styles.col}>
            <h3 className={styles.title}>{ar.footer.contactTitle}</h3>
            <ul className={styles.list}>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>العنوان:</span>
                <span>السودان — الخرطوم</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>الهاتف:</span>
                <span dir="ltr">+249 000 000 000</span>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>البريد:</span>
                <span dir="ltr">info@nabta.com</span>
              </li>
            </ul>

            <div className={styles.social}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} نَبْتة. جميع الحقوق محفوظة.</p>
        </div>
      </Container>
    </footer>
  );
}
