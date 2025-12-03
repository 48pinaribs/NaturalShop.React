import { Link } from "react-router-dom";
import { FiCheckCircle, FiHome, FiPackage } from "react-icons/fi";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <main className="order-success-container">
      <div className="order-success-content">
        <div className="success-icon-wrapper">
          <FiCheckCircle className="success-icon" />
        </div>
        
        <h1 className="success-title">Siparişiniz Alındı! 🌿</h1>
        
        <p className="success-message">
          Doğal ürünleriniz özenle hazırlanıyor.
        </p>

        <div className="success-actions">
          <Link to="/" className="success-btn success-btn-primary">
            <FiHome className="success-btn-icon" />
            Ana Sayfa
          </Link>
          
          <button className="success-btn success-btn-outline" disabled>
            <FiPackage className="success-btn-icon" />
            Siparişlerim
          </button>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;

