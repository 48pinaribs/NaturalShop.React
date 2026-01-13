import React from "react";
import { Box, Skeleton, Container, Grid, Paper } from "@mui/material";

const ProductDetailSkeleton = () => {
  return (
    <Box className="product-details-container" sx={{ py: { xs: 2, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Sayfanın genel kart yapısını taklit eden Paper */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            background: "#fff",
          }}
        >
          <Grid container spacing={6}>
            {/* SOL TARAF: Ürün Görseli */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  sx={{
                    aspectRatio: "1/1", // Kare formu korur
                    borderRadius: "20px",
                    backgroundColor: "#f9f9f9",
                  }}
                  animation="wave"
                />
              </Box>
            </Grid>

            {/* SAĞ TARAF: Ürün Bilgileri */}
            <Grid item xs={12} md={6}>
              <Box sx={{ py: 2 }}>
                {/* Üst Kategori Rozeti */}
                <Skeleton
                  variant="rounded"
                  width="100px"
                  height={24}
                  sx={{
                    borderRadius: "12px",
                    mb: 3,
                    backgroundColor: "#f0f0f0",
                  }}
                  animation="wave"
                />

                {/* Başlık (İki Satırlı Olabilir) */}
                <Skeleton
                  variant="text"
                  width="90%"
                  height={50}
                  animation="wave"
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={50}
                  animation="wave"
                  sx={{ mb: 4 }}
                />

                {/* Fiyat ve Stok Durumu Yan Yana */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  <Skeleton
                    variant="text"
                    width="120px"
                    height={45}
                    animation="wave"
                  />
                  <Skeleton
                    variant="rounded"
                    width="80px"
                    height={24}
                    sx={{ borderRadius: "6px" }}
                    animation="wave"
                  />
                </Box>

                {/* Açıklama Metni (Paragraf Yapısı) */}
                <Box sx={{ mb: 5 }}>
                  <Skeleton variant="text" width="100%" animation="wave" />
                  <Skeleton variant="text" width="100%" animation="wave" />
                  <Skeleton variant="text" width="80%" animation="wave" />
                </Box>

                {/* Büyük Sepete Ekle Butonu */}
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={56}
                  sx={{ borderRadius: "28px", backgroundColor: "#f0f0f0" }}
                  animation="wave"
                />

                {/* Stok Adedi Bilgisi */}
                <Skeleton
                  variant="text"
                  width="150px"
                  height={20}
                  sx={{ mt: 2, mx: "auto" }}
                  animation="wave"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductDetailSkeleton;
