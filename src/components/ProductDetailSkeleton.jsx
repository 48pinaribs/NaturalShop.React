import React from "react";
import { Skeleton } from "@mui/material";

const ProductDetailSkeleton = () => {
  return (
    // Senin mevcut CSS sınıflarını kullanıyoruz
    <div className="product-details-container">
      <div className="product-details-card">
        {/* SOL: Resim Alanı */}
        <div className="product-image-section">
          <div className="product-image-wrapper">
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                minHeight: { xs: "300px", md: "500px" },
                borderRadius: "15px",
              }}
              animation="wave"
            />
          </div>
        </div>

        {/* SAĞ: Bilgi Alanı */}
        <div className="product-info-section">
          <div className="product-info-content">
            {/* Kategori Rozeti */}
            <Skeleton
              variant="rounded"
              width="80px"
              height={20}
              sx={{ mb: 2, borderRadius: "4px" }}
              animation="wave"
            />

            {/* Başlık */}
            <Skeleton
              variant="text"
              width="90%"
              height={60}
              sx={{ mb: 1 }}
              animation="wave"
            />

            {/* Açıklama Yazısı */}
            <div style={{ marginBottom: "2rem" }}>
              <Skeleton variant="text" width="100%" animation="wave" />
              <Skeleton variant="text" width="100%" animation="wave" />
              <Skeleton variant="text" width="60%" animation="wave" />
            </div>

            {/* Fiyat ve Stok */}
            <div className="product-price-section">
              <Skeleton
                variant="text"
                width="100px"
                height={45}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                width="80px"
                height={25}
                sx={{ borderRadius: "12px" }}
                animation="wave"
              />
            </div>

            {/* Senin Butonunun Şeklinde Skeleton */}
            <div style={{ marginTop: "20px" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={54}
                sx={{ borderRadius: "30px" }} // premium-btn yuvarlaklığı
                animation="wave"
              />
            </div>

            {/* Alt Stok Bilgisi */}
            <Skeleton
              variant="text"
              width="140px"
              height={20}
              sx={{ mt: 2, mx: "auto" }}
              animation="wave"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
