import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = ({ isCollapsed }) => {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      
      <nav className="navbar navbar-dark sidear-exclude-navbar">

        {/* Brand */}
        <Link to="/admin/dashboard" className="navbar-brand mx-4 mb-3">
          <h3 className="brand-title">
            <i className="fa fa-book-open-reader"></i>
            {!isCollapsed && " BOOK-E-PEDIA"}
          </h3>
        </Link>

        {/* Profile Section */}
        {!isCollapsed && (
          <div className="profile-box ms-4 mb-4">
            <div className="profile-icon">
              <i className="fa fa-user"></i>
            </div>
            <div className="ms-3">
              <h6 className="mb-0">Welcome,</h6>
              <h6 className="mb-0">Admin</h6>
            </div>
          </div>
        )}

        <div className="sidebar-bottom">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa fa-tachometer-alt"></i>
            {!isCollapsed && " Dashboard"}
          </NavLink>

          <NavLink
            to="/admin/manage-employees"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-address-card"></i>
            {!isCollapsed && " Manage Employees"}
          </NavLink>

          <NavLink
            to="/admin/manage-categories"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-layer-group"></i>
            {!isCollapsed && " Manage Categories"}
          </NavLink>

          <NavLink
            to="/admin/manage-booktype"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-icons"></i>
            {!isCollapsed && " Manage Booktype"}
          </NavLink>

          <NavLink
            to="/admin/manage-products"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-swatchbook"></i>
            {!isCollapsed && " Manage Products"}
          </NavLink>

          <NavLink
            to="/admin/manage-orders"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-regular fa-clipboard"></i>
            {!isCollapsed && " Manage Orders"}
          </NavLink>

          <NavLink
            to="/admin/view-customers"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-users"></i>
            {!isCollapsed && " View Customers"}
          </NavLink>

          <NavLink
            to="/admin/manage-feedback"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-comments"></i>
            {!isCollapsed && " Manage Feedback"}
          </NavLink>

          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              isActive ? "nav-link-title active" : "nav-link-title"
            }
          >
            <i className="fa-solid fa-chart-column"></i>
            {!isCollapsed && " View Reports"}
          </NavLink>

          {/* Logout */}
          <NavLink to="/login" className="nav-link-title logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            {!isCollapsed && " Log Out"}
          </NavLink>

        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
