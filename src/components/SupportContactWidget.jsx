import { useState, useEffect, useRef,useCallback} from "react";
import { FiX, FiPhone, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./SupportContactWidget.css";


const messages = [
  "Merak ettiklerin mi var? 🌿",
  "Ürünlerimiz hakkında soru sorabilirsin",
  "Size nasıl yardımcı olabiliriz?",
  "Zeytinyağı, bal, pekmez veya diğer doğal ürünlerimiz hakkında bilgi almak ister misin?",
  "Dalaman'dan sofralarınıza gelen doğal ürünlerimiz hakkında merak ettiklerin mi var?",
  "Size yardımcı olmaktan mutluluk duyarız",
  "Ürünlerimizle ilgili soruların mı var?",
  "Köy yumurtası, peynir, kuru meyve veya şifalı bitkiler hakkında soru sorabilirsin",
  "Geleneksel yöntemlerle üretilen ürünlerimiz hakkında bilgi almak ister misin?",
  "Doğal ve organik ürünlerimiz için bize ulaşabilirsin"
];


function SupportContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const autoCloseTimerRef = useRef(null);
  const intervalTimerRef = useRef(null);

  // TODO: Buraya gerçek WhatsApp numaranızı girin (format: 905XXXXXXXXX)
  // Örnek: 905551234567
  const whatsappNumber = "905439434472";

  // TODO: Buraya gerçek telefon numaranızı girin (format: 905XXXXXXXXX)
  // Örnek: 905551234567
  const phoneNumber = "905439434472";

  const autoOpenPanel = useCallback(() => {
    // Eğer zaten açıksa açma
    if (isOpen) return;
    
    // Rastgele bir mesaj seç
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setIsOpen(true);
    
    // 8 saniye sonra otomatik kapat
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    autoCloseTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 8000);
  }, [isOpen]);

  // Periyodik olarak açılma (daha sık - 25-40 saniye aralıklarla)
  useEffect(() => {
    // İlk açılış: 10-15 saniye sonra
    const initialDelay = 10000 + Math.random() * 5000;
    
    const initialTimer = setTimeout(() => {
      autoOpenPanel();
      
      // Sonraki açılışlar için interval başlat (25-40 saniye)
      const scheduleNext = () => {
        const nextDelay = 25000 + Math.random() * 15000; // 25-40 saniye arası
        intervalTimerRef.current = setTimeout(() => {
          autoOpenPanel();
          scheduleNext(); // Bir sonraki açılışı planla
        }, nextDelay);
      };
      
      scheduleNext();
    }, initialDelay);

    return () => {
      clearTimeout(initialTimer);
      if (intervalTimerRef.current) {
        clearTimeout(intervalTimerRef.current);
      }
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenPanel]);

  // Scroll bazlı açılma - kullanıcı sayfada gezinirken
  useEffect(() => {
    let lastScrollTime = 0;
    let scrollTimeout = null;

    const handleScroll = () => {
      const now = Date.now();
      
      // Scroll olduğunda ve widget kapalıysa
      if (!isOpen && now - lastScrollTime > 15000) { // Son açılıştan 15 saniye geçmişse
        lastScrollTime = now;
        
        // Scroll durduktan 3-5 saniye sonra aç
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
          // %30 ihtimalle aç (çok sık açılmasın)
          if (Math.random() < 0.3) {
            autoOpenPanel();
          }
        }, 3000 + Math.random() * 2000);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    
    // Otomatik kapanma timer'ını temizle
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Merhaba, Köyümüzden Sofranıza sitenizden yazıyorum. Doğal ürünleriniz hakkında bilgi almak istiyorum."
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:+${phoneNumber}`;
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`support-widget-button ${isOpen ? "active" : ""}`}
        onClick={togglePanel}
        aria-label="Destek iletişim"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <FiX className="widget-icon" />
        ) : (
          <FiMessageCircle className="widget-icon" />
        )}
      </button>

      {/* Minimal Chat Panel */}
      {isOpen && (
        <div className="support-widget-panel">
          {/* Close Button */}
          <button
            className="support-widget-close"
            onClick={togglePanel}
            aria-label="Paneli kapat"
          >
            <FiX className="close-icon" />
          </button>

          {/* Minimal Content */}
          <div className="support-widget-content">
            <p className="support-widget-message">
              {message || "Merak ettiklerin mi var? 🌿"}
            </p>
            <div className="support-buttons-wrapper">
              <button
                className="support-btn-minimal whatsapp-btn"
                onClick={handleWhatsAppClick}
              >
                <FaWhatsapp className="btn-icon-minimal" />
                <span>Yaz</span>
              </button>
              <button
                className="support-btn-minimal phone-btn"
                onClick={handlePhoneClick}
              >
                <FiPhone className="btn-icon-minimal" />
                <span>Ara</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SupportContactWidget;

