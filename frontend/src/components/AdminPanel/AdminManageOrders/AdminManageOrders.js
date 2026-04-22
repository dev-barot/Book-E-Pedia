import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageOrders.css";

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const statusOptions = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

  const getStatusIndex = (status) => statusOptions.indexOf(status);

  // 🔥 FETCH ORDERS (moved outside useEffect so reusable)
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/admin/orders/");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 FIXED STATUS CHANGE FUNCTION
  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find(o => o.MasterOrder_ID === orderId);

    if (!order) return;

    // 🚫 lock if completed/cancelled
    if (order.Order_Status === "Completed" || order.Order_Status === "Cancelled") {
      return;
    }

    try {
      await fetch(`http://127.0.0.1:8000/api/admin/orders/${orderId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Order_Status: newStatus,
        }),
      });

      fetchOrders(); // refresh from backend

    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleSidebarToggle = () =>
    setIsSidebarCollapsed(!isSidebarCollapsed);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "optimal";
      case "Shipped":
        return "neutral text-blue-500";
      case "Processing":
        return "neutral text-orange-500";
      case "Pending":
        return "critical";
      case "Cancelled":
        return "critical text-gray-500";
      default:
        return "neutral";
    }
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="top-main-dashboard-navbar">
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className="sidebar-main-section">
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className="dashboard-main-content">
        <div className="section admin-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Order Fulfillment</h2>
          </div>

          <div className="admin-table-wrapper glass-card">
            <table className="admin-lux-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer / Emp</th>
                  <th>Date</th>
                  <th>Stats</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6">No orders available</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const currentIndex = getStatusIndex(order.Order_Status);
                    const isOrderLocked =
                      order.Order_Status === "Completed" ||
                      order.Order_Status === "Cancelled";

                    return (
                      <tr key={order.MasterOrder_ID}>
                        <td>#{order.MasterOrder_ID}</td>

                        <td>
                          <div><strong>Cust:</strong> {order.Cust_ID}</div>
                          <div><strong>Emp:</strong> {order.Emp_ID}</div>
                        </td>

                        <td>
                          {new Date(order.Order_DateTime).toLocaleString()}
                        </td>

                        <td>
                          <div>Qty: {order.T_Quantity}</div>
                          <div>₹{order.T_Amount}</div>
                        </td>

                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(order.Order_Status)}`}>
                            {order.Order_Status}
                          </span>
                        </td>

                        <td>
                          <div className="status-progress-container">
                            {statusOptions.map((status) => {
                              const optionIndex = getStatusIndex(status);

                              const isCompletedStep = optionIndex < currentIndex;
                              const isCurrentStep = optionIndex === currentIndex;
                              const isNextStep = optionIndex === currentIndex + 1;

                              const isCancelledStep = status === "Cancelled";
                              const isOrderCancelled = order.Order_Status === "Cancelled";

                              let className = "status-step";

                              if (isOrderCancelled) {
                                className += status === "Cancelled"
                                  ? " cancelled-active"
                                  : " disabled";
                              } else if (isCompletedStep) {
                                className += " done";
                              } else if (isCurrentStep) {
                                className += " current";
                              } else if (isNextStep) {
                                className += " next";
                              } else if (isCancelledStep) {
                                className += " cancel-btn";
                              } else {
                                className += " disabled";
                              }

                              return (
                                <div
                                  key={status}
                                  className={className}
                                  onClick={() => {
                                    if (isOrderLocked) return;

                                    // 🔴 CANCEL anytime before completed
                                    if (status === "Cancelled") {
                                      handleStatusChange(order.MasterOrder_ID, "Cancelled");
                                      return;
                                    }

                                    // ✅ only next step allowed
                                    if (isNextStep) {
                                      handleStatusChange(order.MasterOrder_ID, status);
                                    }
                                  }}
                                >
                                  {status}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManageOrders;