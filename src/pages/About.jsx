import React from "react";
import JourneySlider from "../components/JourneySlider";
import { FiMapPin, FiHeart, FiUsers } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <main className="app-container">
      <JourneySlider />
      
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">Hakkımızda</h1>
            <p className="about-subtitle">
              Dalaman Gürleyk köyünden sofranıza, doğal üretim ile organik yaşam
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story">
          <div className="about-story-content">
            <div className="about-story-text">
              <h2 className="section-title">Hikayemiz</h2>
              <p className="story-paragraph">
                Köyümüzden Sofranıza, Muğla'nın Dalaman ilçesine bağlı Gürleyk köyünden doğan bir tutkudur. 
                Yüzyıllardır süren geleneksel üretim yöntemlerini koruyarak, doğanın en saf halini sofralarınıza 
                taşıyoruz.
              </p>
              <p className="story-paragraph">
                Her ürünümüz, köyümüzün bereketli topraklarında yetişir. Hiçbir kimyasal katkı maddesi, 
                koruyucu veya işleme tabi tutulmadan, tamamen doğal yöntemlerle hazırlanır. Amacımız, 
                atalarımızdan kalan geleneksel bilgiyi gelecek nesillere aktarmak ve doğal beslenmenin 
                önemini herkese hatırlatmaktır.
              </p>
            </div>
            <div className="about-story-image">
              <div className="story-image-placeholder">
                <FaLeaf className="story-icon" />
                <span>Doğal Üretim</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <h2 className="section-title">Değerlerimiz</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3 className="value-title">Doğallık</h3>
              <p className="value-description">
                Tüm ürünlerimiz tamamen doğal yöntemlerle üretilir. Hiçbir kimyasal katkı maddesi kullanılmaz.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiHeart />
              </div>
              <h3 className="value-title">Geleneksel Üretim</h3>
              <p className="value-description">
                Atalarımızdan kalan geleneksel yöntemleri koruyarak, her ürünü özenle hazırlıyoruz.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiMapPin />
              </div>
              <h3 className="value-title">Yerel Üretim</h3>
              <p className="value-description">
                Dalaman Gürleyk köyünden, köyümüzün bereketli topraklarında yetişen ürünler.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FiUsers />
              </div>
              <h3 className="value-title">Güven</h3>
              <p className="value-description">
                Müşterilerimizle kurduğumuz güven ilişkisi, işimizin temel taşıdır.
              </p>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="about-location">
          <div className="location-content">
            <div className="location-info">
              <h2 className="section-title">Neredeyiz?</h2>
              <p className="location-text">
                Muğla'nın Dalaman ilçesine bağlı Gürleyk köyünde, doğanın içinde, geleneksel yöntemlerle 
                üretim yapıyoruz. Köyümüzün zengin toprakları ve temiz havası, ürünlerimizin kalitesini 
                belirleyen en önemli faktörlerdir.
              </p>
              <div className="location-details">
                <div className="location-item">
                  <FiMapPin className="location-icon" />
                  <span>Muğla, Dalaman, Gürleyk Köyü</span>
                </div>
              </div>
            </div>
            <div className="location-map">
              <div className="map-placeholder">
                <FiMapPin className="map-icon" />
                <span>Harita</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="mission-content">
            <h2 className="section-title">Misyonumuz</h2>
            <p className="mission-text">
              Doğal ve organik ürünleri, geleneksel yöntemlerle üretip sofralarınıza ulaştırmak. 
              Köyümüzün zengin kültürel mirasını koruyarak, gelecek nesillere aktarmak ve sağlıklı 
              beslenmenin önemini herkese hatırlatmak.
            </p>
            <p className="mission-text">
              Her ürünümüz, sevgi ve özenle hazırlanır. Doğanın bize sunduğu nimetleri, en saf haliyle 
              sizlere sunmak için çalışıyoruz. Köyümüzden sofranıza uzanan bu yolculukta, sizleri de 
              aramızda görmekten mutluluk duyarız.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default About;

