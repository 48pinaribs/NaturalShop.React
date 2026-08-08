import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiPackage,
  FiPhone,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import logoFull from "../assets/logo2.png";
import "./Header.css";

// Ürün kategorileri (ProductsPage.jsx'teki categoryMap ile aynı slug'lar)
const CATEGORIES = [
  { slug: "zeytinyagi", title: "Zeytinyağı" },
  { slug: "incir", title: "İncir" },
  { slug: "bal-pekmez", title: "Bal & Pekmez" },
  { slug: "kurutulmus-meyveler", title: "Kurutulmuş Meyveler" },
  { slug: "taze-meyveler", title: "Taze Meyveler" },
  { slug: "kurutulmus-sebzeler", title: "Kurutulmuş Sebzeler" },
  { slug: "konserveler", title: "Konserveler" },
  { slug: "sut-urunleri", title: "Süt Ürünleri" },
  { slug: "sifali-bitkiler", title: "Şifalı Bitkiler" },
  { slug: "baharatlar", title: "Baharatlar" },
];

const Header = () => {
  const { cartItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  // Check auth status from localStorage
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Get user from localStorage on mount and listen for changes
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (cross-tab) ve aynı sekme içindeki
    // login/logout işlemlerinden sonra tetiklenen "authchange" event'i
    // (localStorage'ı 500ms'de bir yoklamak yerine)
    window.addEventListener("storage", checkAuthStatus);
    window.addEventListener("authchange", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("authchange", checkAuthStatus);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
  }, [location.pathname]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsCategoryMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authchange"));
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Telefon numarası ile giriş yapıp yapmadığını kontrol et
  const isPhoneLogin = (user) => {
    if (!user) return false;
    // Email @naturalshop.local ile bitiyorsa veya phoneNumber varsa telefon ile giriş yapmıştır
    return (
      (user.email && user.email.endsWith("@naturalshop.local")) ||
      (user.phoneNumber && !user.email?.includes("@"))
    );
  };

  // Telefon numarasını formatla (son 4 haneyi göster)
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    // 905551234567 -> 0555 *** 4567
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length >= 10) {
      const last4 = cleaned.slice(-4);
      const middle = cleaned.slice(-8, -4);
      return `0${middle} *** ${last4}`;
    }
    return phoneNumber;
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Check if current route is active
  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="trust-bar-container">
          <div className="trust-item">
            <span>🍃</span>
            <span>Doğal Ürünler</span>
          </div>
          <div className="trust-divider">•</div>
          <div className="trust-item">
            <span>📦</span>
            <span>Hızlı Teslimat</span>
          </div>
          <div className="trust-divider">•</div>
          <div className="trust-item">
            <span>🔒</span>
            <span>Güvenli Ödeme</span>
          </div>
        </div>
      </div>

      <header className="header" role="banner">
        <div className="header-container">
          {/* Logo - Left */}
          <Link
            to="/"
            className="header-logo"
            aria-label="Köyümüzden Sofranıza Ana Sayfa"
            onClick={closeMobileMenu}
          >
            <img
              src={logoFull}
              alt="Köyümüzden Sofranıza - Doğal Köy Ürünleri"
              className="header-logo-full"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="header-nav" aria-label="Ana navigasyon">
            <div className="category-menu-wrapper" ref={categoryMenuRef}>
              <button
                type="button"
                className={`nav-link category-menu-trigger ${
                  isActiveRoute("/products") ? "active" : ""
                }`}
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="true"
              >
                <span className="nav-icon">🌿</span>
                Kategoriler
              </button>
              {isCategoryMenuOpen && (
                <div className="user-dropdown category-dropdown" role="menu">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products/${cat.slug}`}
                      className="user-dropdown-item"
                      role="menuitem"
                      onClick={() => setIsCategoryMenuOpen(false)}
                    >
                      <span>{cat.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="header-actions">
            {/* Ürünlerimiz - Desktop */}
            <Link
              to="/"
              className={`header-action-link ${
                isActiveRoute("/") && !isActiveRoute("/products")
                  ? "active"
                  : ""
              }`}
              onClick={closeMobileMenu}
            >
              <span className="action-icon">🌿</span>
              <span className="action-text">Ürünlerimiz</span>
            </Link>

            {/* Siparişlerim - Desktop (only if logged in) */}
            {user && (
              <Link
                to="/orders"
                className={`header-action-link ${
                  isActiveRoute("/orders") ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                <FiPackage className="action-icon" />
                <span className="action-text">Siparişlerim</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="header-action-btn cart-btn"
              aria-label={`Sepet (${cartCount} ürün)`}
              onClick={closeMobileMenu}
            >
              <FiShoppingCart className="action-icon" />
              {cartCount > 0 && (
                <span className="cart-badge" aria-label={`${cartCount} ürün`}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu / Login - Desktop */}
            {user ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button
                  className="user-avatar-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="Kullanıcı menüsü"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  {isPhoneLogin(user) ? (
                    <span
                      className="user-avatar user-avatar-phone"
                      aria-hidden="true"
                    >
                      <FiPhone className="phone-icon" />
                    </span>
                  ) : (
                    <span className="user-avatar" aria-hidden="true">
                      {getInitials(user.fullName)}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="user-dropdown" role="menu">
                    <div className="user-dropdown-header">
                      {isPhoneLogin(user) ? (
                        <>
                          <span className="user-name">Hoş Geldiniz</span>
                          <span className="user-phone">
                            <FiPhone className="phone-icon-small" />
                            {formatPhoneNumber(
                              user.phoneNumber ||
                                user.email?.replace("@naturalshop.local", "") ||
                                ""
                            )}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="user-name">{user.fullName}</span>
                          <span className="user-email">{user.email}</span>
                        </>
                      )}
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link
                      to="/orders"
                      className="user-dropdown-item"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiPackage className="dropdown-icon" />
                      <span>Siparişlerim</span>
                    </Link>
                    <button
                      className="user-dropdown-item user-dropdown-item-logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="dropdown-icon" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/phone-login"
                className={`header-action-link ${
                  isActiveRoute("/phone-login") ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                <FiUser className="action-icon" />
                <span className="action-text">Giriş Yap</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <FiX className="menu-icon" />
              ) : (
                <FiMenu className="menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`mobile-drawer ${
            isMobileMenuOpen ? "mobile-drawer-open" : ""
          }`}
          ref={mobileMenuRef}
          role="navigation"
          aria-label="Mobil navigasyon"
        >
          <div className="mobile-drawer-content">
            {/* User Info in Mobile Menu */}
            {user && (
              <div className="mobile-user-info">
                {isPhoneLogin(user) ? (
                  <>
                    <div className="mobile-user-avatar mobile-user-avatar-phone">
                      <FiPhone className="phone-icon-mobile" />
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">Hoş Geldiniz</span>
                      <span className="mobile-user-phone">
                        <FiPhone className="phone-icon-small" />
                        {formatPhoneNumber(
                          user.phoneNumber ||
                            user.email?.replace("@naturalshop.local", "") ||
                            ""
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mobile-user-avatar">
                      {getInitials(user.fullName)}
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">{user.fullName}</span>
                      <span className="mobile-user-email">{user.email}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="mobile-nav">
              <Link
                to="/"
                className={`mobile-nav-link ${
                  isActiveRoute("/") && !isActiveRoute("/products")
                    ? "active"
                    : ""
                }`}
                onClick={closeMobileMenu}
              >
                <span className="mobile-nav-category-icon">🌿</span>
                Ürünlerimiz
              </Link>

              <div className="mobile-nav-categories">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products/${cat.slug}`}
                    className={`mobile-nav-link mobile-nav-subitem ${
                      isActiveRoute(`/products/${cat.slug}`) ? "active" : ""
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>

              {user && (
                <Link
                  to="/orders"
                  className={`mobile-nav-link ${
                    isActiveRoute("/orders") ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FiPackage className="mobile-nav-icon" />
                  Siparişlerim
                </Link>
              )}

              <Link
                to="/cart"
                className={`mobile-nav-link ${
                  isActiveRoute("/cart") ? "active" : ""
                }`}
                onClick={closeMobileMenu}
              >
                <FiShoppingCart className="mobile-nav-icon" />
                Sepet
                {cartCount > 0 && (
                  <span className="mobile-cart-badge">{cartCount}</span>
                )}
              </Link>

              {/* Auth Link in Mobile Menu */}
              {user ? (
                <button
                  className="mobile-nav-link mobile-nav-link-logout"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mobile-nav-icon" />
                  Çıkış Yap
                </button>
              ) : (
                <Link
                  to="/phone-login"
                  className={`mobile-nav-link ${
                    isActiveRoute("/phone-login") ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FiUser className="mobile-nav-icon" />
                  Giriş Yap
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="mobile-drawer-overlay"
            onClick={closeMobileMenu}
            aria-hidden="true"
          ></div>
        )}
      </header>
    </>
  );
};

export default Header;
