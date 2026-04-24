import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { BASE_URL } from "../../../utils/config";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [token, setToken] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rawToken = params.get("token") || "";
    const rawEmail = params.get("email") || "";
    const storedContext = sessionStorage.getItem("customer_reset_context");
    let fallbackToken = "";
    let fallbackEmail = "";

    if (storedContext) {
      try {
        const parsed = JSON.parse(storedContext);
        fallbackToken = parsed.token || "";
        fallbackEmail = parsed.email || "";
      } catch (error) {
        sessionStorage.removeItem("customer_reset_context");
      }
    }

    const effectiveEmail = rawEmail || fallbackEmail;
    const effectiveToken =
      fallbackEmail && effectiveEmail === fallbackEmail && fallbackToken
        ? fallbackToken
        : rawToken || fallbackToken;

    setToken(effectiveToken);
    setEmail(effectiveEmail);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !password || !email) {
      setError("All fields are required.");
      setMessage("");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Enter a valid email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setMessage("");
    setIsResetting(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/reset-password-confirm/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            email: email,
            password: password,
          }),
        }
      );

      const data = await res.json();

      const success = data.bool ?? data.status === "OK";
      const responseMessage =
        data.msg || data.message || data.detail || "Reset failed";

      if (success) {
        setMessage(responseMessage);
        sessionStorage.removeItem("customer_reset_context");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(responseMessage);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }

    setIsResetting(false);
  };

  return (
    <div className="cust-rp-body">
      <div className="cust-rp-container">
        <div className="cust-rp-header">
          <h1>Set New Password</h1>
          <p>Secure your account with a strong, memorable password.</p>
        </div>

        <form onSubmit={handleSubmit} className="cust-rp-form">
          <div className="cust-rp-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="cust-rp-input-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="cust-rp-submit-btn"
            disabled={isResetting}
          >
            {isResetting ? "Updating Password..." : "Update Password"}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <a href="/login" onClick={(e) => { e.preventDefault(); navigate("/login"); }} className="login-link">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
