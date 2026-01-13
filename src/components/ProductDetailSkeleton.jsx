import React from "react";
import { Box, Skeleton, Container, Grid } from "@mui/material";

const ProductDetailSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Taraf: Büyük Ürün Resmi */}
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={500}
            sx={{ borderRadius: 4 }}
            animation="wave"
          />
        </Grid>

        {/* Sağ Taraf: Ürün Bilgileri */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="text" width="30%" height={30} animation="wave" />{" "}
            {/* Kategori */}
            <Skeleton
              variant="text"
              width="90%"
              height={60}
              animation="wave"
            />{" "}
            {/* Başlık */}
            <Skeleton
              variant="text"
              width="100%"
              height={100}
              animation="wave"
            />{" "}
            {/* Açıklama */}
            <Box sx={{ mt: 4, display: "flex", gap: 2, alignItems: "center" }}>
              <Skeleton
                variant="text"
                width="40%"
                height={50}
                animation="wave"
              />{" "}
              {/* Fiyat */}
              <Skeleton
                variant="rounded"
                width="20%"
                height={30}
                animation="wave"
              />{" "}
              {/* Stok Durumu */}
            </Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={55}
              sx={{ borderRadius: "25px", mt: 4 }}
              animation="wave"
            />{" "}
            {/* Buton */}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailSkeleton;
