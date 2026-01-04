import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../config/api.js";
import { useCart } from "../context/CartContext";
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiAlertCircle,
  FiHome,
  FiRefreshCw,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
import "./PaymentResultPage.css";

export default function PaymentResultPage() {
  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("orderId");
    const statusParam = params.get("status");

    setOrderId(id);

    if (statusParam === "error") {
      setStatus("error");
      return;
    }

    if (!id) {
      setStatus("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("error");
      return;
    }

    // Sipariş detaylarını getir
    axios
      .get(apiConfig.endpoints.orders.get(id), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setOrder(res.data);
        const orderStatus = res.data.Status || res.data.status || "error";
        setStatus(orderStatus);
        
        // Eğer ödeme başarılıysa (Paid) sepeti temizle
        if (orderStatus === "Paid" || orderStatus === "paid") {
          clearCart();
        }
      })
      .catch(() => setStatus("error"));
  }, [clearCart]);

  const handleRetry = () => {
    navigate("/checkout");
  };

  // Loading State
  if (status === "loading") {
    return (
      <main className="payment-result-container">
        <div className="payment-result-card loading-state">
          <div className="payment-result-loading">
            <div className="loading-animation-wrapper">
              <div className="leaf-animation">
                <span className="leaf-icon leaf-1">🍃</span>
                <span className="leaf-icon leaf-2">🌿</span>
                <span className="leaf-icon leaf-3">🍃</span>
              </div>
              <div className="loading-spinner"></div>
            </div>
            <h2 className="payment-result-title">Ödeme Sonucu Kontrol Ediliyor</h2>
            <p className="payment-result-message">
              Lütfen bekleyin, sipariş durumunuz kontrol ediliyor...
            </p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Success State (Paid)
  if (status === "Paid") {
    return (
      <main className="payment-result-container">
        <div className="payment-result-card success">
          <div className="payment-result-icon-wrapper">
            <div className="success-icon-container">
              <FiCheckCircle className="payment-result-icon success-icon" />
            </div>
          </div>
          
          <h1 className="payment-result-title">Ödemeniz Başarıyla Alındı!</h1>
          
          {orderId && (
            <div className="payment-result-order-number">
              <span className="order-number-label">Sipariş Numaranız</span>
              <span className="order-number-value">#{orderId}</span>
            </div>
          )}

          <div className="payment-result-delivery-info">
            <FiTruck className="delivery-icon" />
            <p className="delivery-text">
              Siparişiniz hazırlanıyor ve 1-3 iş günü içinde kargoya verilecektir.
              Sipariş durumunuzu takip edebilirsiniz.
            </p>
          </div>

          {order && order.Items && order.Items.length > 0 && (
            <div className="payment-result-order-summary">
              <h3 className="order-summary-title">
                <FiPackage className="summary-icon" />
                Sipariş Özeti
              </h3>
              
              <div className="order-items-list">
                {order.Items.map((item) => (
                  <div key={item.Id || item.id} className="order-item-card">
                    <div className="order-item-info">
                      <span className="order-item-name">{item.ProductName || item.productName}</span>
                      <span className="order-item-quantity">
                        Adet: {item.Quantity || item.quantity}
                      </span>
                    </div>
                    <span className="order-item-price">
                      {((item.UnitPrice || item.unitPrice) * (item.Quantity || item.quantity)).toFixed(2)} TL
                    </span>
                  </div>
                ))}
              </div>

              {order.TotalAmount && (
                <div className="order-total-section">
                  <span className="order-total-label">Toplam Tutar</span>
                  <span className="order-total-amount">
                    {Number(order.TotalAmount || order.totalAmount).toFixed(2)} TL
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="payment-result-actions">
            <Link to="/" className="premium-btn premium-btn-primary">
              <span className="premium-btn-content">
                <FiHome className="premium-btn-icon" />
                <span className="premium-btn-text">Ana Sayfaya Dön</span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Failed State
  if (status === "Failed") {
    return (
      <main className="payment-result-container">
        <div className="payment-result-card error">
          <div className="payment-result-icon-wrapper">
            <FiXCircle className="payment-result-icon error-icon" />
          </div>
          
          <h1 className="payment-result-title">Ödeme Başarısız</h1>
          <p className="payment-result-message">
            Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi seçin.
          </p>

          {orderId && (
            <div className="payment-result-order-info">
              <span className="order-info-label">Sipariş No:</span>
              <span className="order-info-value">#{orderId}</span>
            </div>
          )}

          <div className="payment-result-actions">
            <button 
              onClick={handleRetry}
              className="premium-btn premium-btn-primary"
            >
              <span className="premium-btn-content">
                <FiRefreshCw className="premium-btn-icon" />
                <span className="premium-btn-text">Tekrar Dene</span>
              </span>
            </button>
            <Link to="/" className="premium-btn premium-btn-secondary">
              <span className="premium-btn-content">
                <FiHome className="premium-btn-icon" />
                <span className="premium-btn-text">Ana Sayfaya Dön</span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Pending State
  if (status === "Pending" || status === "Hazırlanıyor") {
    return (
      <main className="payment-result-container">
        <div className="payment-result-card pending">
          <div className="payment-result-icon-wrapper">
            <FiClock className="payment-result-icon pending-icon" />
          </div>
          
          <h1 className="payment-result-title">Ödeme Bekleniyor</h1>
          <p className="payment-result-message">
            Siparişiniz oluşturuldu ancak ödeme henüz tamamlanmadı. 
            Lütfen ödeme işlemini tamamlayın.
          </p>

          {orderId && (
            <div className="payment-result-order-info">
              <span className="order-info-label">Sipariş No:</span>
              <span className="order-info-value">#{orderId}</span>
            </div>
          )}

          <div className="payment-result-actions">
            <Link to="/checkout" className="premium-btn premium-btn-primary">
              <span className="premium-btn-content">
                <FiRefreshCw className="premium-btn-icon" />
                <span className="premium-btn-text">Ödemeye Dön</span>
              </span>
            </Link>
            <Link to="/" className="premium-btn premium-btn-secondary">
              <span className="premium-btn-content">
                <FiHome className="premium-btn-icon" />
                <span className="premium-btn-text">Ana Sayfaya Dön</span>
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Error State
  return (
    <main className="payment-result-container">
      <div className="payment-result-card error">
        <div className="payment-result-icon-wrapper">
          <FiAlertCircle className="payment-result-icon error-icon" />
        </div>
        
        <h1 className="payment-result-title">Bir Hata Oluştu</h1>
        <p className="payment-result-message">
          Sipariş durumunuz kontrol edilirken bir sorun oluştu. 
          Lütfen daha sonra tekrar deneyin veya müşteri hizmetlerimizle iletişime geçin.
        </p>

        <div className="payment-result-actions">
          <button 
            onClick={() => window.location.reload()}
            className="premium-btn premium-btn-primary"
          >
            <span className="premium-btn-content">
              <FiRefreshCw className="premium-btn-icon" />
              <span className="premium-btn-text">Yenile</span>
            </span>
          </button>
          <Link to="/" className="premium-btn premium-btn-secondary">
            <span className="premium-btn-content">
              <FiHome className="premium-btn-icon" />
              <span className="premium-btn-text">Ana Sayfaya Dön</span>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
