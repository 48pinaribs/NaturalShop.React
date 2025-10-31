import React from 'react';
import './Footer.css';
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineTwitter } from 'react-icons/ai'; // icons: facebook, instagram, twitter

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Logo/Brand */}
        <div className="footer-left">
          <span className="footer-logo">🌿</span>
          <span className="footer-brand">NaturalShop</span>
          <span className="footer-copyright">
            © {currentYear}
          </span>
        </div>

        {/* Right: Social Icons */}
        <div className="footer-right">
          <button className="footer-social-icon" aria-label="Facebook">
            <AiOutlineFacebook />
          </button>
          <button className="footer-social-icon" aria-label="Instagram">
            <AiOutlineInstagram />
          </button>
          <button className="footer-social-icon" aria-label="Twitter">
            <AiOutlineTwitter />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

