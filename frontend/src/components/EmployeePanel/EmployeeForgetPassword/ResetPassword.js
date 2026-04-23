import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EmployeeForgetPassword.css";
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
    const storedContext = sessionStorage.getItem("employee_reset_context");
    let fallbackToken = "";
    let fallbackEmail = "";

    if (storedContext) {
      try {
        const parsed = JSON.parse(storedContext);
        fallbackToken = parsed.token || "";
        fallbackEmail = parsed.email || "";
      } catch (error) {
        sessionStorage.removeItem("employee_reset_context");
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
        `${BASE_URL}/api/employee-reset-password-confirm/`,
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
        sessionStorage.removeItem("employee_reset_context");

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
    <div className="cust-fp-body">
      <div className="cust-fp-container">
        <div className="cust-fp-form-container" style={{ margin: '0 auto', textAlign: 'center', flex: 'none', width: '100%' }}>
          <h1>Reset Your Password</h1>
          <p>Enter your email and new password.</p>

          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '80%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '80%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc' }}
            />

            <button
              type="submit"
              disabled={isResetting}
              style={{ width: '80%', padding: '12px', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
          {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

          <p style={{ marginTop: "20px" }}>
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "#007bff", textDecoration: "underline" }}
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
