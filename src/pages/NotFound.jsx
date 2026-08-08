import { Link } from "react-router-dom";
import { FiHome, FiShoppingBag } from "react-icons/fi";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🍃</div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          Aradığınız sayfa bulunamadı. Belki de yanlış bir bağlantıya tıkladınız.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="premium-btn premium-btn-primary">
            <span className="premium-btn-content">
              <FiHome className="premium-btn-icon" />
              <span className="premium-btn-text">Ana Sayfaya Dön</span>
            </span>
          </Link>
          <Link to="/" className="premium-btn premium-btn-secondary">
            <span className="premium-btn-content">
              <FiShoppingBag className="premium-btn-icon" />
              <span className="premium-btn-text">Ürünleri Keşfet</span>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
