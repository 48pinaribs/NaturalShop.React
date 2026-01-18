import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import JourneySlider from "../components/JourneySlider";
import apiConfig from "../config/api.js";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";

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
        const apiUrl = apiConfig.endpoints.products.list;
        console.log("🔍 API URL:", apiUrl);
        console.log("🔍 API Base URL:", apiConfig.API_BASE_URL);

        const res = await fetch(apiUrl);
        console.log("📡 Response Status:", res.status, res.statusText);
        console.log("📡 Response OK:", res.ok);
        console.log(
          "📡 Response Headers:",
          Object.fromEntries(res.headers.entries())
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Error Response Body:", errorText);
          throw new Error(
            `HTTP error! status: ${res.status} - ${res.statusText}`
          );
        }

        const data = await res.json();
        console.log("✅ Products received:", data);
        console.log(
          "✅ Products count:",
          Array.isArray(data) ? data.length : "Not an array"
        );
        console.log("✅ Products data type:", typeof data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("✅ First product:", data[0]);
        }

        // Filter products by category if category is specified
        let filteredProducts = data;
        console.log("🔍 Category:", category);
        console.log(
          "🔍 Original products count:",
          Array.isArray(data) ? data.length : 0
        );

        if (category) {
          const categoryMap = {
            zeytinyagi: ["yağlar", "zeytinyağı", "zeytinyagi", "oil", "zeytin"],
            incir: [
              "incir",
              "fig",
              "figs",
              "kurutulmuş meyveler",
              "taze meyveler",
            ],
            "bal-pekmez": [
              "bal & pekmez",
              "bal",
              "pekmez",
              "honey",
              "molasses",
            ],
            "kurutulmus-meyveler": [
              "kurutulmuş meyveler",
              "kuru incir",
              "dried fruits",
            ],
            "taze-meyveler": ["taze meyveler", "taze", "fresh fruits"],
            "kurutulmus-sebzeler": [
              "kurutulmuş sebzeler",
              "kuru domates",
              "kuru biber",
              "dried vegetables",
            ],
            konserveler: ["konserveler", "zeytin", "salça", "preserves"],
            "sut-urunleri": ["süt ürünleri", "peynir", "yumurta", "dairy"],
            "sifali-bitkiler": ["şifalı bitkiler", "adaçayı", "herbal"],
            baharatlar: ["baharatlar", "toz biber", "spices"],
          };

          const searchTerms = categoryMap[category.toLowerCase()] || [
            category.toLowerCase(),
          ];
          console.log("🔍 Search terms:", searchTerms);
          filteredProducts = data.filter((product) => {
            const name = (product.name || "").toLowerCase();
            const description = (product.description || "").toLowerCase();
            const productCategory = (product.category || "").toLowerCase();
            return searchTerms.some(
              (term) =>
                name.includes(term) ||
                description.includes(term) ||
                productCategory.includes(term)
            );
          });
          console.log("🔍 Filtered products count:", filteredProducts.length);
        }

        console.log("✅ Setting products:", filteredProducts.length);
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
        <div className="products-grid">
          {/* 8 adet hayalet kart oluşturuyoruz */}
          {Array.from(new Array(8)).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-container">
        <JourneySlider />
        <h1 className="products-heading">Ürünler</h1>
        <div style={{ textAlign: "center", padding: "2rem", color: "#d32f2f" }}>
          <p>⚠️ Bir sorun oluştu: {error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </main>
    );
  }

  const getCategoryTitle = () => {
    const categoryTitles = {
      zeytinyagi: "Zeytinyağı",
      incir: "İncir",
      "bal-pekmez": "Bal & Pekmez",
      "kurutulmus-meyveler": "Kurutulmuş Meyveler",
      "taze-meyveler": "Taze Meyveler",
      "kurutulmus-sebzeler": "Kurutulmuş Sebzeler",
      konserveler: "Konserveler",
      "sut-urunleri": "Süt Ürünleri",
      "sifali-bitkiler": "Şifalı Bitkiler",
      baharatlar: "Baharatlar",
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
            {category
              ? `${getCategoryTitle()} kategorisinde henüz ürün bulunmamaktadır.`
              : "Henüz ürün bulunmamaktadır."}
          </p>
        ) : (
          products.map((p) => <ProductCard key={p.id} {...p} />)
        )}
      </div>
    </main>
  );
}

export default ProductsPage;
