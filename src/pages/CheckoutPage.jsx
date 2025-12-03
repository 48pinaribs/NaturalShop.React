import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { 
  FiCheckCircle, 
  FiUser, 
  FiPhone, 
  FiHome, 
  FiTruck, 
  FiCreditCard 
} from "react-icons/fi";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Confetti celebration - subtle organic colors
    const colors = ['#4A7C59', '#6FAF7A', '#D9B382', '#FFFFFF', '#FAF7F2'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      gravity: 0.8,
      decay: 0.94,
      ticks: 150,
    });

    toast.success("Siparişiniz başarıyla alındı! 🎉");
    clearCart();

    // Navigate to success page after 1.5s
    setTimeout(() => {
      navigate("/order-success");
    }, 1500);
  };

  if (!cartItems.length) {
    return <h2 className="empty-checkout">Sepetiniz boş 🛒</h2>;
  }

  return (
    <main className="checkout-container">
      <h1 className="checkout-title">
        <FiCheckCircle className="checkout-title-icon" />
        Sipariş Tamamlama
      </h1>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <section className="checkout-main">
          <div className="checkout-box">
            <h2 className="checkout-section-title">Teslimat Bilgileri</h2>

            <label className="checkout-label">
              <FiUser className="checkout-label-icon" />
              <span className="checkout-label-text">Ad Soyad</span>
              <input type="text" className="checkout-input" required />
            </label>
            <label className="checkout-label">
              <FiPhone className="checkout-label-icon" />
              <span className="checkout-label-text">Telefon</span>
              <input type="text" className="checkout-input" required />
            </label>
            <label className="checkout-label">
              <FiHome className="checkout-label-icon" />
              <span className="checkout-label-text">Adres</span>
              <textarea rows="3" className="checkout-input checkout-textarea" required></textarea>
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

          <button type="submit" className="checkout-btn">
            <FiCheckCircle className="checkout-btn-icon" />
            Siparişi Onayla
          </button>
        </section>

        <aside className="checkout-summary">
          <h3 className="checkout-summary-title">Sipariş Özeti</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} className="summary-item-image" />
                <div className="summary-item-info">
                  <p className="summary-item-title">{item.title}</p>
                  <small className="summary-item-details">
                    {item.quantity} x {item.price} TL
                  </small>
                </div>
              </div>
            ))}
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
