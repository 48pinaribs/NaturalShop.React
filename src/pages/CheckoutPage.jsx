import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
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
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Teslimat bilgileri - checkout formundan toplanır ve siparişle birlikte backend'e gönderilir
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Ödeme yöntemi: "cod" (Kapıda Ödeme) veya "card" (Iyzico ile online kart ödemesi - şu an sandbox/test modunda)
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kullanıcı giriş yapmış mı kontrol et
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Ödeme yapmak için lütfen giriş yapın");
      navigate("/email-login");
      return;
    }

    // Sepet boş mu kontrol et
    if (!cartItems || cartItems.length === 0) {
      toast.error("Sepetiniz boş");
      navigate("/cart");
      return;
    }

    // Teslimat bilgilerini doğrula
    const errors = {};
    if (!recipientName.trim()) errors.recipientName = "Ad soyad gereklidir";
    if (!recipientPhone.trim()) errors.recipientPhone = "Telefon numarası gereklidir";
    if (!shippingAddress.trim()) errors.shippingAddress = "Adres gereklidir";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error("Lütfen teslimat bilgilerinizi eksiksiz doldurun");
      return;
    }
    setFieldErrors({});

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
      }),
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      shippingAddress: shippingAddress.trim(),
    };

    try {
      if (paymentMethod === "card") {
        // Kredi Kartı: Iyzico Checkout Form'unu başlat, dönen ödeme sayfasına yönlendir.
        // Sipariş "Pending" olarak oluşturulur, ödeme Iyzico'da tamamlanınca callback
        // sipariş durumunu "Paid" yapar (bkz. PaymentsController).
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

        if (response.data && response.data.paymentPageUrl) {
          window.location.href = response.data.paymentPageUrl;
        } else {
          throw new Error("Ödeme başlatılamadı");
        }
        return;
      }

      // Kapıda Ödeme: online ödeme adımı yok, sipariş doğrudan oluşturulup onaylanır
      const response = await axios.post(
        apiConfig.endpoints.orders.create,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data && response.data.orderId) {
        navigate("/order-success");
      } else {
        throw new Error("Sipariş oluşturulamadı");
      }
    } catch (error) {
      let errorMessage = "Sipariş oluşturulamadı. Lütfen tekrar deneyin.";

      if (error.response) {
        const responseData = error.response.data;

        if (responseData?.errors && Array.isArray(responseData.errors)) {
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
          navigate("/email-login");
          return;
        }
      } else if (error.request) {
        errorMessage = "Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
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
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                style={fieldErrors.recipientName ? { borderColor: "#d32f2f" } : undefined}
                required
              />
              {fieldErrors.recipientName && (
                <span style={{ color: "#d32f2f", fontSize: "0.85rem" }}>{fieldErrors.recipientName}</span>
              )}
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
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                style={fieldErrors.recipientPhone ? { borderColor: "#d32f2f" } : undefined}
                required
              />
              {fieldErrors.recipientPhone && (
                <span style={{ color: "#d32f2f", fontSize: "0.85rem" }}>{fieldErrors.recipientPhone}</span>
              )}
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
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={fieldErrors.shippingAddress ? { borderColor: "#d32f2f" } : undefined}
                required
              ></textarea>
              {fieldErrors.shippingAddress && (
                <span style={{ color: "#d32f2f", fontSize: "0.85rem" }}>{fieldErrors.shippingAddress}</span>
              )}
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
              <label className="radio-card radio-card-disabled">
                <input type="radio" name="kargo" disabled />
                <div className="radio-card-content">
                  <span className="radio-card-title">Hızlı Teslimat</span>
                  <span className="radio-card-subtitle">Yakında</span>
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
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="radio-card-content">
                  <span className="radio-card-title">Kapıda Ödeme</span>
                  <span className="radio-card-subtitle">Nakit veya Kredi Kartı</span>
                </div>
              </label>
              <label className="radio-card">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <div className="radio-card-content">
                  <span className="radio-card-title">Kredi Kartı (Online)</span>
                  <span className="radio-card-subtitle">Iyzico ile güvenli ödeme</span>
                </div>
              </label>
            </div>
            {paymentMethod === "card" && (
              <p className="checkout-payment-note">
                🧪 Test modu: bu ödeme sistemi henüz sandbox modunda çalışıyor, gerçek para çekilmez.
              </p>
            )}
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
              ) : paymentMethod === "card" ? (
                <>
                  <FiCreditCard className="premium-btn-icon" />
                  <span className="premium-btn-text">Ödemeye Geç (Kredi Kartı)</span>
                </>
              ) : (
                <>
                  <span className="premium-btn-icon">📦</span>
                  <span className="premium-btn-text">Siparişi Onayla (Kapıda Ödeme)</span>
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
