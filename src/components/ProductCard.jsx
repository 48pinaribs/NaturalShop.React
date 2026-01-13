import React, { useState, useMemo, useEffect } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import ProductJourneyModal from "./ProductJourneyModal";
import apiConfig from "../config/api.js";

const baseUrl = "https://naturalshop-api.onrender.com";
// const baseUrl = "http://localhost:5072";

// URL'nin tam URL olup olmadığını kontrol eden helper fonksiyon
const ensureFullUrl = (url) => {
  if (!url) return "";
  // Eğer zaten tam URL ise (http:// veya https:// ile başlıyorsa) olduğu gibi döndür
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Değilse baseUrl ekle
  //const baseUrl = apiConfig.API_BASE_URL.replace(/\/$/, ""); // Trailing slash'i kaldır
  // URL'nin başındaki / karakterini kaldır (varsa)
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${baseUrl}/${cleanUrl}`;
};

function ProductCard({
  id,
  name,
  description,
  price,
  imageUrl,
  image,
  ImageUrl,
  Images,
  storyText,
  storyImages,
  StoryImages,
}) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Hem camelCase hem PascalCase destekle (API'den gelen veriye göre)
  const productImageUrl =
    imageUrl ||
    ImageUrl ||
    image ||
    (Images && Images.length > 0 ? Images[0] : null);
  const productStoryImages = storyImages || StoryImages;

  const imageSrc = ensureFullUrl(productImageUrl || "");
  console.log("Product image source:", imageSrc, "from:", {
    imageUrl,
    ImageUrl,
    image,
    Images,
  });
  const [imgSrc, setImgSrc] = useState(imageSrc);
  const { addToCart } = useCart();
  const [showStory, setShowStory] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showLeaf, setShowLeaf] = useState(false);
  const displayName = name || "Ürün";

  // imageSrc değiştiğinde imgSrc'yi güncelle
  useEffect(() => {
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [imageSrc]);

  // Dinamik steps oluşturma - her ürünün kendi storyImages dizisindeki resimleri kullan
  const journeySteps = useMemo(() => {
    if (
      !productStoryImages ||
      !Array.isArray(productStoryImages) ||
      productStoryImages.length === 0
    ) {
      console.log("⚠️ storyImages boş veya geçersiz:", productStoryImages);
      return [];
    }

    console.log("🖼️ Ürün için storyImages:", displayName, productStoryImages);

    // storyImages dizisindeki tüm resimleri kullanarak steps oluştur
    const steps = productStoryImages.map((img, index) => {
      const fullImageUrl = ensureFullUrl(img);
      console.log(`📸 Adım ${index + 1}:`, fullImageUrl);

      return {
        img: fullImageUrl,
        text: storyText || "",
      };
    });

    console.log("✅ Oluşturulan steps sayısı:", steps.length);
    return steps;
  }, [productStoryImages, storyText, displayName]);

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
  };

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
          className={`premium-add-btn ${isAdding ? "adding" : ""}`}
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
        steps={journeySteps}
        autoPlay={true}
        intervalMs={3500}
      />
    </div>
  );
}

export default ProductCard;
