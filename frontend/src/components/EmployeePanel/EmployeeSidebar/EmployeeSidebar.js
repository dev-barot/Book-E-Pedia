import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './EmployeeSidebar.css';

function EmployeeSidebar({ isCollapsed }) {

  const [employeeName, setEmployeeName] = useState("Employee");

  // ✅ Load employee profile name from localStorage
  useEffect(() => {
    const profile =
      JSON.parse(localStorage.getItem("employeeProfile")) || null;

    if (profile?.firstName) {
      setEmployeeName(
        `${profile.firstName} ${profile.lastName || ""}`
      );
    }
  }, []);

  return (
    <div className={`sidebar pe-4 pb-3 ${isCollapsed ? "collapsed" : ""}`}>
      <nav
        className="navbar bg-light navbar-light sidear-exclude-navbar"
        style={{ height: "90%" }}
      >

        <Link to="/employee/dashboard" className="navbar-brand mx-4 mb-3">
          <h3 className="text-primary">
            <i className="fa fa-book-open-reader"></i> BOOK-E-PEDIA
          </h3>
        </Link>

        <div className="d-flex align-items-center ms-4 mb-4 border-profile-admin">
          <div className="position-relative">
            <i className="fa fa-user"></i>
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
          </div>
          <div className="ms-3">
            <h6 className="mb-0">{employeeName}</h6>
            <span className="admin-text">Employee</span>
          </div>
        </div>

        <div className="navbar-nav w-100">

          <NavLink
            to="/employee/dashboard"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa fa-tachometer-alt me-2"></i>Dashboard
          </NavLink>

          <NavLink
            to="/employee/manage-categories"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-layer-group"></i>
            <span className="fa-sidebar-icons">View Categories</span>
          </NavLink>

          <NavLink
            to="/employee/manage-booktype"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-icons"></i>
            <span className="fa-sidebar-icons">Manage Booktype</span>
          </NavLink>

          <NavLink
            to="/employee/manage-products"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-swatchbook"></i>
            <span className="fa-sidebar-icons">Manage Products</span>
          </NavLink>

          <NavLink
            to="/employee/manage-orders"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-regular fa-clipboard"></i>
            <span className="fa-sidebar-icons">Manage Orders</span>
          </NavLink>

          <NavLink
            to="/employee/profile"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-users"></i>
            <span className="fa-sidebar-icons">Manage Profile</span>
          </NavLink>

          <NavLink
            to="/employee/forget-password"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-comments"></i>
            <span className="fa-sidebar-icons">Change Password</span>
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "nav-item nav-link nav-link-title active"
                : "nav-item nav-link nav-link-title"
            }
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="fa-sidebar-icons">Log Out</span>
          </NavLink>

        </div>
      </nav>
    </div>
  );
}

export default EmployeeSidebar;
