import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import logo2Png from "../assets/logo2.png";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Lütfen geçerli bir e-posta adresi giriniz");
      return;
    }

    // NOT: Bülten kaydını saklayacak bir backend endpoint'i henüz yok.
    // Kullanıcıyı yanıltmamak için sahte bir "kaydoldunuz" mesajı göstermek yerine
    // özelliğin henüz aktif olmadığını açıkça belirtiyoruz.
    toast.info("Bülten kaydı yakında aktif olacak. İlginiz için teşekkürler! 🌿");
    setEmail("");
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: FiInstagram,
      url: "https://instagram.com/gurleyktensofraniza",
      ariaLabel: "Instagram'da bizi takip edin",
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      url: "https://facebook.com/gurleyktensofraniza",
      ariaLabel: "Facebook'ta bizi takip edin",
    },
    {
      name: "YouTube",
      icon: FiYoutube,
      url: "https://youtube.com/@gurleyktensofraniza",
      ariaLabel: "YouTube'da bizi takip edin",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: "https://wa.me/905551234567",
      ariaLabel: "WhatsApp ile iletişime geçin",
    },
  ];

  const quickLinks = [
    { label: "Hakkımızda", path: "/about" },
    { label: "İletişim", path: "/contact" },
  ];

  const categories = [{ label: "Tüm Ürünler", path: "/", icon: "🌿" }];

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Column 1: Brand & Newsletter */}
          <div className="footer-column">
            <div className="footer-section">
              <div className="footer-brand">
                <img
                  src={logo2Png}
                  alt="Köyümüzden Sofranıza - Doğal Köy Ürünleri"
                  className="footer-logo"
                />
              </div>
              <p className="footer-description">
                Dalaman Gürleyk köyünden sofranıza, doğal üretim ile organik
                yaşam
              </p>
              <div className="footer-social">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label={social.ariaLabel}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-section footer-newsletter">
              <h3 className="footer-section-title">Bülten</h3>
              <p className="footer-newsletter-text">
                Kampanyalar ve özel indirimlerden haberdar olun
              </p>
              <form
                className="newsletter-form"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="E-posta adresi"
                />
                <button
                  type="submit"
                  className="newsletter-button"
                  aria-label="Bültene kayıt ol"
                >
                  <FiArrowRight className="newsletter-icon" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <button
              className="footer-section-title footer-section-toggle"
              onClick={() => toggleSection("quickLinks")}
              aria-expanded={expandedSections.quickLinks}
              aria-controls="quickLinks-content"
            >
              Hızlı Linkler
              <span className="toggle-icon">
                {expandedSections.quickLinks ? "−" : "+"}
              </span>
            </button>
            <nav
              className={`footer-links ${
                expandedSections.quickLinks ? "expanded" : ""
              }`}
              id="quickLinks-content"
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="footer-link"
                  onClick={() => setExpandedSections({})}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-column">
            <button
              className="footer-section-title footer-section-toggle"
              onClick={() => toggleSection("categories")}
              aria-expanded={expandedSections.categories}
              aria-controls="categories-content"
            >
              Kategoriler
              <span className="toggle-icon">
                {expandedSections.categories ? "−" : "+"}
              </span>
            </button>
            <nav
              className={`footer-links ${
                expandedSections.categories ? "expanded" : ""
              }`}
              id="categories-content"
            >
              {categories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className="footer-link"
                  onClick={() => {
                    if (window.innerWidth <= 968) {
                      setExpandedSections({});
                    }
                  }}
                >
                  {category.icon && (
                    <span className="footer-link-icon">{category.icon}</span>
                  )}
                  {category.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column">
            <button
              className="footer-section-title footer-section-toggle"
              onClick={() => toggleSection("contact")}
              aria-expanded={expandedSections.contact}
              aria-controls="contact-content"
            >
              İletişim
              <span className="toggle-icon">
                {expandedSections.contact ? "−" : "+"}
              </span>
            </button>
            <div
              className={`footer-contact ${
                expandedSections.contact ? "expanded" : ""
              }`}
              id="contact-content"
            >
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-item"
              >
                <FiMapPin className="contact-icon" />
                <span>Muğla, Dalaman</span>
              </a>
              <a href="tel:+905439434472" className="footer-contact-item">
                <FiPhone className="contact-icon" />
                <span>+90 (543) 943 44 72</span>
              </a>
              <a
                href="mailto:info@gurleyktensofraniza.com"
                className="footer-contact-item"
              >
                <FiMail className="contact-icon" />
                <span>info@gurleyktensofraniza.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Köyümüzden Sofranıza — Tüm Hakları Saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
