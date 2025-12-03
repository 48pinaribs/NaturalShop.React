import React, { useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import ProductJourneyModal from "./ProductJourneyModal";
import { getProductJourneySteps } from "../data/productJourneySteps";

function ProductCard({ id, name, description, price, imageUrl, image }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const imageSrc = imageUrl || image || "";
  const [imgSrc, setImgSrc] = useState(imageSrc);
  const { addToCart } = useCart();
  const [showStory, setShowStory] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showLeaf, setShowLeaf] = useState(false);
  const displayName = name || "Ürün";

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking add button
    setIsAdding(true);
    setShowLeaf(true);
    
    addToCart({ id, name: displayName, description, price, image: imageSrc });
    toast.success("Ürün sepete eklendi 🛒");
    
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setShowLeaf(false), 600);
    }, 400);
  }

  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <rect width="100%" height="100%" fill="#f2f2f2"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial, Helvetica, sans-serif" font-size="16">No Image</text>
      </svg>`
    );

  const handleError = () => {
    if (imgSrc !== placeholder) setImgSrc(placeholder);
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="product-card-wrapper"
    >
      <div
        className={`product-card ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-img-wrapper">
          <div
            className="journey-badge"
            onClick={(e) => {
              e.stopPropagation();
              setShowStory(true);
            }}
          >
            🌿 Yolculuğunu keşfet
          </div>
          <img
            src={imgSrc || placeholder}
            alt={displayName}
            className="product-img"
            onError={handleError}
            loading="lazy"
          />
        </div>

        <p className="product-name">{displayName}</p>
        <div className="price-journey-container">
          <p className="product-price">₺{Number(price).toFixed(2)}</p>
          <div
            className="journey-badge-mobile"
            onClick={(e) => {
              e.stopPropagation();
              setShowStory(true);
            }}
          >
            <div className="journey-line-container">
            <span className="journey-line-1">
              <span className="journey-icon-mobile">🌿</span>
              <span className="journey-text-mobile">Yolculuğunu</span>
            </span>
            <span className="journey-line-2">keşfet</span>
            </div>

          </div>
        </div>
        <button 
          className={`premium-add-btn ${isAdding ? 'adding' : ''}`}
          onClick={handleAdd}
          aria-label="Sepete Ekle"
        >
          <span className="btn-content">
            <span className="btn-icon">🍃</span>
            <span className="btn-text">Sepete Ekle</span>
          </span>
          {showLeaf && (
            <span className="leaf-burst" aria-hidden="true">
              <span className="leaf leaf-1">🍃</span>
              <span className="leaf leaf-2">🍃</span>
              <span className="leaf leaf-3">🍃</span>
            </span>
          )}
        </button>

      </div>
      <ProductJourneyModal
        open={showStory}
        onClose={() => setShowStory(false)}
        productName={displayName}
        steps={getProductJourneySteps(displayName)}
        autoPlay={true}
        intervalMs={3500}
      />

    </div>
  );
}

export default ProductCard;
