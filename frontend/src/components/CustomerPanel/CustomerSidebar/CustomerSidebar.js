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
            <i className="fas fa-tachometer-alt sidebar-icon-lux"></i> <span>My Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/orders" className={`sidebar-link-lux ${isActive('/customer/orders')}`}>
            <i className="fa fa-book sidebar-icon-lux"></i> <span>Ordered Books</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/profile" className={`sidebar-link-lux ${isActive('/customer/profile')}`}>
            <i className="fa fa-cog sidebar-icon-lux"></i> <span>Profile Settings</span>
          </Link>
        </li>

        <li>
          <Link to="/customer/help-support" className={`sidebar-link-lux ${isActive('/customer/help-support')}`}>
            <i className="fa fa-question-circle sidebar-icon-lux"></i> <span>Help & Support</span>
          </Link>
        </li>

        <li className="logout-item-lux">
          <Link to="/customer/logout" className="sidebar-link-lux logout-lux">
            <i className="fa fa-sign-out-alt sidebar-icon-lux"></i> <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default CustomerSidebar;
