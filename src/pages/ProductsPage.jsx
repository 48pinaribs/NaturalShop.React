import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5072/api/Product")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <main className="app-container">
      <h1 className="products-heading">Products</h1>
      <div className="products-grid">
        {products.map(p => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </main>
  );
}

export default ProductsPage;
