import React from 'react';
import './Header.css';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'; // icons: search, shopping cart, user

const Header = () => {
  const { cartItems } = useCart();
  const count = cartItems.length;
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <a href="/" className="header-logo">
          <span className="header-logo-icon">🌿</span>
          <span>NaturalShop</span>
        </a>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <button className="nav-button">Home</button>
          <button className="nav-button">Products</button>
          <button className="nav-button">Categories</button>
          <button className="nav-button">About</button>
          <button className="nav-button">Contact</button>
        </nav>

        {/* Right Side Icons */}
        <div className="header-icons">
          {/* Search Icon */}
          <button className="icon-button" aria-label="Search">
            <FiSearch />
          </button>

          {/* Shopping Cart Icon */}
          <Link to="/cart" className="cart-button-wrapper">
            <button className="icon-button" aria-label="Shopping Cart">
              <FiShoppingCart className="cart-icon" />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </button>
          </Link>

          {/* Account Icon */}
          <button className="icon-button" aria-label="Account">
            <FiUser />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

