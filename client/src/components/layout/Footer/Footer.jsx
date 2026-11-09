import { Link } from "react-router-dom";
import Container from "../../common/Container";
import { ar } from "../../../locales/ar";
import styles from "./Footer.module.css";
import { MapPin, Phone, Mail, Share2 } from "lucide-react";

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
  {
    href: "https://www.facebook.com/profile.php?id=61595074895012",
    label: "فيسبوك",
    Icon: Share2,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.col}>
            <Link to="/" className={styles.footerLogoWrap}>
              <img src="/logo.png" alt="نبتة" className={styles.footerLogo} />
            </Link>
            <p className={styles.about}>{ar.footer.aboutText}</p>
          </div>

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

          <div className={styles.col}>
            <h3 className={styles.title}>{ar.footer.contactTitle}</h3>
            <ul className={styles.list}>
              <li className={styles.contactItem}>
                <div className={styles.contactRow}>
                  <MapPin size={16} className={styles.contactIcon} />
                  <span>السودان — الخرطوم</span>
                </div>
              </li>
              <li className={styles.contactItem}>
                <div className={styles.contactRow}>
                  <Phone size={16} className={styles.contactIcon} />
                  <span dir="ltr">+249 128 742 152</span>
                </div>
              </li>
              <li className={styles.contactItem}>
                <div className={styles.contactRow}>
                  <Mail size={16} className={styles.contactIcon} />
                  <span dir="ltr">nabta.store.sd1@gmail.com</span>
                </div>
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
                  <social.Icon size={16} />
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
