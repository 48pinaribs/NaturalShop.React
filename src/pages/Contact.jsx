import React from "react";
import JourneySlider from "../components/JourneySlider";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./Contact.css";

// Not: SupportContactWidget.jsx'te kullanılan gerçek WhatsApp/telefon numarasıyla
// tutarlı tutuldu (Footer'daki eski tel: linki farklı/hatalı bir numaraya gidiyordu,
// bkz. Footer.jsx düzeltmesi).
const phoneNumber = "905439434472";
const displayPhone = "+90 (543) 943 44 72";

const Contact = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Merhaba, Köyümüzden Sofranıza sitenizden yazıyorum."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="app-container">
      <JourneySlider />

      <div className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-content">
            <h1 className="contact-title">İletişim</h1>
            <p className="contact-subtitle">
              Sorularınız için bize ulaşabilirsiniz, size yardımcı olmaktan
              mutluluk duyarız
            </p>
          </div>
        </section>

        <section className="contact-cards">
          <div className="contact-card">
            <div className="contact-card-icon">
              <FiMapPin />
            </div>
            <h3 className="contact-card-title">Adres</h3>
            <p className="contact-card-text">
              Muğla, Dalaman, Gürleyk Köyü
            </p>
          </div>

          <button
            className="contact-card contact-card-clickable"
            onClick={handleWhatsAppClick}
            type="button"
          >
            <div className="contact-card-icon">
              <FaWhatsapp />
            </div>
            <h3 className="contact-card-title">WhatsApp</h3>
            <p className="contact-card-text">{displayPhone}</p>
          </button>

          <a
            href={`tel:+${phoneNumber}`}
            className="contact-card contact-card-clickable"
          >
            <div className="contact-card-icon">
              <FiPhone />
            </div>
            <h3 className="contact-card-title">Telefon</h3>
            <p className="contact-card-text">{displayPhone}</p>
          </a>

          <a
            href="mailto:info@gurleyktensofraniza.com"
            className="contact-card contact-card-clickable"
          >
            <div className="contact-card-icon">
              <FiMail />
            </div>
            <h3 className="contact-card-title">E-posta</h3>
            <p className="contact-card-text">info@gurleyktensofraniza.com</p>
          </a>
        </section>

        <section className="contact-hours">
          <div className="contact-hours-icon">
            <FiClock />
          </div>
          <div>
            <h3 className="contact-card-title">Çalışma Saatleri</h3>
            <p className="contact-card-text">
              Her gün 09:00 - 20:00 arası WhatsApp ve telefon üzerinden
              bize ulaşabilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
