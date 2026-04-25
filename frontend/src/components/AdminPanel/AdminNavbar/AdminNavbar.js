// import React from "react";
// import { Link } from "react-router-dom";
// import "./AdminSidebar.css";

// const AdminSidebar = () => {
//   return (
//     <div className="admin-content">
//     <div className="top-nav-bar">
//       <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
//       {/* Sidebar Toggler */}
//       <button className="sidebar-toggler flex-shrink-0">
//         <i className="fa fa-bars"></i>
//       </button>
//           <div className="header-title">
//             <h3>BOOK-E-PEDIA</h3>
//           </div>
//       {/* Search Bar */}
//       <form className="d-none d-md-flex ms-4">
//         <input
//           className="form-control border-0"
//           type="search"
//           placeholder="Search"
//         />
//       </form>

//       {/* Right Navbar Items */}
//       <div className="navbar-nav align-items-center ms-auto">
//         {/* Notifications */}
//         <div className="nav-item dropdown">
//           <Link
//             to="#"
//             className="nav-link dropdown-toggle"
//             id="notificationsDropdown"
//             role="button"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i className="fa fa-bell me-lg-2"></i>
//           </Link>
//           <div className="dropdown-menu dropdown-menu-end">
//             <span className="dropdown-item">No new notifications</span>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="nav-item dropdown">
//           <Link
//             to="#"
//             className="nav-link dropdown-toggle"
//             id="messagesDropdown"
//             role="button"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i className="fa fa-envelope me-lg-2"></i>
//           </Link>
//           <div className="dropdown-menu dropdown-menu-end">
//             <span className="dropdown-item">No new messages</span>
//           </div>
//         </div>

//         {/* User Profile */}
//         <div className="nav-item dropdown">
//           <Link
//             to="#"
//             className="nav-link dropdown-toggle"
//             id="userDropdown"
//             role="button"
//             data-bs-toggle="dropdown"
//             aria-expanded="false"
//           >
//             <i
//               className="fa fa-user"
//               style={{ fontSize: "24px", marginRight: "8px" }}
//             ></i>
//             <span className="d-none d-lg-inline-flex">Dev Barot</span>
//           </Link>
//           <div className="dropdown-menu dropdown-menu-end">
//             <Link to="/admin/profile" className="dropdown-item">
//               Profile
//             </Link>
//             <Link to="/login" className="dropdown-item">
//               Logout
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//     </div>
//     <div className="sidebar pe-4 pb-3">
//       <nav className="navbar bg-light navbar-light">
//         {/* Brand */}
//         <Link to="/" className="navbar-brand mx-4 mb-3">
//           <h3 className="text-primary">
//             <i className="fa-solid fa-book-open-reader"></i> Admin Panel
//           </h3>
//         </Link>

//         {/* User Info */}
//         <div className="d-flex align-items-center ms-4 mb-4">
//           <div className="position-relative">
//             <i className="fa position-relative" style={{ fontSize: "24px" }}></i>
//             <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
//           </div>
//           <div className="ms-3">
//             <h6 className="mb-0">Dev Barot</h6>
//             <span>Admin</span>
//           </div>
//         </div>

//         {/* Navigation Links */}
//         <div className="navbar-nav w-100">
//           <SidebarLink to="/admin/dashboard" icon="fa-tachometer-alt" label="Dashboard" />
//           <SidebarLink to="/admin/manage-orders" icon="fa-laptop" label="Manage Orders" />
//           <SidebarLink to="/admin/manage-categories" icon="fa-laptop" label="Manage Categories" />
//           <SidebarLink to="/admin/manage-booktype" icon="fa-laptop" label="Manage Booktype" />
//           <SidebarLink to="/admin/manage-products" icon="fa-laptop" label="Manage Products" />
//           <SidebarLink to="/admin/manage-employees" icon="fa-laptop" label="Manage Employees" />
//           <SidebarLink to="/admin/view-customers" icon="fa-laptop" label="View Customers" />
//           <SidebarLink to="/admin/profile" icon="fa-laptop" label="Profile" />
//           <SidebarLink to="/admin/manage-feedback" icon="fa-laptop" label="Manage Customer Feedback" />
//           <SidebarLink to="/admin/reports" icon="fa-laptop" label="Reports" />
//           <SidebarLink to="/login" icon="fa-laptop" label="Logout" />
//         </div>
//       </nav>
//       </div>
//       </div>
//   );
// };

// const SidebarLink = ({ to, icon, label }) => (
//   <Link to={to} className="nav-item nav-link">
//     <i className={`fa ${icon} me-2`}></i> {label}
//   </Link>
// );

// export default AdminSidebar;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = ({ onToggleSidebar }) => {
  const [isMessageOpen, setMessageOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();

    if (term.includes("employee")) {
      navigate("/admin/manage-employees");
    } else if (term.includes("order")) {
      navigate("/admin/manage-orders");
    } else if (term.includes("categor")) {
      navigate("/admin/manage-categories");
    } else if (term.includes("booktype") || term.includes("type")) {
      navigate("/admin/manage-booktype");
    } else if (term.includes("product") || term.includes("book")) {
      navigate("/admin/manage-products");
    } else if (term.includes("customer")) {
      navigate("/admin/view-customers");
    } else if (term.includes("feedback")) {
      navigate("/admin/manage-feedback");
    } else if (term.includes("report")) {
      navigate("/admin/reports");
    } else if (term.includes("profile")) {
      navigate("/admin/profile");
    } else if (term.includes("dashboard") || term.includes("home")) {
      navigate("/admin/dashboard");
    }
    
    // Optional: Clear field after searching
    setSearchTerm("");
  };

  return (
    <div className="navbar-main-container container-xxl position-relative bg-white d-flex p-0" translate="no">
      {/* Top Navbar Content */}
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0 admin-main-navbar">
        <Link
          to="#"
          className="sidebar-toggler flex-shrink-0"
          onClick={onToggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </Link>
        <form className="admin-search-wrapper" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="form-control admin-search-input"
            placeholder="Search modules (e.g. employee)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="navbar-nav align-items-center ms-auto">
          {/* Message Dropdown */}
          <div
            className="nav-item dropdown"
            onClick={() => setMessageOpen(!isMessageOpen)}
          >
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
          <div
            className="nav-item dropdown"
            onClick={() => setNotificationOpen(!isNotificationOpen)}
          >
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
          <div
            className="nav-item dropdown"
            onClick={() => setUserOpen(!isUserOpen)}
          >
            <Link to="#" className="nav-link user-profile-top-navbar">
              <i className="fa fa-user"></i>
              <span className="d-none d-lg-inline-flex">Admin</span>
            </Link>
            {isUserOpen && (
              <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 dropdown-menu-end-temp">
                <Link to="#" className="dropdown-item">
                  Profile Settings
                </Link>
                <Link to="#" className="dropdown-item">
                  Change Password
                </Link>
                <Link to="/customer/logout" className="dropdown-item">
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

export default AdminNavbar;
