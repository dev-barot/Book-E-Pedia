import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import './EmployeeNavbar.css';

const EmployeeNavbar= ({ onToggleSidebar }) => {
  const [isMessageOpen, setMessageOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);

  

  return (
    <div className="navbar-main-container container-xxl position-relative bg-white d-flex p-0">

      {/* Top Navbar Content */}
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 admin-main-navbar">
        <Link to="#" className="sidebar-toggler flex-shrink-0" onClick={onToggleSidebar}>
          <i className="fa fa-bars"></i>
        </Link>
        <form className="d-none d-md-flex ms-4">
          <input className="form-control border-0" type="search" placeholder="Search" />
        </form>
        <div className="navbar-nav align-items-center ms-auto">
          {/* Message Dropdown */}
          <div className="nav-item dropdown" onClick={() => setMessageOpen(!isMessageOpen)}>
            <Link to="#" className="nav-link">
              <i className="fa fa-envelope me-lg-2"></i>
            </Link>
            {isMessageOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0">
                <Link to="#" className="dropdown-item">
                  View Messages
                </Link>
                <Link to="#" className="dropdown-item">
                  Mark All as Read
                </Link>
                <Link to="#" className="dropdown-item">
                  Compose New Message
                </Link>
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
                <Link to="#" className="dropdown-item">
                  View Notifications
                </Link>
                <Link to="#" className="dropdown-item">
                  Mark All as Read
                </Link>
                <Link to="#" className="dropdown-item">
                  Settings
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="nav-item dropdown" onClick={() => setUserOpen(!isUserOpen)}>
            <Link to="#" className="nav-link user-profile-top-navbar">
              <i className="fa fa-user"></i>
              <span className="d-none d-lg-inline-flex">Kashish Khatri</span>
            </Link>
            {isUserOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 dropdown-menu-end-temp">
                <Link to="#" className="dropdown-item">
                  Profile Settings
                </Link>
                <Link to="#" className="dropdown-item">
                  Change Password
                </Link>
                <Link to="#" className="dropdown-item">
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default EmployeeNavbar;
