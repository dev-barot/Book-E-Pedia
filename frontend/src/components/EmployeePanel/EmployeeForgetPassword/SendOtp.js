import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import profileImage from "./profile.jpeg";
import "./EmployeeForgetPassword.css";

function SendOtp() {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOtp = () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    // Frontend-only OTP simulation
    console.log("OTP Verified");

    setVerified(true);

    // Redirect to Employee Reset Password after 2 seconds
    setTimeout(() => {
      navigate("/employee/reset-password");
    }, 2000);
  };

  return (
    <div className="cust-fp-body">
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>

        <div className="cust-fp-form-container">
          <h1>Enter OTP</h1>

          {verified ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              OTP Verified Successfully! Redirecting...
            </p>
          ) : (
            <>
              <p>
                An OTP has been sent to your registered email.
                Please enter the OTP below.
              </p>

              <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button onClick={handleVerifyOtp}>
                Verify OTP
              </button>

              <p>
                <Link to="/login">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SendOtp;
