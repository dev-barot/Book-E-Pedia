import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import "./CustomerForgetPassword.css";

function CustomerForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();

  const handleResetRequest = () => {
    if (!email) {
      setError("Please enter your email address.");
      setMessage("");
      return;
    }

    // Basic email format validation
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setIsSending(true);

    // Simulated API delay
    setTimeout(() => {
      setMessage("A password reset link has been sent to your email (Demo Mode).");
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="cust-fp-body">
      <div className="cust-fp-container">

        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>

        <div className="cust-fp-form-container">
          <h1>Forgot Your Password?</h1>
          <p>
            Enter your email address below and we'll send you instructions
            to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleResetRequest} disabled={isSending}>
            {isSending ? "Sending..." : "Send Reset Link"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <p>
            <span
              style={{ cursor: "pointer", color: "blue" }}
              onClick={() => navigate("/login")}
            >
              Back to login
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default CustomerForgetPassword;
