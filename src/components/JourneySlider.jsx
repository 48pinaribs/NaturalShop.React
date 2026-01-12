import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./JourneySlider.css";

const steps = [
  {
    text: "",
    img: "/images/journey_sliders/jour_sli1.jpeg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli2.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli3.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli4.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli5.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli6.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli7.jpg",
  },
  {
    text: "Köyümüzden sofralarınıza, doğanın en saf haliyle ulaşır.",
    img: "/images/journey_sliders/jour_sli8.jpeg",
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
