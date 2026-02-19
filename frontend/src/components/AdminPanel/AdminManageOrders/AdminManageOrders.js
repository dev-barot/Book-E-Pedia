import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminManageOrders.css";

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const statusOptions = ["Pending", "Processing","Shipped", "Completed"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders from http://localhost:8000/api/master-orders/");
        const response = await fetch("http://localhost:8000/api/master-orders/");
        if (!response.ok) {
          const errorText = await response.text();
          console.log("Error details:", errorText);
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        console.log("Response data:", data);
        console.log("Order details:", data.orders);
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];
      if (!csrfToken) throw new Error("CSRF token not found");

      const response = await fetch(
        `http://localhost:8000/api/masterorders/${orderId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ Order_Status: newStatus }),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error details:", errorText);
        throw new Error("Failed to update status");
      }
      setOrders(
        orders.map((order) =>
          order.MasterOrder_ID === orderId
            ? { ...order, Order_Status: newStatus }
            : order
        )
      );
      console.log(`Status updated to ${newStatus} for order ${orderId}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSidebarToggle = () => {
    // Assuming this is part of your existing toggle logic
  };

  return (
    <div className={`dashboard-main-container`}>
      <div className={`top-main-dashboard-navbar`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>
      <div className={`sidebar-main-section`}>
        <AdminSidebar />
      </div>
      <div className={`dashboard-main-content`}>
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
                            onChange={() => handleStatusChange(order.MasterOrder_ID, status)}
                            disabled={order.Order_Status === status}
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