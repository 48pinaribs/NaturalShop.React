import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Keyboard,
} from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductJourneyModal = ({
  open,
  onClose,
  productName = "Ürün",
  steps = [],
  autoPlay = true,
  intervalMs = 3500,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  
  console.log("open", open);
  console.log("steps", steps);
  // Debug: Modal açıldığında adımları kontrol et
  useEffect(() => {
    if (open) {
      console.log("🔍 ProductJourneyModal açıldı:", {
        productName,
        stepsCount: steps.length,
        steps: steps.map((s, i) => ({ index: i, img: s.img, title: s.title }))
      });
      // Resim yollarını kontrol et
      steps.forEach((step, index) => {
        const img = new Image();
        img.onload = () => console.log(`✅ Resim mevcut: ${step.img}`, index);
        img.onerror = () => console.error(`❌ Resim bulunamadı: ${step.img}`, index);
        img.src = step.img;
      });
    }
  }, [open, productName, steps]);

  const handleImageLoad = (index) => {
    console.log(`✅ Resim yüklendi: ${steps[index]?.img}`, index);
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index, event) => {
    const imgSrc = steps[index]?.img;
    console.error(`❌ Resim yüklenemedi: ${imgSrc}`, index, event);
    setImageError((prev) => ({ ...prev, [index]: true }));
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handlePrevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // Modal açıldığında Swiper state'ini güncelle
  useEffect(() => {
    if (open && swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [open]);

  const placeholderImage = "https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi";

  // Modal kapatma işlemi - sadece ESC tuşu veya kapat butonu ile kapanır
  const handleClose = (event, reason) => {
    // Backdrop'e tıklandığında modal kapanmasın
    if (reason === "backdropClick") {
      return;
    }
    // ESC tuşu veya kapat butonu ile kapanabilir
    onClose();
  };

  const slideVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: { xs: "95vh", sm: "90vh" },
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: theme.palette.mode === "dark" 
            ? theme.palette.background.paper 
            : "#ffffff",
        },
        onClick: (e) => e.stopPropagation(),
        onMouseDown: (e) => e.stopPropagation(),
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 1.5, sm: 2 },
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            flex: 1,
            textAlign: "center",
            px: { xs: 3, sm: 4 },
            fontSize: { xs: "1.1rem", sm: "1.5rem" },
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {productName} Yolculuğu
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Kapat"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              transform: "rotate(90deg)",
            },
            transition: "transform 0.3s ease",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Dialog Content */}
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        sx={{
          p: 0,
          position: "relative",
          overflow: "visible",
          maxHeight: { xs: "calc(90vh - 80px)", sm: "none" },
          overflowY: { xs: "auto", sm: "visible" },
          "&.MuiDialogContent-root": {
            padding: 0,
            overflow: { xs: "auto", sm: "visible" },
            position: "relative",
            maxHeight: { xs: "calc(90vh - 80px)", sm: "none" },
          },
        }}
      >
        {/* Custom Navigation Buttons */}
        {!isMobile && steps.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevSlide}
              disabled={isBeginning}
              sx={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                width: 48,
                height: 48,
                boxShadow: theme.shadows[6],
                pointerEvents: "auto",
                cursor: isBeginning ? "not-allowed" : "pointer",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover:not(:disabled)": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: theme.shadows[12],
                },
                "&:disabled": {
                  opacity: 0.3,
                  cursor: "not-allowed",
                  pointerEvents: "none",
                },
                transition: "all 0.3s ease",
              }}
              aria-label="Önceki"
            >
              <ArrowBackIos sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton
              onClick={handleNextSlide}
              disabled={isEnd}
              sx={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                width: 48,
                height: 48,
                boxShadow: theme.shadows[6],
                pointerEvents: "auto",
                cursor: isEnd ? "not-allowed" : "pointer",
                border: `1px solid ${theme.palette.divider}`,
                "&:hover:not(:disabled)": {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  transform: "translateY(-50%) scale(1.1)",
                  boxShadow: theme.shadows[12],
                },
                "&:disabled": {
                  opacity: 0.3,
                  cursor: "not-allowed",
                  pointerEvents: "none",
                },
                transition: "all 0.3s ease",
              }}
              aria-label="Sonraki"
            >
              <ArrowForwardIos sx={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            "& .swiper": {
              paddingBottom: { xs: 3, sm: 4 },
              overflow: "visible",
              position: "relative",
            },
            "& .swiper-wrapper": {
              overflow: "visible",
            },
            "& .swiper-pagination": {
              bottom: { xs: 4, sm: 8 },
              zIndex: 10,
              position: "relative",
              marginTop: { xs: 1, sm: 0 },
            },
            "& .swiper-pagination-bullet": {
              width: 8,
              height: 8,
              backgroundColor: theme.palette.mode === "dark" 
                ? "rgba(255, 255, 255, 0.5)" 
                : "rgba(0, 0, 0, 0.3)",
              opacity: 1,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
              },
            },
            "& .swiper-pagination-bullet-active": {
              backgroundColor: theme.palette.primary.main,
              width: 24,
              borderRadius: 4,
            },
          }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            modules={[Navigation, Pagination, Autoplay, Keyboard]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={false}
            pagination={{ 
              clickable: true,
              dynamicBullets: false,
            }}
            autoplay={
              autoPlay
                ? {
                    delay: intervalMs,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }
                : false
            }
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            loop={false}
            speed={600}
            allowTouchMove={true}
            watchOverflow={true}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: { xs: 1.5, sm: 3 },
                    pb: { xs: 3, sm: 3 },
                    minHeight: "fit-content",
                  }}
                >
                  {/* Image Container */}
                  <Box
                    sx={{
                      width: "100%",
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      mb: { xs: 1.5, sm: 2 },
                      height: { xs: 180, sm: 350 },
                      backgroundColor: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.05)" 
                        : "rgba(0, 0, 0, 0.05)",
                      boxShadow: theme.shadows[4],
                      flexShrink: 0,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {!imageLoaded[index] && !imageError[index] && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            animation="wave"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.img
                      src={imageError[index] ? placeholderImage : step.img}
                      alt={step.title || `Adım ${index + 1}`}
                      loading="lazy"
                      onLoad={() => handleImageLoad(index)}
                      onError={(e) => handleImageError(index, e)}
                      variants={slideVariants}
                      initial="initial"
                      animate={imageLoaded[index] ? "animate" : "initial"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: imageLoaded[index] || imageError[index] ? "block" : "none",
                        opacity: imageLoaded[index] ? 1 : 0,
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <motion.div
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    style={{ width: "100%", textAlign: "center" }}
                  >
                    {step.title && (
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: { xs: 0.75, sm: 1 },
                          color: theme.palette.text.primary,
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          hyphens: "auto",
                          px: { xs: 1, sm: 0 },
                        }}
                      >
                        {step.title}
                      </Typography>
                    )}

                    <Typography
                      variant="body1"
                      sx={{
                        mb: step.meta ? { xs: 0.75, sm: 1 } : 0,
                        color: theme.palette.text.secondary,
                        lineHeight: { xs: 1.5, sm: 1.7 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        hyphens: "auto",
                        px: { xs: 1, sm: 0 },
                      }}
                    >
                      {step.text}
                    </Typography>

                    {step.meta && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: { xs: 0.75, sm: 1 },
                          color: theme.palette.text.disabled,
                          fontStyle: "italic",
                          fontSize: { xs: "0.7rem", sm: "0.75rem" },
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          px: { xs: 1, sm: 0 },
                        }}
                      >
                        {step.meta}
                      </Typography>
                    )}
                  </motion.div>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductJourneyModal;
