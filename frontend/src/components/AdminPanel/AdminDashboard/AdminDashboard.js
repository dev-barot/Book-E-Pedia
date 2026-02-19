import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";

function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_customers: 0,
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_sales: 0
  });

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch dashboard counts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard-counts/")
      .then(response => response.json())
      .then(data => setDashboardData(data))
      .catch(error => console.error("Error fetching dashboard data:", error));
  }, []);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin Dashboard. Here you can manage all the activities related to the system.</p>

        <div className="cards-container">
          <div className="dashboard-card">
            <h2>Total Customers</h2>
            <p>{dashboardData.total_customers}</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Products</h2>
            <p>{dashboardData.total_products}</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Categories</h2>
            <p>{dashboardData.total_categories}</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Orders</h2>
            <p>{dashboardData.total_orders}</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Sales</h2>
            <p>₹{dashboardData.total_sales}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
