import React from "react";
import "./Terms.css";

// Not: Register.jsx'teki "Kullanım koşullarını kabul ediyorum" onay kutusu
// zorunlu ama daha önce hiçbir sayfaya bağlı değildi (/terms rotası yoktu,
// tıklayan kullanıcı 404 görüyordu). Bu, o linkin gittiği gerçek sayfa —
// genel/standart bir e-ticaret kullanım koşulları metni içeriyor.
const Terms = () => {
  return (
    <main className="app-container">
      <div className="terms-page">
        <h1 className="terms-title">Kullanım Koşulları</h1>
        <p className="terms-updated">Son güncelleme: Ağustos 2026</p>

        <section className="terms-section">
          <h2>1. Genel Hükümler</h2>
          <p>
            Köyümüzden Sofranıza web sitesini ("Site") kullanarak veya
            üzerinden alışveriş yaparak bu kullanım koşullarını kabul etmiş
            sayılırsınız. Site, doğal ve geleneksel yöntemlerle üretilen gıda
            ürünlerinin satışını yapmaktadır.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Üyelik ve Hesap</h2>
          <p>
            Sipariş verebilmek için Site üzerinden bir hesap oluşturmanız
            gerekir. Hesabınızla ilgili bilgilerin doğruluğundan ve
            hesabınızın güvenliğinden siz sorumlusunuz.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Sipariş ve Ödeme</h2>
          <p>
            Siparişler, Site üzerinde gösterilen fiyat ve stok bilgilerine
            göre oluşturulur. Ödeme, kapıda ödeme (nakit/kredi kartı) veya
            Site üzerinden güvenli online kredi kartı ödemesi (Iyzico
            altyapısı ile) yöntemleriyle yapılabilir. Stok tükenmesi
            durumunda sipariş tarafımızca iptal edilebilir ve varsa tahsil
            edilen tutar iade edilir.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Teslimat</h2>
          <p>
            Siparişler, belirtilen teslimat adresine kargo ile gönderilir.
            Teslimat süreleri tahmini olup bölgeye göre değişiklik
            gösterebilir.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. İptal ve İade</h2>
          <p>
            Siparişinizi kargoya verilmeden önce iptal edebilirsiniz. Ürün
            teslim alındıktan sonraki iade talepleri için bizimle{" "}
            <a href="/contact">iletişim</a> sayfasından ulaşabilirsiniz.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Gizlilik</h2>
          <p>
            Sipariş sürecinde paylaştığınız ad, adres, telefon ve e-posta
            bilgileri yalnızca siparişinizin işleme alınması ve size
            ulaşılabilmesi amacıyla kullanılır, üçüncü taraflarla
            paylaşılmaz.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. İletişim</h2>
          <p>
            Kullanım koşulları hakkında sorularınız için{" "}
            <a href="/contact">İletişim</a> sayfasındaki bilgilerden bize
            ulaşabilirsiniz.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Terms;
