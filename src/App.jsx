import { Routes, Route } from "react-router-dom";
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
import PhoneLogin from "./pages/PhoneLogin";
import About from "./pages/About";
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
        <Route path="/products/zeytinyagi" element={<ProductsPage category="zeytinyagi" />} />
        <Route path="/products/incir" element={<ProductsPage category="incir" />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <Footer />
      <ToastContainer position="top-right" autoClose={1000} />
      <SupportContactWidget />
    </CartProvider>
  );
}

export default App;
