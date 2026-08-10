import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiMessageCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import apiConfig from "../config/api.js";
import "./EmailLogin.css";

function EmailLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: e-posta adresi, 2: kod doğrulama
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
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

  const validateEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("E-posta adresi gereklidir");
      return false;
    }
    // Basit e-posta format kontrolü (asıl doğrulama backend'de yapılıyor)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Geçerli bir e-posta adresi giriniz");
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

    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setEmailError("");

    try {
      const trimmedEmail = email.trim().toLowerCase();

      const response = await axios.post(
        apiConfig.endpoints.auth.sendCode,
        { email: trimmedEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Doğrulama kodu e-postana gönderildi! 📧");
        setStep(2);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Kod gönderilirken bir hata oluştu. Lütfen tekrar deneyin.";
      toast.error(errorMessage);
      setEmailError(errorMessage);
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
      const trimmedEmail = email.trim().toLowerCase();

      const response = await axios.post(
        apiConfig.endpoints.auth.verifyCode,
        {
          email: trimmedEmail,
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

        // Header gibi bileşenlerin sayfa yenilenmeden auth durumunu anında güncellemesi için
        window.dispatchEvent(new Event("authchange"));

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
    <div className="email-login-page">
      <div className="email-login-card">
        {/* Header */}
        <div className="email-login-header">
          <h1 className="email-login-title">Hesap açmana gerek yok 🎉</h1>
          <p className="email-login-subtitle">
            Sadece e-posta adresini gir, sipariş durumunu buradan gönderelim.
          </p>
        </div>

        {/* Step 1: E-posta Adresi */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="email-login-form">
            <div className="email-input-group">
              <FiMail className="email-input-icon" aria-hidden="true" />
              <input
                type="email"
                id="email"
                className={`email-input ${emailError ? "is-invalid" : ""}`}
                placeholder="ornek@eposta.com"
                value={email}
                onChange={handleEmailChange}
                aria-label="E-posta adresi"
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
                autoComplete="email"
                disabled={loading}
                autoFocus
              />
            </div>
            {emailError && (
              <span id="email-error" className="email-error-text" role="alert">
                {emailError}
              </span>
            )}

            <button
              type="submit"
              className="email-login-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="email-spinner" aria-hidden="true"></span>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <FiMail className="email-btn-icon" />
                  <span>Kodu Gönder</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Kod Doğrulama */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="email-login-form">
            <div className="email-code-info">
              <FiMessageCircle className="email-code-icon" />
              <p className="email-code-text">
                <strong>{email}</strong> adresine gönderilen kodu girin.
                Kodun geçerlilik süresi 10 dakikadır.
              </p>
            </div>
            <p className="email-spam-note">
              📩 Kodu birkaç dakika içinde göremiyorsan, lütfen Gereksiz/Spam klasörünü de kontrol et.
            </p>

            <div className="email-input-group">
              <input
                type="text"
                id="code"
                className={`email-input email-code-input ${codeError ? "is-invalid" : ""}`}
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
              <span id="code-error" className="email-error-text" role="alert">
                {codeError}
              </span>
            )}

            <button
              type="submit"
              className="email-login-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="email-spinner" aria-hidden="true"></span>
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <span className="email-btn-icon">✓</span>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="email-back-btn"
              onClick={() => {
                setStep(1);
                setCode("");
                setCodeError("");
              }}
              disabled={loading}
            >
              ← E-posta adresini değiştir
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmailLogin;
