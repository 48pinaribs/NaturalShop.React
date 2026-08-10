import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiHome,
  FiSave,
  FiLogOut,
  FiPackage,
  FiLoader,
  FiTruck,
} from "react-icons/fi";
import apiConfig from "../config/api.js";
import "./ProfilePage.css";

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/email-login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [meRes, ordersRes] = await Promise.all([
          axios.get(apiConfig.endpoints.auth.me, { headers }),
          axios.get(apiConfig.endpoints.orders.list, { headers }).catch(() => ({ data: [] })),
        ]);

        setEmail(meRes.data.email || meRes.data.Email || "");
        setFullName(meRes.data.fullName || meRes.data.FullName || "");
        setAddress(meRes.data.address || meRes.data.Address || "");

        const orders = (ordersRes.data || []).filter((o) => {
          const status = (o.status || o.Status || "").toLowerCase();
          return status === "paid" || status === "cashondelivery";
        });
        setRecentOrders(orders.slice(0, 3));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/email-login");
          return;
        }
        setError("Profil bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Ad soyad boş olamaz");
      return;
    }

    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await axios.put(
        apiConfig.endpoints.auth.me,
        { fullName: fullName.trim(), address: address.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Header'daki kullanıcı adını da güncelle
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...storedUser, fullName: res.data.fullName || res.data.FullName })
      );
      window.dispatchEvent(new Event("authchange"));

      toast.success("Profiliniz güncellendi ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profil güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authchange"));
    navigate("/");
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Profiliniz yükleniyor...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">
            <FiUser className="title-icon" />
            Profilim
          </h1>
          <p className="profile-subtitle">Hesap bilgilerini yönet, siparişlerini takip et</p>
        </div>

        {error && <div className="profile-error">{error}</div>}

        <div className="profile-grid">
          {/* Hesap Bilgileri */}
          <form className="profile-card" onSubmit={handleSave}>
            <h2 className="profile-card-title">Hesap Bilgileri</h2>

            <label className="profile-label">
              <div className="profile-label-header">
                <FiMail className="profile-label-icon" />
                <span>E-posta</span>
              </div>
              <input type="email" className="profile-input" value={email} disabled />
            </label>

            <label className="profile-label">
              <div className="profile-label-header">
                <FiUser className="profile-label-icon" />
                <span>Ad Soyad</span>
              </div>
              <input
                type="text"
                className="profile-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ad Soyad"
              />
            </label>

            <label className="profile-label">
              <div className="profile-label-header">
                <FiHome className="profile-label-icon" />
                <span>Adres</span>
              </div>
              <textarea
                rows="3"
                className="profile-input profile-textarea"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Teslimat adresiniz (opsiyonel)"
              ></textarea>
            </label>

            <button type="submit" className="profile-save-btn" disabled={saving}>
              {saving ? (
                <>
                  <FiLoader className="btn-icon spinning" /> Kaydediliyor...
                </>
              ) : (
                <>
                  <FiSave className="btn-icon" /> Kaydet
                </>
              )}
            </button>

            <button type="button" className="profile-logout-btn" onClick={handleLogout}>
              <FiLogOut className="btn-icon" /> Çıkış Yap
            </button>
          </form>

          {/* Sipariş Takibi */}
          <div className="profile-card">
            <h2 className="profile-card-title">
              <FiTruck className="title-icon-inline" />
              Son Siparişlerim
            </h2>

            {recentOrders.length === 0 ? (
              <p className="profile-empty-orders">Henüz bir siparişiniz yok.</p>
            ) : (
              <div className="profile-orders-list">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id || order.Id}
                    to={`/orders/${order.id || order.Id}`}
                    className="profile-order-item"
                  >
                    <div className="profile-order-item-info">
                      <span className="profile-order-number">#{order.id || order.Id}</span>
                      <span className="profile-order-date">
                        {new Date(order.createdAt || order.CreatedAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <span className="profile-order-shipping-status">
                      {order.shippingStatus || order.ShippingStatus || "Hazırlanıyor"}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <Link to="/orders" className="profile-all-orders-link">
              <FiPackage className="btn-icon" /> Tüm Siparişlerim
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
