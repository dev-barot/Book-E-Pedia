import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import EmployeeNavbar from '../EmployeeNavbar/EmployeeNavbar'

function EmployeeDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`} >
       
      <h1>Employee Dashboard</h1>
      <p>Welcome to the Employee Dashboard. Here you can manage all the activities related to the system.</p>

        {/* Cards Section */}
        <div className="cards-container">
          <div className="dashboard-card">
          <Link to="/employee/manage-categories" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-solid fa-layer-group"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;View Categories</h2>
            </Link>
          </div>

          <div className="dashboard-card">
          <Link to="/employee/manage-booktype" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-solid fa-icons"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manage Booktype</h2>
            </Link>
          </div>

          <div className="dashboard-card">
          <Link to="/employee/manage-products" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-solid fa-swatchbook"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manage Products</h2>
            </Link>
          </div>

          <div className="dashboard-card">
          <Link to="/employee/manage-orders" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-regular fa-clipboard"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manage Orders</h2>
            </Link>
          </div>

          <div className="dashboard-card">
          <Link to="/employee/profile" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-solid fa-users"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manage Profile</h2>
            </Link>
          </div>
          <div className="dashboard-card">
            <Link to="/employee/forget-password" style={{ textDecoration: "none", color:"White"}}>
            <h2><i class="fa-solid fa-comments"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Change Password</h2>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard
