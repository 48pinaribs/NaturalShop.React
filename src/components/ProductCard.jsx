import React, { useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ id, description, price, image }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(image || "");
  const { addToCart } = useCart();


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
          <img
            src={imgSrc || placeholder}
            alt={description}
            className="product-img"
            onError={handleError}
            loading="lazy"
          />
        </div>

        <p className="product-description">{description}</p>
        <p className="product-price">${Number(price).toFixed(2)}</p>
        <button onClick={() => addToCart({ id, description, price, image })}>Sepete Ekle</button>
      </div>
     
    </div>
  );
}

export default ProductCard;
