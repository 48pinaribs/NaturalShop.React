import { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./Register.css";
import apiConfig from "../config/api.js";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Password strength checker
  const checkPasswordStrength = (pwd) => {
    if (!pwd) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };

    Object.values(checks).forEach((check) => {
      if (check) strength++;
    });

    if (strength <= 2) {
      setPasswordStrength("weak");
    } else if (strength === 3) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  // Validation functions
  const validateFullName = (value) => {
    if (!value) {
      return "Ad Soyad gereklidir";
    }
    if (value.trim().length < 2) {
      return "Ad Soyad en az 2 karakter olmalıdır";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value) {
      return "E-posta adresi gereklidir";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Geçerli bir e-posta adresi giriniz";
    }
    return "";
  };

  const validatePassword = (value) => {
    if (!value) {
      return "Şifre gereklidir";
    }
    if (value.length < 8) {
      return "Şifre en az 8 karakter olmalıdır";
    }
    if (!/[A-Z]/.test(value)) {
      return "Şifre en az 1 büyük harf içermelidir";
    }
    if (!/[a-z]/.test(value)) {
      return "Şifre en az 1 küçük harf içermelidir";
    }
    if (!/[0-9]/.test(value)) {
      return "Şifre en az 1 rakam içermelidir";
    }
    return "";
  };

  const validateConfirmPassword = (value, pwd) => {
    if (!value) {
      return "Şifre tekrarı gereklidir";
    }
    if (value !== pwd) {
      return "Şifreler eşleşmiyor";
    }
    return "";
  };

  // Handlers
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (fullNameError) {
      setFullNameError(validateFullName(value));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
    // Re-validate confirm password if it has a value
    if (confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, value));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (confirmPasswordError) {
      setConfirmPasswordError(validateConfirmPassword(value, password));
    }
  };

  const handleBlur = (field) => {
    if (field === "fullName") {
      setFullNameError(validateFullName(fullName));
    } else if (field === "email") {
      setEmailError(validateEmail(email));
    } else if (field === "password") {
      setPasswordError(validatePassword(password));
    } else if (field === "confirmPassword") {
      setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate all fields
    const fullNameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword, password);

    setFullNameError(fullNameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);

    // Check terms
    if (!termsAccepted) {
      setError("Kullanım koşullarını kabul etmelisiniz");
      return;
    }

    if (fullNameErr || emailErr || passwordErr || confirmPasswordErr) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiConfig.endpoints.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) {
        // Try to get error message from response
        let errorMessage = "Kayıt işlemi başarısız oldu!";
        try {
          const errorData = await res.json();
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors
              .map((e) => e.description || e.code || e)
              .join(", ");
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response is not JSON, try to get text
          try {
            const errorText = await res.text();
            if (errorText) errorMessage = errorText;
          } catch {
            // Use default message
          }
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Success - API returns a string, so we don't need to parse JSON
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
      
      // Redirect to login after 1 second
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err) {
      console.error("Register error:", err);
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  // Fade-in animation on mount
  useEffect(() => {
    const card = document.querySelector(".register-card");
    if (card) {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      setTimeout(() => {
        card.style.transition = "opacity 300ms ease, transform 300ms ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 10);
    }
  }, []);

  return (
    <div className="register-page">
      <div className="register-card">
        {/* Brand Area */}
        <div className="register-brand">
          <h1 className="brand-text">Köyümüzden Sofranıza</h1>
        </div>

        {/* Header */}
        <div className="register-header">
          <h2 className="form-title">Hesap Oluştur</h2>
          <p className="form-subtitle">Doğal ürünler dünyasına katılın</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="success-banner" role="alert" aria-live="polite">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} noValidate>
          {/* Full Name Input */}
          <div className="input-group">
            <FiUser className="input-icon" aria-hidden="true" />
            <input
              type="text"
              id="fullName"
              className={`input ${fullNameError ? "is-invalid" : ""}`}
              placeholder="Ad Soyad"
              value={fullName}
              onChange={handleFullNameChange}
              onBlur={() => handleBlur("fullName")}
              aria-label="Ad Soyad"
              aria-invalid={fullNameError ? "true" : "false"}
              aria-describedby={fullNameError ? "fullName-error" : undefined}
              autoComplete="name"
              disabled={loading}
            />
            {fullNameError && (
              <span id="fullName-error" className="error-text" role="alert">
                {fullNameError}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="input-group">
            <FiMail className="input-icon" aria-hidden="true" />
            <input
              type="email"
              id="email"
              className={`input ${emailError ? "is-invalid" : ""}`}
              placeholder="E-posta adresiniz"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              aria-label="E-posta adresi"
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "email-error" : undefined}
              autoComplete="email"
              disabled={loading}
            />
            {emailError && (
              <span id="email-error" className="error-text" role="alert">
                {emailError}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <FiLock className="input-icon" aria-hidden="true" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`input ${passwordError ? "is-invalid" : ""}`}
              placeholder="Şifreniz"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              aria-label="Şifre"
              aria-invalid={passwordError ? "true" : "false"}
              aria-describedby={
                passwordError || passwordStrength
                  ? "password-error password-strength"
                  : undefined
              }
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              aria-pressed={showPassword}
              disabled={loading}
            >
              {showPassword ? (
                <FiEyeOff aria-hidden="true" />
              ) : (
                <FiEye aria-hidden="true" />
              )}
            </button>
            {/* Password Strength Meter */}
            {password && (
              <div className={`strength-meter-container ${passwordStrength ? `strength-${passwordStrength}` : ""}`}>
                <div className="strength-meter">
                  <div
                    className={`strength-bar ${
                      passwordStrength === "weak"
                        ? "weak"
                        : passwordStrength === "medium"
                        ? "medium"
                        : passwordStrength === "strong"
                        ? "strong"
                        : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      passwordStrength === "medium" || passwordStrength === "strong"
                        ? passwordStrength === "strong"
                          ? "strong"
                          : "medium"
                        : ""
                    }`}
                  ></div>
                  <div
                    className={`strength-bar ${
                      passwordStrength === "strong" ? "strong" : ""
                    }`}
                  ></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === "weak"
                    ? "Zayıf"
                    : passwordStrength === "medium"
                    ? "Orta"
                    : passwordStrength === "strong"
                    ? "Güçlü"
                    : ""}
                </span>
              </div>
            )}
            {passwordError && (
              <span id="password-error" className="error-text" role="alert">
                {passwordError}
              </span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="input-group">
            <FiLock className="input-icon" aria-hidden="true" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className={`input ${confirmPasswordError ? "is-invalid" : ""}`}
              placeholder="Şifrenizi tekrar giriniz"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => handleBlur("confirmPassword")}
              aria-label="Şifre tekrarı"
              aria-invalid={confirmPasswordError ? "true" : "false"}
              aria-describedby={
                confirmPasswordError ? "confirmPassword-error" : undefined
              }
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={
                showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"
              }
              aria-pressed={showConfirmPassword}
              disabled={loading}
            >
              {showConfirmPassword ? (
                <FiEyeOff aria-hidden="true" />
              ) : (
                <FiEye aria-hidden="true" />
              )}
            </button>
            {confirmPasswordError && (
              <span
                id="confirmPassword-error"
                className="error-text"
                role="alert"
              >
                {confirmPasswordError}
              </span>
            )}
          </div>

          {/* Terms Checkbox */}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={loading}
              aria-required="true"
              aria-invalid={!termsAccepted && error.includes("koşul") ? "true" : "false"}
            />
            <span>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Kullanım koşullarını
              </a>{" "}
              kabul ediyorum
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="premium-btn premium-btn-primary"
            disabled={loading}
            aria-busy={loading}
          >
            <span className="premium-btn-content">
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  <span className="premium-btn-text">Kayıt yapılıyor...</span>
                </>
              ) : (
                <>
                  <span className="premium-btn-icon">🌱</span>
                  <span className="premium-btn-text">Kayıt Ol</span>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Social Login Divider */}
        <div className="social-divider">
          <span className="divider-line"></span>
          <span className="divider-text">veya</span>
          <span className="divider-line"></span>
        </div>

        {/* Social Login Buttons (Placeholder) */}
        <div className="social-login">
          <button
            type="button"
            className="btn-social"
            disabled
            aria-label="Google ile kayıt ol (yakında)"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            className="btn-social"
            disabled
            aria-label="Facebook ile kayıt ol (yakında)"
          >
            <span>Facebook</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="login-link-container">
          <p>
            Zaten hesabın var mı?{" "}
            <a href="/login" className="login-link">
              Giriş yap
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

