import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import "./CustomerForgetPassword.css";

function SendOtp() {
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "demo@example.com";

  // Generate Dummy OTP on Load
  useEffect(() => {
    const dummyOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(dummyOtp);

    console.log("Demo OTP:", dummyOtp); // For testing in console
  }, []);

  const handleVerifyOtp = () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      setMessage("");
      return;
    }

    setError("");
    setIsVerifying(true);

    setTimeout(() => {
      setMessage("OTP Verified Successfully! Redirecting...");
      setIsVerifying(false);

      setTimeout(() => {
        navigate("/customer/reset-password?token=dummytoken");
      }, 1500);
    }, 1000);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtp("");
    setMessage("");
    setError("");
    console.log("New Demo OTP:", newOtp);
    alert("New OTP generated (Check console in demo mode)");
  };

  return (
    <div className="cust-fp-body">
      <div className="cust-fp-container">

        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>

        <div className="cust-fp-form-container">
          <h1>Enter OTP</h1>

          {message ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {message}
            </p>
          ) : (
            <>
              <p>
                An OTP has been sent to <strong>{email}</strong>.  
                (Demo OTP is printed in console)
              </p>

              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button onClick={handleVerifyOtp} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>

              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}

              <p
                style={{ cursor: "pointer", color: "blue" }}
                onClick={handleResendOtp}
              >
                Resend OTP
              </p>

              <p
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => navigate("/login")}
              >
                Back to login
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default SendOtp;
