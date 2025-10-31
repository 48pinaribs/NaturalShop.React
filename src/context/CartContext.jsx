import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const saveToLocalStorage = (items) => {
    localStorage.setItem("cart", JSON.stringify(items));
  };

  // Ürün ekle
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      let updated;
      if (exist) {
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
