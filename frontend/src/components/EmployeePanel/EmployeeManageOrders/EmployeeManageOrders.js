import React, { useEffect, useState } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeManageOrders.css";

function EmployeeManageOrders() {
  const [orders, setOrders] = useState([]);
  const statusOptions = ["Pending", "Processing", "Shipped", "Completed"];

  // ✅ Load Orders from localStorage
  useEffect(() => {
    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, Order_Status: newStatus }
        : order
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    console.log(`Status updated to ${newStatus} for order ${orderId}`);
  };

  const handleSidebarToggle = () => {
    // Optional toggle logic if needed
  };

  return (
    <div className="dashboard-main-container">
      <div className="top-main-dashboard-navbar">
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className="sidebar-main-section">
        <EmployeeSidebar />
      </div>

      <div className="dashboard-main-content">
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">
            Manage Orders
          </h1>

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
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.Cust_ID || "N/A"}</td>
                    <td>{order.Emp_ID || "N/A"}</td>
                    <td>
                      {order.Order_DateTime
                        ? new Date(
                            order.Order_DateTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{order.T_Quantity || 0}</td>
                    <td>
                      Rs.{" "}
                      {parseFloat(order.T_Amount || 0).toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {statusOptions.map((status) => (
                        <div key={status}>
                          <input
                            type="radio"
                            name={`status-${order.id}`}
                            value={status}
                            checked={
                              order.Order_Status === status
                            }
                            onChange={() =>
                              handleStatusChange(
                                order.id,
                                status
                              )
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

export default EmployeeManageOrders;
