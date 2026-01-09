import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import JourneySlider from "../components/JourneySlider";
import apiConfig from "../config/api.js";

function ProductsPage({ category: categoryProp }) {
  const { category: categoryParam } = useParams();
  const category = categoryProp || categoryParam;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching from:", apiConfig.endpoints.products.list);
        const res = await fetch(apiConfig.endpoints.products.list);
        console.log("Fetch response status:", res);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Products received:", data);
        
        // Filter products by category if category is specified
        let filteredProducts = data;
        if (category) {
          const categoryMap = {
            zeytinyagi: ["yağlar", "zeytinyağı", "zeytinyagi", "oil", "zeytin"],
            incir: ["incir", "fig", "figs", "kurutulmuş meyveler", "taze meyveler"],
            "bal-pekmez": ["bal & pekmez", "bal", "pekmez", "honey", "molasses"],
            "kurutulmus-meyveler": ["kurutulmuş meyveler", "kuru incir", "dried fruits"],
            "taze-meyveler": ["taze meyveler", "taze", "fresh fruits"],
            "kurutulmus-sebzeler": ["kurutulmuş sebzeler", "kuru domates", "kuru biber", "dried vegetables"],
            konserveler: ["konserveler", "zeytin", "salça", "preserves"],
            "sut-urunleri": ["süt ürünleri", "peynir", "yumurta", "dairy"],
            "sifali-bitkiler": ["şifalı bitkiler", "adaçayı", "herbal"],
            baharatlar: ["baharatlar", "toz biber", "spices"]
          };
          
          const searchTerms = categoryMap[category.toLowerCase()] || [category.toLowerCase()];
          filteredProducts = data.filter(product => {
            const name = (product.name || "").toLowerCase();
            const description = (product.description || "").toLowerCase();
            const productCategory = (product.category || "").toLowerCase();
            return searchTerms.some(term => 
              name.includes(term) || 
              description.includes(term) || 
              productCategory.includes(term)
            );
          });
        }
        
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Ürünler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <main className="app-container">
        <JourneySlider />
        <h1 className="products-heading">Ürünler</h1>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Yükleniyor...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-container">
        <JourneySlider />
        <h1 className="products-heading">Ürünler</h1>
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          <p>Hata: {error}</p>
          <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
            Backend'in çalıştığından emin olun: http://localhost:5072
          </p>
        </div>
      </main>
    );
  }

  const getCategoryTitle = () => {
    const categoryTitles = {
      "zeytinyagi": "Zeytinyağı",
      "incir": "İncir",
      "bal-pekmez": "Bal & Pekmez",
      "kurutulmus-meyveler": "Kurutulmuş Meyveler",
      "taze-meyveler": "Taze Meyveler",
      "kurutulmus-sebzeler": "Kurutulmuş Sebzeler",
      "konserveler": "Konserveler",
      "sut-urunleri": "Süt Ürünleri",
      "sifali-bitkiler": "Şifalı Bitkiler",
      "baharatlar": "Baharatlar"
    };
    return categoryTitles[category?.toLowerCase()] || "Ürünler";
  };

  return (
    <main className="app-container">
      <JourneySlider />
      <h1 className="products-heading">{getCategoryTitle()}</h1>
      <div className="products-grid">
        {products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            {category ? `${getCategoryTitle()} kategorisinde henüz ürün bulunmamaktadır.` : "Henüz ürün bulunmamaktadır."}
          </p>
        ) : (
          products.map(p => (
            <ProductCard key={p.id} {...p} />
          ))
        )}
      </div>
    </main>
  );
}

export default ProductsPage;
