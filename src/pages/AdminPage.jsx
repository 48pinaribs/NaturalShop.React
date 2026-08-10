import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiLock, FiLogOut, FiRefreshCw, FiLoader } from "react-icons/fi";
import apiConfig from "../config/api.js";
import "./AdminPage.css";

const SHIPPING_STATUSES = ["Hazırlanıyor", "Kargoya Verildi", "Teslim Edildi"];

function getPaymentStatusLabel(status) {
  switch ((status || "").toLowerCase()) {
    case "paid":
      return "Ödendi (Kart)";
    case "cashondelivery":
      return "Kapıda Ödeme";
    case "pending":
      return "Ödeme Bekleniyor";
    case "failed":
      return "Ödeme Başarısız";
    default:
      return status || "-";
  }
}

function AdminLoginForm({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    try {
      const res = await axios.post(apiConfig.endpoints.admin.login, { password });
      localStorage.setItem("adminToken", res.data.token);
      onLoggedIn();
    } catch (err) {
      toast.error(err.response?.data?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <FiLock className="admin-login-icon" />
        <h1 className="admin-login-title">Yönetim Paneli</h1>
        <input
          type="password"
          className="admin-login-input"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

function OrderRow({ order, onUpdated }) {
  const [shippingStatus, setShippingStatus] = useState(order.shippingStatus || "Hazırlanıyor");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [saving, setSaving] = useState(false);

  const dirty = shippingStatus !== (order.shippingStatus || "Hazırlanıyor") ||
    trackingNumber !== (order.trackingNumber || "");

  const handleUpdate = async () => {
    const adminToken = localStorage.getItem("adminToken");
    setSaving(true);
    try {
      await axios.put(
        apiConfig.endpoints.admin.updateShippingStatus(order.id),
        { shippingStatus, trackingNumber: trackingNumber.trim() },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      toast.success(`Sipariş #${order.id} güncellendi ✅`);
      onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Güncellenemedi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td>#{order.id}</td>
      <td>{new Date(order.createdAt).toLocaleDateString("tr-TR")}</td>
      <td>
        <div className="admin-customer-cell">
          <span>{order.customerEmail}</span>
          {order.recipientName && <small>{order.recipientName} · {order.recipientPhone}</small>}
        </div>
      </td>
      <td className="admin-items-cell">
        {order.items?.map((item, i) => (
          <div key={i}>{item.quantity}× {item.productName}</div>
        ))}
      </td>
      <td>{Number(order.totalAmount).toFixed(2)} TL</td>
      <td>
        <span className={`admin-payment-badge admin-payment-${(order.status || "").toLowerCase()}`}>
          {getPaymentStatusLabel(order.status)}
        </span>
      </td>
      <td>
        <select
          className="admin-select"
          value={shippingStatus}
          onChange={(e) => setShippingStatus(e.target.value)}
        >
          {SHIPPING_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td>
        <input
          type="text"
          className="admin-tracking-input"
          placeholder="Takip no"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </td>
      <td>
        <button
          className="admin-update-btn"
          onClick={handleUpdate}
          disabled={!dirty || saving}
        >
          {saving ? <FiLoader className="spinning" /> : "Güncelle"}
        </button>
      </td>
    </tr>
  );
}

function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("adminToken"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) return;

    setLoading(true);
    try {
      const res = await axios.get(apiConfig.endpoints.admin.orders, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setOrders(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        setIsAuthed(false);
        toast.error("Oturum süresi doldu, tekrar giriş yapın");
      } else {
        toast.error("Siparişler yüklenemedi");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthed) fetchOrders();
  }, [isAuthed, fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthed(false);
  };

  if (!isAuthed) {
    return <AdminLoginForm onLoggedIn={() => setIsAuthed(true)} />;
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Sipariş Yönetimi</h1>
        <div className="admin-header-actions">
          <button className="admin-icon-btn" onClick={fetchOrders} title="Yenile">
            <FiRefreshCw className={loading ? "spinning" : ""} />
          </button>
          <button className="admin-icon-btn" onClick={handleLogout} title="Çıkış Yap">
            <FiLogOut />
          </button>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tarih</th>
              <th>Müşteri</th>
              <th>Ürünler</th>
              <th>Tutar</th>
              <th>Ödeme</th>
              <th>Kargo Durumu</th>
              <th>Takip No</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onUpdated={fetchOrders} />
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && (
          <p className="admin-empty">Henüz sipariş yok.</p>
        )}
      </div>
    </main>
  );
}

export default AdminPage;
