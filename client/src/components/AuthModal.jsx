import { useEffect, useRef, useState } from "react";

function AuthModal({ open, onClose, onLogin, onRegister, loading, message }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 0);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, mode, onClose]);

  if (!open) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (mode === "register") {
      onRegister({ name, email, password });
      return;
    }

    onLogin({ email, password });
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setPassword("");
    setShowPassword(false);
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={loading ? undefined : onClose}>
      <section
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        aria-describedby="auth-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close sign in window"
          disabled={loading}
        >
          ×
        </button>

        <p className="eyebrow">OZ Rent A Car</p>
        <h2 id="auth-title">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="auth-copy" id="auth-description">
          {mode === "login"
            ? "Sign in to confirm bookings and view your rental history."
            : "Create an account to keep your bookings linked to one secure profile."}
        </p>

        <div className="auth-tabs" role="group" aria-label="Account options">
          <button
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            type="button"
            aria-pressed={mode === "login"}
            onClick={() => switchMode("login")}
            disabled={loading}
          >
            Sign in
          </button>
          <button
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            type="button"
            aria-pressed={mode === "register"}
            onClick={() => switchMode("register")}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} aria-busy={loading}>
          {mode === "register" && (
            <label>
              <span>Full name</span>
              <input
                ref={firstFieldRef}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                minLength="2"
                disabled={loading}
              />
            </label>
          )}

          <label>
            <span>Email address</span>
            <input
              ref={mode === "login" ? firstFieldRef : undefined}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </label>

          <label>
            <span>Password</span>
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                minLength="8"
                aria-describedby={mode === "register" ? "password-help" : undefined}
                disabled={loading}
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
            {mode === "register" && <small id="password-help">Use at least 8 characters.</small>}
          </label>

          {message && <p className="auth-message" role="alert">{message}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AuthModal;
