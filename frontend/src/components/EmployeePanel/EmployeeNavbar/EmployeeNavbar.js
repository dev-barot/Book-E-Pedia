import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmployeeNavbar.css';

const EmployeeNavbar = ({ onToggleSidebar }) => {
  const [isMessageOpen, setMessageOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const employeeName = localStorage.getItem("employee_name") || "Employee";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();

    if (term.includes("order") || term.includes("manage order")) {
      navigate("/employee/manage-orders");
    } else if (term.includes("categor") || term.includes("view categor")) {
      navigate("/employee/manage-categories");
    } else if (term.includes("booktype") || term.includes("type") || term.includes("book type")) {
      navigate("/employee/manage-booktype");
    } else if (term.includes("product") || term.includes("book") || term.includes("manage product")) {
      navigate("/employee/manage-products");
    } else if (term.includes("profile") || term.includes("my profile") || term.includes("account")) {
      navigate("/employee/profile");
    } else if (term.includes("password") || term.includes("change password") || term.includes("forget")) {
      navigate("/employee/forget-password");
    } else if (term.includes("dashboard") || term.includes("home") || term.includes("main")) {
      navigate("/employee/dashboard");
    }

    setSearchTerm("");
  };

  return (
    <div className="navbar-main-container container-xxl position-relative bg-white d-flex p-0" translate="no">
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 admin-main-navbar">
        <Link to="#" className="sidebar-toggler flex-shrink-0" onClick={onToggleSidebar}>
          <i className="fa fa-bars"></i>
        </Link>

        <form className="admin-search-wrapper" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control admin-search-input"
            placeholder="Search modules (e.g. orders)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="navbar-nav align-items-center ms-auto">
          {/* Message Dropdown */}
          <div className="nav-item dropdown" onClick={() => setMessageOpen(!isMessageOpen)}>
            <Link to="#" className="nav-link">
              <i className="fa fa-envelope me-lg-2"></i>
            </Link>
            {isMessageOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                <Link to="#" className="dropdown-item">View Messages</Link>
                <Link to="#" className="dropdown-item">Mark All as Read</Link>
                <Link to="#" className="dropdown-item">Compose New Message</Link>
              </div>
            )}
          </div>

          {/* Notification Dropdown */}
          <div className="nav-item dropdown" onClick={() => setNotificationOpen(!isNotificationOpen)}>
            <Link to="#" className="nav-link">
              <i className="fa fa-bell me-lg-2"></i>
            </Link>
            {isNotificationOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                <Link to="#" className="dropdown-item">View Notifications</Link>
                <Link to="#" className="dropdown-item">Mark All as Read</Link>
                <Link to="#" className="dropdown-item">Settings</Link>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="nav-item dropdown" onClick={() => setUserOpen(!isUserOpen)}>
            <Link to="#" className="nav-link user-profile-top-navbar">
              <i className="fa fa-user"></i>
              <span className="d-none d-lg-inline-flex"> {employeeName}</span>
            </Link>
            {isUserOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 dropdown-menu-end-temp">
                <Link to="/employee/profile" className="dropdown-item">My Profile</Link>
                <Link to="/employee/forget-password" className="dropdown-item">Change Password</Link>
                <Link to="/" className="dropdown-item">Log Out</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default EmployeeNavbar;
