import React, { useState } from 'react'
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar'
import './EmployeeForgetPassword.css'
import { useNavigate } from 'react-router';
import profileImage from "./profile.jpeg";
import EmployeeNavbar from '../EmployeeNavbar/EmployeeNavbar'

function EmployeeForgetPassword() {
    const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    // Simulating API call (OTP sent to email)
    console.log("OTP sent to:", email);

    // Navigate to SendOtp page with email
    navigate('/customer/send-otp', { state: { email } });
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>
    <div className='cust-fp-body'>
      <div className="cust-fp-container">
        <div className="cust-fp-illustration">
          <img src={profileImage} alt="Profile Illustration" />
        </div>
        <div className="cust-fp-form-container">
          <h1>Forgot Your Password?</h1>
          <p>Enter your email address below and we'll send you instructions to reset your password.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
          <p><a href="/login">Back to login</a></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default EmployeeForgetPassword
