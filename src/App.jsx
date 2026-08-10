import { Routes, Route, Navigate } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import ProductsPage from "./pages/ProductsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentResultPage from "./pages/PaymentResultPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailLogin from "./pages/EmailLogin";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import SupportContactWidget from "./components/SupportContactWidget";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-login" element={<EmailLogin />} />
        {/* Eski telefonla-giriş linkleri kırılmasın diye yeni rotaya yönlendir */}
        <Route path="/phone-login" element={<Navigate to="/email-login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={1000} />
      <SupportContactWidget />
    </CartProvider>
  );
}

export default App;
