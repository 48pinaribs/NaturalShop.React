import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  FiPackage, 
  FiHome, 
  FiCheckCircle, 
  FiClock, 
  FiTruck,
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";
import apiConfig from "../config/api.js";
import "./OrderDetailsPage.css";

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/email-login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(apiConfig.endpoints.orders.get(id), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/email-login");
            return;
          }
          if (res.status === 404) {
            setError("Sipariş bulunamadı");
            return;
          }
          throw new Error("Sipariş detayları yüklenemedi");
        }
        
        const data = await res.json();
        
        // Sadece onaylanmış siparişleri göster (kart ile ödenmiş veya kapıda ödeme)
        const status = (data.status || data.Status || "").toLowerCase();
        if (status !== "paid" && status !== "cashondelivery") {
          setError("Bu sipariş henüz onaylanmadı");
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Sipariş detayları yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "cashondelivery":
        return <FiCheckCircle className="status-icon status-paid" />;
      case "pending":
        return <FiClock className="status-icon status-pending" />;
      default:
        return <FiClock className="status-icon status-pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Ödendi";
      case "cashondelivery":
        return "Kapıda Ödeme Onaylandı";
      case "pending":
        return "Beklemede";
      default:
        return "Beklemede";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "Ödendi (Kredi Kartı)";
      case "cashondelivery":
        return "Teslimatta Ödenecek";
      default:
        return "Beklemede";
    }
  };

  const SHIPPING_STEPS = ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

  const getShippingStepIndex = (shippingStatus) => {
    const index = SHIPPING_STEPS.indexOf(shippingStatus);
    return index === -1 ? 0 : index;
  };

  const calculateTotal = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => {
      const quantity = item.quantity || item.Quantity || 0;
      const unitPrice = item.product?.price || item.Product?.Price || item.unitPrice || item.UnitPrice || 0;
      return sum + (unitPrice * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="order-details-loading">
            <div className="loading-spinner"></div>
            <p>Sipariş detayları yükleniyor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-details-page">
        <div className="order-details-container">
          <div className="order-details-error">
            <FiPackage className="error-icon" />
            <h2>Bir Hata Oluştu</h2>
            <p>{error}</p>
            <div className="error-actions">
              <Link to="/orders" className="order-details-btn-secondary">
                <FiArrowLeft className="btn-icon" />
                Siparişlerime Dön
              </Link>
              <Link to="/" className="order-details-btn-primary">
                <FiHome className="btn-icon" />
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  const orderId = order.id || order.Id;
  const orderDate = order.createdAt || order.CreatedAt;
  const orderStatus = order.status || order.Status || "";
  const orderItems = order.items || order.Items || [];
  const totalAmount = order.totalAmount || order.TotalAmount || calculateTotal();
  const shippingStatus = order.shippingStatus || order.ShippingStatus || "Hazırlanıyor";
  const trackingNumber = order.trackingNumber || order.TrackingNumber;
  const shippingStepIndex = getShippingStepIndex(shippingStatus);

  return (
    <main className="order-details-page">
      <div className="order-details-container">
        {/* Header */}
        <div className="order-details-header">
          <Link to="/orders" className="back-link">
            <FiArrowLeft className="back-icon" />
            Siparişlerime Dön
          </Link>
          <h1 className="order-details-title">
            <FiPackage className="title-icon" />
            Sipariş Detayları
          </h1>
        </div>

        {/* Order Info Card */}
        <div className="order-info-card">
          <div className="order-info-header">
            <div className="order-number-section">
              <span className="order-number-label">Sipariş No</span>
              <span className="order-number-value">#{orderId}</span>
            </div>
            <div className="order-status-badge">
              {getStatusIcon(orderStatus)}
              <span className="status-text">{getStatusText(orderStatus)}</span>
            </div>
          </div>

          <div className="order-info-details">
            <div className="info-item">
              <FiCalendar className="info-icon" />
              <div className="info-content">
                <span className="info-label">Sipariş Tarihi</span>
                <span className="info-value">
                  {new Date(orderDate).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
            </div>

            <div className="info-item">
              <FiCreditCard className="info-icon" />
              <div className="info-content">
                <span className="info-label">Ödeme Durumu</span>
                <span className="info-value">{getPaymentStatusText(orderStatus)}</span>
              </div>
            </div>

            <div className="info-item">
              <FiTruck className="info-icon" />
              <div className="info-content">
                <span className="info-label">Teslimat Durumu</span>
                <span className="info-value">
                  {shippingStatus}
                  {trackingNumber && ` · Takip No: ${trackingNumber}`}
                </span>
              </div>
            </div>

            <div className="shipping-progress">
              {SHIPPING_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`shipping-progress-step ${
                    index <= shippingStepIndex ? "shipping-progress-step-done" : ""
                  }`}
                >
                  <span className="shipping-progress-dot"></span>
                  <span className="shipping-progress-label">{step}</span>
                  {index < SHIPPING_STEPS.length - 1 && (
                    <span
                      className={`shipping-progress-line ${
                        index < shippingStepIndex ? "shipping-progress-line-done" : ""
                      }`}
                    ></span>
                  )}
                </div>
              ))}
            </div>

            {(order.shippingAddress || order.ShippingAddress) && (
              <div className="info-item">
                <FiHome className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Teslimat Adresi</span>
                  <span className="info-value">
                    {order.recipientName || order.RecipientName}
                    {(order.recipientPhone || order.RecipientPhone) && ` · ${order.recipientPhone || order.RecipientPhone}`}
                    <br />
                    {order.shippingAddress || order.ShippingAddress}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items-section">
          <h2 className="section-title">Sipariş İçeriği</h2>
          <div className="order-items-list">
            {orderItems.map((item, index) => {
              const productName = item.product?.name || item.Product?.Name || item.productName || item.ProductName || "Ürün";
              const productDescription = item.product?.description || item.Product?.Description || item.productDescription || item.ProductDescription || "";
              const productCategory = item.product?.category || item.Product?.Category || item.productCategory || item.ProductCategory || "";
              const quantity = item.quantity || item.Quantity || 0;
              const unitPrice = item.product?.price || item.Product?.Price || item.unitPrice || item.UnitPrice || 0;
              const itemTotal = unitPrice * quantity;
              const productImage = item.product?.imageUrl || item.Product?.ImageUrl || item.imageUrl || item.ImageUrl || "";

              return (
                <div key={index} className="order-item-card">
                  {productImage && (
                    <div className="item-image-wrapper">
                      <img 
                        src={productImage} 
                        alt={productName}
                        className="item-image"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;utf8," + encodeURIComponent(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
                              <rect width="100%" height="100%" fill="#f5f5f5"/>
                              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">No Image</text>
                            </svg>`
                          );
                        }}
                      />
                    </div>
                  )}
                  <div className="item-details">
                    <div className="item-header">
                      <h3 className="item-name">{productName}</h3>
                      {productCategory && (
                        <span className="item-category">{productCategory}</span>
                      )}
                    </div>
                    {productDescription && (
                      <p className="item-description">{productDescription}</p>
                    )}
                    <div className="item-specs">
                      <div className="spec-item">
                        <span className="spec-label">Miktar:</span>
                        <span className="spec-value">{quantity} adet</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Birim Fiyat:</span>
                        <span className="spec-value">₺{Number(unitPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-total">
                    <span className="item-total-label">Toplam</span>
                    <span className="item-total-price">₺{itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2 className="section-title">Sipariş Özeti</h2>
          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">Ara Toplam</span>
              <span className="summary-value">₺{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Kargo</span>
              <span className="summary-value">Ücretsiz</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span className="summary-label">Toplam</span>
              <span className="summary-value">₺{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="order-details-actions">
          <Link to="/" className="order-details-btn-primary">
            <FiHome className="btn-icon" />
            Ana Sayfaya Dön
          </Link>
          <Link to="/orders" className="order-details-btn-secondary">
            <FiPackage className="btn-icon" />
            Tüm Siparişlerim
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailsPage;

