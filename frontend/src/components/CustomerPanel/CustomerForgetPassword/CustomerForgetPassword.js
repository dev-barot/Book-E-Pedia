import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import "./CustomerForgetPassword.css";
import { BASE_URL } from "../../../utils/config";

function CustomerForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

  const navigate = useNavigate();

  const handleResetRequest = async () => {
    if (!email) {
      setError("Please enter your email address.");
      setMessage("");
      return;
    }

    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setDevResetLink("");
    setIsSending(true);

    try {
      const res = await fetch(
        `${BASE_URL}/api/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      const success = data.bool ?? data.status === "OK";
      const responseMessage =
        data.msg || data.message || data.detail || "Something went wrong";

      if (success) {
        setMessage(responseMessage);
        setDevResetLink(data.reset_link || "");
        if (data.reset_token && data.reset_email) {
          sessionStorage.setItem(
            "customer_reset_context",
            JSON.stringify({
              token: data.reset_token,
              email: data.reset_email,
            })
          );
        }
      } else {
        setError(responseMessage);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }

    setIsSending(false);
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
            Enter your email address and we'll send you a reset link.
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
          {devResetLink && (
            <p className="success-message">
              Dev reset link:{" "}
              <a href={devResetLink} target="_blank" rel="noreferrer">
                Open reset page
              </a>
            </p>
          )}
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
