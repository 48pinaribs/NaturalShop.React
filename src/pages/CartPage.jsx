import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi"; // icons: minus, plus, trash, shopping bag
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./CartPage.css";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = (itemId, itemName) => {
    removeFromCart(itemId);
    toast.success(`${itemName} kaldırıldı 🗑️`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleImageClick = (itemId, e) => {
    e.stopPropagation();
    navigate(`/product/${itemId}`);
  };

  if (!cartItems.length) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <div className="cart-empty-illustration">
            <FiShoppingBag />
          </div>
          <h2 className="cart-empty-title">Sepetiniz boş</h2>
          <p className="cart-empty-text">Doğal ürünlerimizi keşfedin ve sepetinizi doldurun</p>
        </div>
      </div>
    );
  }

  return (
    <main className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <h1 className="cart-title">Sepetim</h1>
        <span className="cart-item-count">{cartItems.length} {cartItems.length === 1 ? "ürün" : "ürün"}</span>
      </div>

      {/* Cart Items - Image Focused Layout */}
      <div className="cart-items-wrapper">
        {cartItems.map((item) => {
          const itemTotal = item.price * item.quantity;
          const itemImage = item.imageUrl || item.image || "";
          const itemName = item.name || item.title || item.description || "Ürün";
          const placeholder = "data:image/svg+xml;utf8," +
            encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="160"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">No Image</text></svg>`);

          return (
            <div className="cart-item-card" key={item.id}>
              {/* Floating Remove Badge */}
              <button
                className="cart-item-remove-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.id, itemName);
                }}
                aria-label="Ürünü kaldır"
              >
                <FiTrash2 />
              </button>

              {/* Large Product Image */}
              <div
                className="cart-item-image-container"
                onClick={(e) => handleImageClick(item.id, e)}
              >
                <img
                  src={itemImage || placeholder}
                  alt={itemName}
                  className="cart-item-image"
                  onError={(e) => {
                    if (e.target.src !== placeholder) {
                      e.target.src = placeholder;
                    }
                  }}
                />
              </div>

              {/* Product Info Section */}
              <div className="cart-item-content">
                <h3 className="cart-item-name">{itemName}</h3>

                <div className="cart-item-price-info">
                  <span className="cart-item-unit-price">{Number(item.price).toFixed(2)} TL</span>
                  <span className="cart-item-calc">
                    {item.quantity} × {Number(item.price).toFixed(2)} = {itemTotal.toFixed(2)} TL
                  </span>
                </div>

                {/* Quantity Control */}
                <div className="cart-item-qty-section">
                  <div className="qty-control-wrapper">
                    <button
                      className="qty-btn qty-btn-minus"
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQty(item.id);
                      }}
                      aria-label="Miktarı azalt"
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn qty-btn-plus"
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQty(item.id);
                      }}
                      aria-label="Miktarı artır"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="cart-item-row-total">{itemTotal.toFixed(2)} TL</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary Card */}
      <div className="order-summary">
        <h2 className="order-summary-title">Sipariş Özeti</h2>

        <div className="order-summary-divider"></div>

        <div className="order-summary-total-row">
          <span className="order-summary-label">Toplam</span>
          <span className="order-summary-amount">{cartTotal.toFixed(2)} TL</span>
        </div>

        <div className="order-summary-divider"></div>

        <div className="order-summary-actions">
          <button
            className="order-btn order-btn-clear"
            onClick={clearCart}
          >
            Sepeti Temizle
          </button>
          <Link to="/checkout">
            <button className="order-btn order-btn-checkout">Siparişi Tamamla</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
