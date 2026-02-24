import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeForgetPassword.css";
import profileImage from "./profile.jpeg";

function EmployeeForgetPassword() {
  const [email, setEmail] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSendOtp = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    // Simulated OTP logic (Frontend only)
    console.log("OTP sent to:", email);

    // Navigate to employee OTP page (change if needed)
    navigate("/employee/send-otp", { state: { email } });
  };

  return (
    <div
      className={`dashboard-main-container ${
        isSidebarCollapsed ? "collapsed" : ""
      }`}
    >
      {/* Top Navbar */}
      <div
        className={`top-main-dashboard-navbar ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <EmployeeSidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className="cust-fp-body">
        <div className="cust-fp-container">
          <div className="cust-fp-illustration">
            <img src={profileImage} alt="Profile Illustration" />
          </div>

          <div className="cust-fp-form-container">
            <h1>Forgot Your Password?</h1>
            <p>
              Enter your email address below and we'll send you instructions to
              reset your password.
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSendOtp}>Send OTP</button>

            <p>
              <Link to="/login">Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForgetPassword;
