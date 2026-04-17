import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminViewCustomers.css";

function AdminViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  const handleDeactivate = async (custId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/customers/deactivate/${custId}/`,
        {
          method: "PUT",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Customer deactivated");

        // remove from UI instantly (feels faster, less annoying)
        setCustomers(prev => prev.filter(c => c.Cust_ID !== custId));
      } else {
        alert(data.error || "Failed to deactivate");
      }

    } catch (err) {
      console.error(err);
      alert("Something broke");
    }
  };
  // Fetch customer details from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/customers/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setCustomers(result.data);
      } catch (err) {
        setError("Failed to fetch customer details");
        console.error("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Premium ambient animated background elements */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
        {/* HEADER SECTION */}
        <div className="admin-header-section">
          <div className="admin-header-titles">
            <h1 className="text-gradient-lux">Customer Directory</h1>
            <p>View user profiles, contact information, and account status.</p>
          </div>

        </div>

        {/* DATA TABLE SECTION */}
        <div className="admin-table-wrapper glass-card">
          {error && (
            <div style={{ padding: '20px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '8px' }}></i> {error}
            </div>
          )}
          
          <table className="admin-lux-table">
            <thead>
              <tr>
                <th>Customer Profile</th>
                <th>Contact Information</th>
                <th>Address Details</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.Cust_ID}>
                    <td>
                      <div className="id-cell" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>#{customer.Cust_ID}</div>
                      <div className="name-cell">{customer.Fname} {customer.Lname}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        <i className={`fa-solid ${customer.Gender === "M" ? 'fa-mars text-blue-400' : 'fa-venus text-pink-400'}`}></i> {customer.Gender === "M" ? "Male" : "Female"}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-regular fa-envelope" style={{ color: 'var(--color-text-muted)' }}></i> {customer.Email}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-phone"></i> {customer.Phone_Number}
                      </div>
                    </td>
                    <td>
                      <div className="desc-cell" style={{ maxWidth: '250px', whiteSpace: 'normal', lineHeight: '1.4' }}>
                        {[
                          customer.Building,
                          customer.Street,
                          customer.City,
                          customer.State,
                          customer.Country ? `${customer.Country} - ${customer.Pincode}` : customer.Pincode
                        ].filter(Boolean).join(', ')}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${customer.IsActive === "1" ? "optimal" : "neutral"}`}>
                        {customer.IsActive === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="icon-btn-lux delete"
                        title="Deactivate Customer"
                        onClick={() => handleDeactivate(customer.Cust_ID)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state-cell">
                    <div className="empty-state-content">
                      <i className="fa-solid fa-users empty-icon"></i>
                      <p>No customer data available.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminViewCustomers;
