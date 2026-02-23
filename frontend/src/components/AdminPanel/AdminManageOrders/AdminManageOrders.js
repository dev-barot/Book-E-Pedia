import React, { useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminManageOrders.css";

function AdminManageOrders() {

  const statusOptions = ["Pending", "Processing", "Shipped", "Completed"];

  // Static demo data (frontend only)
  const [orders, setOrders] = useState([
    {
      MasterOrder_ID: 1,
      Cust_ID: 101,
      Emp_ID: 201,
      Order_DateTime: new Date().toISOString(),
      T_Quantity: 3,
      T_Amount: 1500,
      Order_Status: "Pending"
    },
    {
      MasterOrder_ID: 2,
      Cust_ID: 102,
      Emp_ID: 202,
      Order_DateTime: new Date().toISOString(),
      T_Quantity: 5,
      T_Amount: 3200,
      Order_Status: "Processing"
    }
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.MasterOrder_ID === orderId
          ? { ...order, Order_Status: newStatus }
          : order
      )
    );

    console.log(`Status updated to ${newStatus} for order ${orderId}`);
  };

  const handleSidebarToggle = () => {
    // Keep your existing toggle logic if needed
  };

  return (
    <div className="dashboard-main-container">
      
      <div className="top-main-dashboard-navbar">
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className="sidebar-main-section">
        <AdminSidebar />
      </div>

      <div className="dashboard-main-content">
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Manage Orders</h1>

          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Employee ID</th>
                <th>Order Date</th>
                <th>Total Quantity</th>
                <th>Total Amount</th>
                <th>Order Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7">No orders available</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.MasterOrder_ID}>
                    <td>{order.MasterOrder_ID}</td>
                    <td>{order.Cust_ID || "N/A"}</td>
                    <td>{order.Emp_ID || "N/A"}</td>
                    <td>
                      {order.Order_DateTime
                        ? new Date(order.Order_DateTime).toLocaleDateString()
                        : "Invalid Date"}
                    </td>
                    <td>{order.T_Quantity || 0}</td>
                    <td>Rs. {parseFloat(order.T_Amount || 0).toFixed(2)}</td>
                    <td>
                      {statusOptions.map((status) => (
                        <div key={status}>
                          <input
                            type="radio"
                            name={`status-${order.MasterOrder_ID}`}
                            value={status}
                            checked={order.Order_Status === status}
                            onChange={() =>
                              handleStatusChange(order.MasterOrder_ID, status)
                            }
                          />
                          <label>{status}</label>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminManageOrders;
