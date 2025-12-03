import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Her sayfa değiştiğinde sayfanın en üstüne scroll yapar
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde en üste scroll yap
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Anında scroll, animasyon yok
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;

