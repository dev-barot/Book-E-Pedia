import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./EmployeeSidebar.css";

const EmployeeSidebar = ({ isCollapsed }) => {
  const employeeName = localStorage.getItem("employee_name") || "Employee";

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>

      <nav className="navbar navbar-dark sidear-exclude-navbar">

        <Link to="/employee/dashboard" className="navbar-brand mx-4 mb-3">
          <h3 className="brand-title">
            <i className="fa fa-book-open-reader"></i> BOOK-E-PEDIA
          </h3>
        </Link>

        <div className="profile-box ms-4 mb-4">
          <div className="profile-icon">
            <i className="fa fa-user"></i>
          </div>
          <div className="ms-3">
            <h6 className="mb-0">Welcome, {employeeName}</h6>
          </div>
        </div>

        <div className="sidebar-bottom">

          <NavLink to="/employee/dashboard" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa fa-tachometer-alt"></i> Dashboard
          </NavLink>

          <NavLink to="/employee/manage-categories" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-solid fa-layer-group"></i> View Categories
          </NavLink>

          <NavLink to="/employee/manage-booktype" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-solid fa-icons"></i> Manage Booktype
          </NavLink>

          <NavLink to="/employee/manage-products" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-solid fa-swatchbook"></i> Manage Products
          </NavLink>

          <NavLink to="/employee/manage-orders" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-regular fa-clipboard"></i> Manage Orders
          </NavLink>

          <NavLink to="/employee/profile" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-solid fa-user-gear"></i> My Profile
          </NavLink>

          <NavLink to="/employee/forget-password" className={({ isActive }) =>
            isActive ? "nav-link-title active" : "nav-link-title"
          }>
            <i className="fa-solid fa-key"></i> Change Password
          </NavLink>

          <NavLink to="/customer/logout" className="nav-link-title logout">
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
          </NavLink>

        </div>
      </nav>
    </div>
  );
};

export default EmployeeSidebar;
