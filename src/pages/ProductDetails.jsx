import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5072/api/Product/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // TODO: Implement cart logic here
    setTimeout(() => {
      setIsAddingToCart(false);
      // You can add a success message or notification here
    }, 500);
  };

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="product-details-loading">Loading...</div>
      </div>
    );
  }

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
              src={product.imageUrl || placeholder}
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
            
            <h1 className="product-title">{product.name || product.description}</h1>
            
            {product.description && product.description !== product.name && (
              <p className="product-description-text">
                {product.description}
              </p>
            )}
            
            <div className="product-price-section">
              <span className="product-price">${Number(product.price).toFixed(2)}</span>
              {product.stock !== undefined && (
                <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              )}
            </div>
            
            <button
              className={`add-to-cart-button ${isAddingToCart ? 'adding' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart || (product.stock !== undefined && product.stock === 0)}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            {product.stock !== undefined && product.stock > 0 && (
              <div className="product-stock-info">
                {product.stock} item{product.stock !== 1 ? 's' : ''} available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
