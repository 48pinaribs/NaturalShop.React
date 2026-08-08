import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import "./Login.css";
import apiConfig from "../config/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    return "";
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
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleBlur = (field) => {
    if (field === "email") {
      setEmailError(validateEmail(email));
    } else if (field === "password") {
      setPasswordError(validatePassword(password));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(apiConfig.endpoints.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "E-posta veya şifre hatalı!");
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Token kaydet
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Remember me checkbox durumunu kaydet
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Yönlendir
      window.location.href = "/";
    } catch (err) {
      setError("Sunucu hatası. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand Area */}
        <div className="login-brand">
          <h1 className="brand-text">Köyümüzden Sofranıza</h1>
        </div>

        {/* Header */}
        <div className="login-header">
          <h2 className="login-title">Hoş Geldiniz</h2>
          <p className="login-subtitle">Hesabınıza giriş yapın</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="error-banner" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} noValidate>
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
              aria-describedby={passwordError ? "password-error" : undefined}
              autoComplete="current-password"
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
            {passwordError && (
              <span id="password-error" className="error-text" role="alert">
                {passwordError}
              </span>
            )}
          </div>

          {/* Actions Row */}
          <div className="actions-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Beni hatırla</span>
            </label>
            <button
              type="button"
              className="forgot-link"
              style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" }}
              onClick={() => toast.info("Bu özellik yakında eklenecek. Telefon numaranızla giriş yapabilirsiniz.")}
            >
              Şifremi unuttum?
            </button>
          </div>

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
                  <span className="premium-btn-text">Giriş yapılıyor...</span>
                </>
              ) : (
                <>
                  <span className="premium-btn-icon">🔑</span>
                  <span className="premium-btn-text">Giriş Yap</span>
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
            aria-label="Google ile giriş yap (yakında)"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            className="btn-social"
            disabled
            aria-label="Facebook ile giriş yap (yakında)"
          >
            <span>Facebook</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="signup-link-container">
          <p>
            Hesabın yok mu?{" "}
            <a href="/register" className="signup-link">
              Kayıt ol
            </a>
          </p>
          <p>
            Telefon numaranla giriş yapmak ister misin?{" "}
            <a href="/phone-login" className="signup-link">
              Telefonla Giriş
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
