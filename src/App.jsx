import { Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import ProductsPage from "./pages/ProductsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartPage from "./pages/CartPage";

<ToastContainer position="top-right" autoClose={2000} />
function App() {
  return (
    <CartProvider>
      <Header />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      <Footer />
    </CartProvider>
  );
}

export default App;
