import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./ProductDetails.css";
import apiConfig from "../config/api.js";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";

// URL'nin tam URL olup olmadığını kontrol eden helper fonksiyon
const ensureFullUrl = (url) => {
  if (!url) return "";
  // Eğer zaten tam URL ise (http:// veya https:// ile başlıyorsa) olduğu gibi döndür
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Değilse sunucunun kök adresini ekle (ortama göre .env üzerinden gelir)
  // URL'nin başındaki / karakterini kaldır (varsa)
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${apiConfig.SERVER_BASE_URL}/${cleanUrl}`;
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(apiConfig.endpoints.products.detail(id))
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      setIsAddingToCart(true);
      addToCart(product);
      toast.success("Ürün sepete eklendi 🛒");
      setTimeout(() => {
        setIsAddingToCart(false);
        navigate("/cart");
      }, 800);
    }
  };

  if (!product) {
    return <ProductDetailSkeleton />;
  }

  // Hem camelCase hem PascalCase destekle (API'den gelen veriye göre)
  // Ana sayfada görünen resmi kullan (ProductCard ile aynı mantık)
  const productImageUrl =
    product.imageUrl ||
    product.ImageUrl ||
    product.image ||
    (product.Images && product.Images.length > 0 ? product.Images[0] : null);

  const imageSrc = ensureFullUrl(productImageUrl || "");

  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial, Helvetica, sans-serif" font-size="18">No Image</text>
      </svg>`
    );

  const handleImageError = (e) => {
    if (e.target.src !== placeholder) {
      e.target.src = placeholder;
    }
  };

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-image-section">
          <div className="product-image-wrapper">
            <img
              src={imageSrc || placeholder}
              alt={product.name || product.description}
              className="product-main-image"
              onError={handleImageError}
            />
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-info-content">
            {product.category && (
              <div className="product-category">{product.category}</div>
            )}

            <h1 className="product-title">
              {product.name || product.description}
            </h1>

            {product.description && product.description !== product.name && (
              <p className="product-description-text">{product.description}</p>
            )}

            <div className="product-price-section">
              <span className="product-price">
                ₺{Number(product.price).toFixed(2)}
              </span>
              {product.stock !== undefined && (
                <span
                  className={`product-stock ${
                    product.stock > 0 ? "in-stock" : "out-of-stock"
                  }`}
                >
                  {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
                </span>
              )}
            </div>

            <button
              className={`premium-btn premium-btn-secondary ${
                isAddingToCart ? "adding" : ""
              }`}
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                (product.stock !== undefined && product.stock === 0)
              }
            >
              <span className="premium-btn-content">
                <span className="premium-btn-icon">🍃</span>
                <span className="premium-btn-text">
                  {isAddingToCart ? "Ekleniyor..." : "Sepete Ekle"}
                </span>
              </span>
            </button>

            {product.stock !== undefined && product.stock > 0 && (
              <div className="product-stock-info">
                {product.stock} adet stokta mevcut
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
