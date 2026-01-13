import React from 'react';
import { Box, Skeleton, Card, Grid } from '@mui/material';

/**
 * Ürün kartlarının yüklenme aşamasında gösterilecek 
 * Hayalet Ekran (Skeleton) bileşeni.
 */
const ProductCardSkeleton = () => {
  return (
    <Card 
      sx={{ 
        width: '100%', 
        borderRadius: '16px', // Senin tasarımındaki yumuşak köşelerle uyumlu
        overflow: 'hidden', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        background: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Üst Kısım: Ürün Resim Alanı */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={250} 
        animation="wave" 
        sx={{ bgcolor: 'grey.100' }}
      />

      <Box sx={{ p: 2, flexGrow: 1 }}>
        {/* Ürün Adı */}
        <Skeleton 
          variant="text" 
          width="70%" 
          height={30} 
          animation="wave" 
          sx={{ mb: 1 }}
        />
        
        {/* Fiyat ve Küçük Rozet Yan Yana */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width="25%" height={25} animation="wave" />
          <Skeleton 
            variant="rounded" 
            width="35%" 
            height={20} 
            animation="wave" 
            sx={{ borderRadius: '12px' }} 
          />
        </Box>

        {/* Sepete Ekle Butonu */}
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={48} 
          animation="wave" 
          sx={{ borderRadius: '25px', mt: 'auto' }} 
        />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;