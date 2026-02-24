import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Demo token validation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setError(
        "Invalid or missing token. Please request a new password reset link."
      );
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token || !password || !email) {
      setError("Please fill in all fields.");
      setMessage("");
      return;
    }

    // Basic Email Validation
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }

    // Password Strength Check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setIsResetting(true);

    // Simulated Reset Delay
    setTimeout(() => {
      setMessage("Password reset successfully! Redirecting to login...");
      setIsResetting(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="reset-password-body">
      <div className="reset-password-container">
        <h1>Reset Your Password</h1>
        <p>Enter your email and new password to reset your account.</p>

        <form onSubmit={handleSubmit} className="reset-password-form">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="reset-password-input"
          />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="reset-password-input"
          />

          <button
            type="submit"
            className="reset-password-btn"
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {message && <p className="reset-password-success">{message}</p>}
        {error && <p className="reset-password-error">{error}</p>}

        <p>
          <span
            onClick={() => navigate("/login")}
            className="reset-password-back-link"
            style={{ cursor: "pointer" }}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
