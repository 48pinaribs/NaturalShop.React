import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveToLocalStorage = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Bir ürünün stok sınırını bul (backend'den stock bilgisi gelmiyorsa sınırsız kabul edilir)
  const getStockLimit = (item) => {
    const stock = item?.stock ?? item?.Stock;
    return typeof stock === "number" ? stock : Infinity;
  };

  // Ürün ekle
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      const stockLimit = getStockLimit(product);
      let updated;
      if (exist) {
        if (exist.quantity >= stockLimit) {
          toast.error(`${product.name || "Bu ürün"} için stokta sadece ${stockLimit} adet var`);
          return prev;
        }
        updated = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) => {
      const target = prev.find((item) => item.id === id);
      const stockLimit = getStockLimit(target);
      if (target && target.quantity >= stockLimit) {
        toast.error(`${target.name || "Bu ürün"} için stokta sadece ${stockLimit} adet var`);
        return prev;
      }
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const decreaseQty = (id) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      saveToLocalStorage(updated);
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
