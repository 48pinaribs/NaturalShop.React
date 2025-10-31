import { createContext, useContext, useState } from "react";


const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Sepete ürün ekleme
  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook: context'i daha kolay kullanmak için
export function useCart() {
  return useContext(CartContext);
}
