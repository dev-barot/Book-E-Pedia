import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = ({ onToggleSidebar }) => {

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="navbar-main-container container-xxl position-relative bg-white d-flex p-0">
      
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 admin-main-navbar">

        {/* Sidebar Toggle */}
        <button
          className="sidebar-toggler flex-shrink-0"
          onClick={onToggleSidebar}
          style={{ background: "none", border: "none" }}
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* Search */}
        <form className="admin-search-wrapper">
          <input
            type="text"
            className="form-control admin-search-input"
            placeholder="Search"
          />
        </form>

        <div className="navbar-nav align-items-center ms-auto">

          {/* Messages */}
          <div className="nav-item dropdown">
            <Link
              to="#"
              className="nav-link"
              onClick={() => toggleDropdown("messages")}
            >
              <i className="fa fa-envelope me-lg-2"></i>
            </Link>

            {activeDropdown === "messages" && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 show">
                <Link to="#" className="dropdown-item">View Messages</Link>
                <Link to="#" className="dropdown-item">Mark All as Read</Link>
                <Link to="#" className="dropdown-item">Compose New Message</Link>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="nav-item dropdown">
            <Link
              to="#"
              className="nav-link"
              onClick={() => toggleDropdown("notifications")}
            >
              <i className="fa fa-bell me-lg-2"></i>
            </Link>

            {activeDropdown === "notifications" && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 show">
                <Link to="#" className="dropdown-item">View Notifications</Link>
                <Link to="#" className="dropdown-item">Mark All as Read</Link>
                <Link to="#" className="dropdown-item">Settings</Link>
              </div>
            )}
          </div>

          {/* User */}
          <div className="nav-item dropdown">
            <Link
              to="#"
              className="nav-link user-profile-top-navbar"
              onClick={() => toggleDropdown("user")}
            >
              <i className="fa fa-user me-2"></i>
              <span className="d-none d-lg-inline-flex">Admin</span>
            </Link>

            {activeDropdown === "user" && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 show">
                <Link to="#" className="dropdown-item">Profile Settings</Link>
                <Link to="#" className="dropdown-item">Change Password</Link>
                <Link to="/login" className="dropdown-item">Log Out</Link>
              </div>
            )}
          </div>

        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;
