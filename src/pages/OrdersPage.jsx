import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingBag, FiHome, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import apiConfig from "../config/api.js";
import "./OrdersPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/email-login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(apiConfig.endpoints.orders.list, {
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
          throw new Error("Siparişler yüklenemedi");
        }
        
        const data = await res.json();
        
        // Sadece onaylanmış siparişleri göster: kart ile ödenmiş (Paid) veya
        // kapıda ödeme ile oluşturulmuş (CashOnDelivery) siparişler
        const confirmedOrders = data.filter(order => {
          const status = (order.status || order.Status || "").toLowerCase();
          return status === "paid" || status === "cashondelivery";
        });

        setOrders(confirmedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Siparişler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "cashondelivery":
        return <FiCheckCircle className="status-icon status-paid" />;
      case "pending":
        return <FiClock className="status-icon status-pending" />;
      case "failed":
        return <FiXCircle className="status-icon status-failed" />;
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
      case "failed":
        return "Başarısız";
      default:
        return "Beklemede";
    }
  };

  const getShippingBadgeClass = (shippingStatus) => {
    switch (shippingStatus) {
      case "Teslim Edildi":
        return "shipping-badge-delivered";
      case "Kargoya Verildi":
        return "shipping-badge-shipped";
      default:
        return "shipping-badge-preparing";
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Siparişleriniz yükleniyor...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-error">
            <FiXCircle className="error-icon" />
            <h2>Bir Hata Oluştu</h2>
            <p>{error}</p>
            <Link to="/" className="orders-btn-primary">
              <FiHome className="btn-icon" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Sipariş yoksa
  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-empty">
            <div className="empty-icon-wrapper">
              <FiShoppingBag className="empty-icon" />
            </div>
            <h1 className="empty-title">Henüz Siparişiniz Yok</h1>
            <p className="empty-message">
              Doğal ürünlerimizi keşfetmeye başlayın ve ilk siparişinizi verin!
            </p>
            <div className="empty-features">
              <div className="empty-feature">
                <span className="feature-icon">🍃</span>
                <span className="feature-text">Doğal ve Organik Ürünler</span>
              </div>
              <div className="empty-feature">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Hızlı ve Güvenli Teslimat</span>
              </div>
              <div className="empty-feature">
                <span className="feature-icon">💳</span>
                <span className="feature-text">Güvenli Ödeme Seçenekleri</span>
              </div>
            </div>
            <Link to="/" className="orders-btn-primary">
              <FiShoppingBag className="btn-icon" />
              Ürünleri Keşfet
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Siparişler varsa
  return (
    <main className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">
            <FiPackage className="title-icon" />
            Siparişlerim
          </h1>
          <p className="orders-subtitle">
            Tüm siparişlerinizi buradan takip edebilirsiniz
          </p>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id || order.Id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-number">
                    Sipariş No: #{order.id || order.Id}
                  </span>
                  <span className="order-date">
                    {new Date(order.createdAt || order.CreatedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status || order.Status)}
                  <span className="status-text">
                    {getStatusText(order.status || order.Status)}
                  </span>
                </div>
              </div>

              <div className={`shipping-badge ${getShippingBadgeClass(order.shippingStatus || order.ShippingStatus)}`}>
                <FiPackage className="shipping-badge-icon" />
                <span>{order.shippingStatus || order.ShippingStatus || "Hazırlanıyor"}</span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items">
                  {order.items.map((item, index) => {
                    const productName = item.product?.name || item.Product?.Name || item.productName || item.ProductName || "Ürün";
                    const productDescription = item.product?.description || item.Product?.Description || item.productDescription || item.ProductDescription || "";
                    const productCategory = item.product?.category || item.Product?.Category || item.productCategory || item.ProductCategory || "";
                    const quantity = item.quantity || item.Quantity || 0;
                    const unitPrice = item.product?.price || item.Product?.Price || item.unitPrice || item.UnitPrice || 0;
                    const itemTotal = unitPrice * quantity;
                    
                    return (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <div className="item-header-info">
                            <span className="item-name">{productName}</span>
                            {productCategory && (
                              <span className="item-category-badge">{productCategory}</span>
                            )}
                          </div>
                          {productDescription && (
                            <p className="item-description-text">{productDescription}</p>
                          )}
                          <div className="item-quantity-info">
                            <span className="item-quantity-label">Miktar:</span>
                            <span className="item-quantity-value">{quantity} adet</span>
                            <span className="item-separator">•</span>
                            <span className="item-unit-price-label">Birim: ₺{Number(unitPrice).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="item-pricing">
                          <span className="item-price">₺{itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="order-card-footer">
                <div className="order-total">
                  <span className="total-label">Toplam:</span>
                  <span className="total-amount">
                    ₺{(() => {
                      // Eğer totalAmount varsa onu kullan, yoksa items'dan hesapla
                      if (order.totalAmount || order.TotalAmount) {
                        return Number(order.totalAmount || order.TotalAmount).toFixed(2);
                      }
                      if (order.items && order.items.length > 0) {
                        const total = order.items.reduce((sum, item) => {
                          const quantity = item.quantity || item.Quantity || 0;
                          const unitPrice = item.product?.price || item.Product?.Price || item.unitPrice || item.UnitPrice || 0;
                          return sum + (unitPrice * quantity);
                        }, 0);
                        return total.toFixed(2);
                      }
                      return "0.00";
                    })()}
                  </span>
                </div>
                <Link
                  to={`/orders/${order.id || order.Id}`}
                  className="order-details-btn"
                >
                  Detayları Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default OrdersPage;

