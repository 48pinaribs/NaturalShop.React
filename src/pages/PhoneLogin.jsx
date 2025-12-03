import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import apiConfig from "../config/api.js";
import "./PhoneLogin.css";

function PhoneLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: telefon numarası, 2: kod doğrulama
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [codeError, setCodeError] = useState("");

  // Telefon numarası formatlaması (5xx xxx xx xx)
  const formatPhoneNumber = (value) => {
    // Sadece rakamları al
    const numbers = value.replace(/\D/g, "");
    
    // Maksimum 10 rakam
    const limitedNumbers = numbers.slice(0, 10);
    
    // Formatla: 5xx xxx xx xx
    if (limitedNumbers.length === 0) return "";
    if (limitedNumbers.length <= 3) return limitedNumbers;
    if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)} ${limitedNumbers.slice(3)}`;
    }
    if (limitedNumbers.length <= 8) {
      return `${limitedNumbers.slice(0, 3)} ${limitedNumbers.slice(3, 6)} ${limitedNumbers.slice(6)}`;
    }
    return `${limitedNumbers.slice(0, 3)} ${limitedNumbers.slice(3, 6)} ${limitedNumbers.slice(6, 8)} ${limitedNumbers.slice(8)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    if (phoneError) {
      setPhoneError("");
    }
  };

  const handleCodeChange = (e) => {
    // Sadece rakamlar, maksimum 6 karakter
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    if (codeError) {
      setCodeError("");
    }
  };

  const validatePhone = () => {
    const numbers = phoneNumber.replace(/\D/g, "");
    if (!numbers || numbers.length === 0) {
      setPhoneError("Telefon numarası gereklidir");
      return false;
    }
    if (numbers.length < 10) {
      setPhoneError("Geçerli bir telefon numarası giriniz");
      return false;
    }
    return true;
  };

  const validateCode = () => {
    if (!code || code.length === 0) {
      setCodeError("Doğrulama kodu gereklidir");
      return false;
    }
    if (code.length < 4) {
      setCodeError("Doğrulama kodu en az 4 haneli olmalıdır");
      return false;
    }
    return true;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!validatePhone()) {
      return;
    }

    setLoading(true);
    setPhoneError("");

    try {
      // Telefon numarasını temizle (sadece rakamlar)
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      // Eğer 10 haneli ise başına 90 ekle (Türkiye kodu)
      const phoneWithCountryCode = cleanPhone.length === 10 ? `90${cleanPhone}` : cleanPhone;

      const response = await axios.post(
        apiConfig.endpoints.auth.sendCode,
        { phoneNumber: phoneWithCountryCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Doğrulama kodu gönderildi! 📱");
        setStep(2);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      toast.error(errorMessage);
      setPhoneError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!validateCode()) {
      return;
    }

    setLoading(true);
    setCodeError("");

    try {
      // Telefon numarasını temizle
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const phoneWithCountryCode = cleanPhone.length === 10 ? `90${cleanPhone}` : cleanPhone;

      const response = await axios.post(
        apiConfig.endpoints.auth.verifyCode,
        {
          phoneNumber: phoneWithCountryCode,
          code: code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem("token", response.data.token);
        
        // Kullanıcı bilgisi varsa kaydet
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        toast.success("Giriş başarılı! 🎉");
        
        // Ödeme sayfasına yönlendir
        setTimeout(() => {
          navigate("/checkout");
        }, 500);
      } else {
        throw new Error("Token alınamadı");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Kod doğrulanamadı. Lütfen tekrar deneyin.";
      toast.error(errorMessage);
      setCodeError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-login-page">
      <div className="phone-login-card">
        {/* Header */}
        <div className="phone-login-header">
          <h1 className="phone-login-title">Hesap açmana gerek yok 🎉</h1>
          <p className="phone-login-subtitle">
            Sadece WhatsApp numaranı gir, sipariş durumunu buradan gönderelim.
          </p>
        </div>

        {/* Step 1: Telefon Numarası */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="phone-login-form">
            <div className="phone-input-group">
              <FiPhone className="phone-input-icon" aria-hidden="true" />
              <input
                type="tel"
                id="phoneNumber"
                className={`phone-input ${phoneError ? "is-invalid" : ""}`}
                placeholder="5xx xxx xx xx"
                value={phoneNumber}
                onChange={handlePhoneChange}
                aria-label="Telefon numarası"
                aria-invalid={phoneError ? "true" : "false"}
                aria-describedby={phoneError ? "phone-error" : undefined}
                autoComplete="tel"
                disabled={loading}
                maxLength={14} // 5xx xxx xx xx formatı için
              />
            </div>
            {phoneError && (
              <span id="phone-error" className="phone-error-text" role="alert">
                {phoneError}
              </span>
            )}

            <button
              type="submit"
              className="phone-login-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="phone-spinner" aria-hidden="true"></span>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <FaWhatsapp className="phone-btn-icon" />
                  <span>Kodu Gönder</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Kod Doğrulama */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="phone-login-form">
            <div className="phone-code-info">
              <FiMessageCircle className="phone-code-icon" />
              <p className="phone-code-text">
                <strong>{phoneNumber}</strong> numarasına gönderilen kodu girin
              </p>
            </div>

            <div className="phone-input-group">
              <input
                type="text"
                id="code"
                className={`phone-input phone-code-input ${codeError ? "is-invalid" : ""}`}
                placeholder="Doğrulama kodu"
                value={code}
                onChange={handleCodeChange}
                aria-label="Doğrulama kodu"
                aria-invalid={codeError ? "true" : "false"}
                aria-describedby={codeError ? "code-error" : undefined}
                autoComplete="one-time-code"
                disabled={loading}
                maxLength={6}
                autoFocus
              />
            </div>
            {codeError && (
              <span id="code-error" className="phone-error-text" role="alert">
                {codeError}
              </span>
            )}

            <button
              type="submit"
              className="phone-login-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="phone-spinner" aria-hidden="true"></span>
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <span className="phone-btn-icon">✓</span>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="phone-back-btn"
              onClick={() => {
                setStep(1);
                setCode("");
                setCodeError("");
              }}
              disabled={loading}
            >
              ← Telefon numarasını değiştir
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PhoneLogin;

