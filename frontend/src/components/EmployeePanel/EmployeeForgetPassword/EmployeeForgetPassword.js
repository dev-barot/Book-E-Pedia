import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeForgetPassword.css";
import profileImage from "./profile.jpeg";
import { BASE_URL } from "../../../utils/config";

function EmployeeForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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
      const res = await fetch(`${BASE_URL}/api/employee-forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      const success = data.bool ?? data.status === "OK";
      const responseMessage =
        data.msg || data.message || data.detail || "Something went wrong";

      if (success) {
        setMessage(responseMessage);
        setDevResetLink(data.reset_link || "");
        if (data.reset_token && data.reset_email) {
          sessionStorage.setItem(
            "employee_reset_context",
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
    <div
      className={`dashboard-main-container ${
        isSidebarCollapsed ? "collapsed" : ""
      }`}
    >
      <div
        className={`top-main-dashboard-navbar ${
          isSidebarCollapsed ? "collapsed" : ""
        }`}
      >
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <EmployeeSidebar isCollapsed={isSidebarCollapsed} />

      <div className="cust-fp-body" style={{marginLeft: isSidebarCollapsed ? '80px' : '260px', width: '100%', transition: 'all 0.3s ease'}}>
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

            {message && <p className="success-message" style={{color: 'green', marginTop: '10px'}}>{message}</p>}
            {devResetLink && (
              <p className="success-message" style={{color: 'green', marginTop: '10px'}}>
                Dev reset link:{" "}
                <a href={devResetLink} target="_blank" rel="noreferrer">
                  Open reset page
                </a>
              </p>
            )}
            {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

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
