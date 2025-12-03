import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./JourneySlider.css";

const steps = [
  {
    text: "Dalaman Gürleyk köyünün bereketli topraklarında başlar…",
    img: "/images/journey_sliders/jour_sli1.png",
  },
  {
    text: "Zeytin ağaçları, incir bahçeleri, çam ormanları ve bağlarda doğal olarak yetişir…",
    img: "/images/journey_sliders/jour_sli2.png",
  },
  {
    text: "Güneş, hava, su… Hiçbir kimyasal katkı maddesi olmadan, doğanın kendi dengesi.",
    img: "/images/journey_sliders/jour_sli3.png",
  },
  {
    text: "Geleneksel yöntemlerle işlenir: Soğuk sıkım zeytinyağı, güneşte kurutma, taş değirmende öğütme…",
    img: "/images/journey_sliders/jour_sli4.png",
  },
  {
    text: "Köydeki ustaların elinde özenle hazırlanır ve paketlenir.",
    img: "/images/journey_sliders/jour_sli5.png",
  },
  {
    text: "Dalaman'dan sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli6.png",
  }
];

export default function JourneySlider() {
  return (
    <section className="journey-slider-section" aria-label="Ürün yolculuğu">
      <div className="journey-wrapper">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop
          autoplay={{ 
            delay: 3000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'journey-pagination-bullet',
            bulletActiveClass: 'journey-pagination-bullet-active',
            renderBullet: (index, className) => {
              return `<span class="${className}"><span class="journey-pagination-dot"></span></span>`;
            }
          }}
          speed={1000}
          className="journey-swiper"
        >
          {steps.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="journey-slide" style={{ backgroundImage: `url(${item.img})` }}>
                <div className="journey-overlay"></div>
                <div className="journey-content">
                  <div className="journey-icon">{item.icon}</div>
                  <p className="journey-text">{item.text}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
