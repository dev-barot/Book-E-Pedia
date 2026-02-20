import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import profileImage from "./profile.jpeg";
import './EmployeeForgetPassword.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
  };

  const handleResetPassword = () => {
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Simulating password reset API call
    console.log("Password reset successfully for:", location.state?.email);

    alert("Password reset successfully! Redirecting to login...");
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className='cust-fp-body'>
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>
        <div className="cust-fp-form-container">
          <h1>Reset Password</h1>
          <p>Set a new password for your account.</p>
          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
          <p><a href="/login">Back to login</a></p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

