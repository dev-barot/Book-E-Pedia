import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminViewCustomers.css";

function AdminViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle sidebar toggle
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Fetch customer details from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/customers/");
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
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Customer Details</h1>
          
          {error && <p className="error-message">{error}</p>}
          
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.Cust_ID}>
                    <td>{customer.Cust_ID}</td>
                    <td>{customer.Fname}</td>
                    <td>{customer.Lname}</td>
                    <td>{customer.Gender === "M" ? "Male" : "Female"}</td>
                    <td>{customer.Email}</td>
                    <td>{customer.Phone_Number}</td>
                    <td>
                      {customer.Building && `${customer.Building}, `}
                      {customer.Street && `${customer.Street}, `}
                      {customer.City && `${customer.City}, `}
                      {customer.State && `${customer.State}, `}
                      {customer.Country && `${customer.Country} - `}
                      {customer.Pincode}
                    </td>
                    <td>{customer.IsActive === "1" ? "Active" : "Inactive"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No customer data available</td>
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
