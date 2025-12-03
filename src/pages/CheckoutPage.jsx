import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { 
  FiCheckCircle, 
  FiUser, 
  FiPhone, 
  FiHome, 
  FiTruck, 
  FiCreditCard,
  FiLoader
} from "react-icons/fi";
import "./CheckoutPage.css";
import apiConfig from "../config/api.js";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kullanıcı giriş yapmış mı kontrol et
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Ödeme yapmak için lütfen giriş yapın");
      navigate("/phone-login");
      return;
    }

    // Sepet boş mu kontrol et
    if (!cartItems || cartItems.length === 0) {
      toast.error("Sepetiniz boş");
      navigate("/cart");
      return;
    }
    //
    setIsProcessing(true);

    // Backend'e gönderilecek DTO formatına çevir
    const orderData = {
      items: cartItems.map(item => {
        const productId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
        if (isNaN(productId)) {
          throw new Error(`Geçersiz ürün ID: ${item.id}`);
        }
        return {
          productId: productId,
          quantity: item.quantity
        };
      })
    };

    console.log("Ödeme başlatılıyor...", { orderData, token: token ? "Token mevcut" : "Token yok" });
    console.log("Gönderilen JSON:", JSON.stringify(orderData, null, 2));
    console.log("Cart items:", cartItems);

    try {

      // Iyzico ödeme başlatma endpoint'ine istek gönder
      const response = await axios.post(
        apiConfig.endpoints.payments.start,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("API yanıtı:", response.data);

      // Başarılı yanıt alındıysa Iyzico ödeme sayfasına yönlendir
      if (response.data && response.data.paymentPageUrl) {
        // Sepeti temizle (ödeme başarılı olursa callback'te zaten temizlenecek)
        // clearCart(); // Şimdilik yorum satırı - callback'te temizlenecek
        
        // Iyzico ödeme sayfasına yönlendir
        window.location.href = response.data.paymentPageUrl;
      } else {
        throw new Error("Ödeme sayfası URL'i alınamadı");
      }
    } catch (error) {
      console.error("Ödeme başlatma hatası:", error);
      console.error("Tam hata response:", JSON.stringify(error.response?.data, null, 2));
      console.error("Gönderilen orderData:", JSON.stringify(orderData, null, 2));
      console.error("Hata detayları:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config?.url
      });
      
      let errorMessage = "Ödeme başlatılamadı. Lütfen tekrar deneyin.";
      
      if (error.response) {
        // Backend'den gelen hata mesajı
        const responseData = error.response.data;
        
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          // ModelState hataları varsa göster
          const errorDetails = responseData.errors.map(e => `${e.field || 'Bilinmeyen alan'}: ${e.error || e.Error || ''}`).join(', ');
          errorMessage = `Geçersiz veri: ${errorDetails}`;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
        
        if (error.response.status === 401) {
          errorMessage = "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/phone-login");
          return;
        }
      } else if (error.request) {
        // İstek gönderildi ama yanıt alınamadı
        errorMessage = "Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.";
        console.error("Sunucuya bağlanılamadı:", error.request);
      } else {
        // İstek hazırlanırken hata oluştu
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!cartItems.length) {
    return (
      <main className="checkout-container">
        <div className="empty-checkout">
          <div className="empty-checkout-icon">🛒</div>
          <h2 className="empty-checkout-title">Sepetiniz boş</h2>
          <p className="empty-checkout-text">Sipariş vermek için önce sepetinize ürün ekleyin</p>
          <Link to="/" className="empty-checkout-button premium-btn premium-btn-primary">
            <span className="premium-btn-content">
              <span className="premium-btn-icon">🍃</span>
              <span className="premium-btn-text">Ürünleri Keşfet</span>
            </span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      <div className="checkout-header">
        <div className="checkout-header-icon">✨</div>
        <h1 className="checkout-title">Sipariş Tamamlama</h1>
        <p className="checkout-subtitle">Siparişinizi tamamlamak için bilgilerinizi girin</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <section className="checkout-main">
          <div className="checkout-box">
            <h2 className="checkout-section-title">Teslimat Bilgileri</h2>

            <label className="checkout-label">
              <div className="checkout-label-header">
                <FiUser className="checkout-label-icon" />
                <span className="checkout-label-text">Ad Soyad</span>
              </div>
              <input 
                type="text" 
                className="checkout-input" 
                placeholder="Adınız ve soyadınız"
                required 
              />
            </label>
            <label className="checkout-label">
              <div className="checkout-label-header">
                <FiPhone className="checkout-label-icon" />
                <span className="checkout-label-text">Telefon</span>
              </div>
              <input 
                type="tel" 
                className="checkout-input" 
                placeholder="05XX XXX XX XX"
                required 
              />
            </label>
            <label className="checkout-label">
              <div className="checkout-label-header">
                <FiHome className="checkout-label-icon" />
                <span className="checkout-label-text">Adres</span>
              </div>
              <textarea 
                rows="4" 
                className="checkout-input checkout-textarea" 
                placeholder="Adres bilgilerinizi giriniz"
                required
              ></textarea>
            </label>
          </div>

          <div className="checkout-box">
            <h2 className="checkout-section-title">
              <FiTruck className="checkout-section-icon" />
              Teslimat Seçeneği
            </h2>
            <div className="radio-options">
              <label className="radio-card">
                <input type="radio" name="kargo" defaultChecked />
                <div className="radio-card-content">
                  <span className="radio-card-title">Standart Kargo</span>
                  <span className="radio-card-subtitle">Ücretsiz</span>
                </div>
              </label>
              <label className="radio-card">
                <input type="radio" name="kargo" />
                <div className="radio-card-content">
                  <span className="radio-card-title">Hızlı Teslimat</span>
                  <span className="radio-card-subtitle">+39 TL</span>
                </div>
              </label>
            </div>
          </div>

          <div className="checkout-box">
            <h2 className="checkout-section-title">
              <FiCreditCard className="checkout-section-icon" />
              Ödeme Yöntemi
            </h2>
            <div className="radio-options">
              <label className="radio-card">
                <input type="radio" name="pay" defaultChecked />
                <div className="radio-card-content">
                  <span className="radio-card-title">Kapıda Ödeme</span>
                  <span className="radio-card-subtitle">Nakit veya Kredi Kartı</span>
                </div>
              </label>
              <label className="radio-card">
                <input type="radio" name="pay" />
                <div className="radio-card-content">
                  <span className="radio-card-title">Kredi Kartı</span>
                  <span className="radio-card-subtitle">Yakında</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="premium-btn premium-btn-primary"
            disabled={isProcessing}
          >
            <span className="premium-btn-content">
              {isProcessing ? (
                <>
                  <FiLoader className="premium-btn-icon spinning" />
                  <span className="premium-btn-text">İşleniyor...</span>
                </>
              ) : (
                <>
                  <span className="premium-btn-icon">💳</span>
                  <span className="premium-btn-text">Ödemeye Geç</span>
                </>
              )}
            </span>
          </button>
        </section>

        <aside className="checkout-summary">
          <h3 className="checkout-summary-title">Sipariş Özeti</h3>
          <div className="summary-items">
            {cartItems.map((item) => {
              const itemImage = item.imageUrl || item.image || "";
              const itemName = item.name || item.title || "Ürün";
              const placeholder = "data:image/svg+xml;utf8," +
                encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">No Image</text></svg>`);
              
              return (
                <div key={item.id} className="summary-item">
                  <img 
                    src={itemImage || placeholder} 
                    alt={itemName} 
                    className="summary-item-image"
                    onError={(e) => {
                      if (e.target.src !== placeholder) {
                        e.target.src = placeholder;
                      }
                    }}
                  />
                  <div className="summary-item-info">
                    <p className="summary-item-title">{itemName}</p>
                    <small className="summary-item-details">
                      {item.quantity} × {Number(item.price).toFixed(2)} TL
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="summary-total">
            <span className="summary-total-label">Toplam:</span>
            <strong className="summary-total-price">{cartTotal.toFixed(2)} TL</strong>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default CheckoutPage;
