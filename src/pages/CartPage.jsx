import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"; // icons: minus, plus, trash
import "./CartPage.css";

function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, cartTotal, clearCart } = useCart();

  if (!cartItems.length) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <span className="cart-empty-icon">🛒</span>
          <h2 className="cart-empty-title">Sepetiniz boş</h2>
          <p className="cart-empty-text">Alışverişe başlamak için ürünleri keşfedin</p>
        </div>
      </div>
    );
  }

  return (
    <main className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Sepetim</h1>
        <span className="cart-item-count">{cartItems.length} ürün</span>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => {
          const itemTotal = item.price * item.quantity;
          const itemImage = item.imageUrl || item.image || "";
          const itemName = item.name || item.title || item.description || "Ürün";
          
          return (
            <div className="cart-item" key={item.id}>
              {/* Product Image */}
              <div className="cart-item-image-wrapper">
                <img 
                  src={itemImage} 
                  alt={itemName}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;utf8," + 
                      encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">No Image</text></svg>`);
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="cart-item-info">
                <div className="cart-item-header">
                  <h3 className="cart-item-name">{itemName}</h3>
                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Ürünü kaldır"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="cart-item-price-row">
                  <span className="cart-item-unit-price">{Number(item.price).toFixed(2)} TL</span>
                  <span className="cart-item-total-price">
                    {item.quantity} × {Number(item.price).toFixed(2)} = <strong>{itemTotal.toFixed(2)} TL</strong>
                  </span>
                </div>

                <div className="cart-item-controls">
                  <div className="qty-control">
                    <button 
                      className="qty-button qty-decrease"
                      onClick={() => decreaseQty(item.id)}
                      aria-label="Miktarı azalt"
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-button qty-increase"
                      onClick={() => increaseQty(item.id)}
                      aria-label="Miktarı artır"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="cart-summary">
        <h2 className="cart-summary-title">Sepet Özeti</h2>
        <div className="cart-summary-total">
          <span className="cart-summary-label">Toplam</span>
          <span className="cart-summary-amount">{cartTotal.toFixed(2)} TL</span>
        </div>
        <div className="cart-summary-actions">
          <button 
            className="cart-button cart-button-secondary"
            onClick={clearCart}
          >
            Sepeti Temizle
          </button>
          <button 
            className="cart-button cart-button-primary"
            onClick={() => alert("Ödeme sayfası yakında!")}
          >
            Ödemeye Geç
          </button>
        </div>
      </div>
    </main>
  );
}

export default CartPage;
