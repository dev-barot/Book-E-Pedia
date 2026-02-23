import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminViewCustomers.css";

function AdminViewCustomers() {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Demo customer data (Frontend Only)
  const [customers] = useState([
    {
      Cust_ID: 1,
      Fname: "John",
      Lname: "Doe",
      Gender: "M",
      Email: "john@example.com",
      Phone_Number: "9876543210",
      Building: "A-101",
      Street: "Main Road",
      City: "Ahmedabad",
      State: "Gujarat",
      Country: "India",
      Pincode: "380001",
      IsActive: "1"
    },
    {
      Cust_ID: 2,
      Fname: "Jane",
      Lname: "Smith",
      Gender: "F",
      Email: "jane@example.com",
      Phone_Number: "9123456780",
      Building: "B-202",
      Street: "Park Street",
      City: "Gandhinagar",
      State: "Gujarat",
      Country: "India",
      Pincode: "382010",
      IsActive: "0"
    }
  ]);

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
