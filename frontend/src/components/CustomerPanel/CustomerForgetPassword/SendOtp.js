import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import './CustomerForgetPassword.css';

function SendOtp() {
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    // Simulating OTP verification
    console.log("OTP Verified for:", location.state?.email);

    // Show verification message
    setVerified(true);

    // Redirect to Reset Password after 2 seconds
    setTimeout(() => {
      navigate('/customer/reset-password', { state: { email: location.state?.email } });
    }, 2000);
  };

  return (
    <div className='cust-fp-body'>
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>
        <div className="cust-fp-form-container">
          <h1>Enter OTP</h1>
          {verified ? (
            <p style={{ color: "green", fontWeight: "bold" }}>OTP Verified Successfully! Redirecting...</p>
          ) : (
            <>
              <p>An OTP has been sent to <strong>{location.state?.email || "your email"}</strong>. Please enter the OTP below.</p>
              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOtp}>Verify OTP</button>
              <p><a href="/login">Back to login</a></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendOtp;

