import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminViewCustomers.css";

function AdminViewCustomers() {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [customers, setCustomers] = useState([
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

  const toggleStatus = (id) => {
    setCustomers(
      customers.map((customer) =>
        customer.Cust_ID === id
          ? { ...customer, IsActive: customer.IsActive === "1" ? "0" : "1" }
          : customer
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter(customer => customer.Cust_ID !== id));
    }
  };

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
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.Cust_ID}>
                    <td>{customer.Cust_ID}</td>
                    <td>{customer.Fname} {customer.Lname}</td>
                    <td>{customer.Gender === "M" ? "Male" : "Female"}</td>
                    <td>{customer.Email}</td>
                    <td>{customer.Phone_Number}</td>
                    <td>
                      {customer.Building}, {customer.Street}, {customer.City}, {customer.State}, {customer.Country} - {customer.Pincode}
                    </td>
                    <td>
                      <span className={customer.IsActive === "1" ? "status-active" : "status-inactive"}>
                        {customer.IsActive === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => toggleStatus(customer.Cust_ID)}
                      >
                        Toggle Status
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(customer.Cust_ID)}
                      >
                        Delete
                      </button>
                    </td>
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
