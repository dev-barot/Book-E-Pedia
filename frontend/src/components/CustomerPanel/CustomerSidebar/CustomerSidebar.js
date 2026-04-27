import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./CustomerSidebar.css";

function CustomerSidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active-lux" : "";
  };

  return (
    <div className="cust-sidebar-glass">
      <h2 className="sidebar-brand-lux"><span>Dashboard</span></h2>

      <ul className="sidebar-list-lux">
        <li>
          <Link to="/customer/dashboard" className={`sidebar-link-lux ${isActive('/customer/dashboard')}`}>
            <i className="fa-solid fa-chart-pie me-3"></i>
            <span>My Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/orders" className={`sidebar-link-lux ${isActive('/customer/orders')}`}>
            <i className="fa-solid fa-book me-3"></i>
            <span>Ordered Books</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/profile" className={`sidebar-link-lux ${isActive('/customer/profile')}`}>
            <i className="fa-solid fa-user-gear me-3"></i>
            <span>Profile Settings</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/help-support" className={`sidebar-link-lux ${isActive('/customer/help-support')}`}>
            <i className="fa-solid fa-circle-question me-3"></i>
            <span>Help & Support</span>
          </Link>
        </li>

        <li className="logout-item-lux">
          <Link to="/customer/logout" className="sidebar-link-lux logout-lux">
            <i className="fa-solid fa-right-from-bracket me-3"></i>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default CustomerSidebar;
