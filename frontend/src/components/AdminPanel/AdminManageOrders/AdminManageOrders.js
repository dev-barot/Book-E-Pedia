import React, { useEffect, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageOrders.css";

function AdminManageOrders() {
  const [orders, setOrders] = useState([]);
  const statusOptions = ["Pending", "Processing","Shipped", "Completed"];
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders from http://127.0.0.1:8000/api/master-orders/");
        const response = await fetch("http://127.0.0.1:8000/api/master-orders/");
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
        `http://127.0.0.1:8000/api/masterorders/${orderId}/`,
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

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed": return "optimal";
      case "Shipped": return "neutral text-blue-500";
      case "Processing": return "neutral text-orange-500";
      case "Pending": return "critical";
      default: return "neutral";
    }
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Premium ambient animated background elements */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
        {/* HEADER SECTION */}
<div className="admin-action-bar">
</div>

{/* TITLE SECTION */}
<div className="admin-header-titles centered">
  <h1 className="text-gradient-lux">Order Fulfillment</h1>
  <p>Administer staff, roles, and employee records.</p>
</div>

        {/* DATA TABLE SECTION */}
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
                  <td colSpan="6" className="empty-state-cell">
                    <div className="empty-state-content">
                      <i className="fa-solid fa-cart-arrow-down empty-icon"></i>
                      <p>No orders available.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.MasterOrder_ID}>
                    <td className="id-cell">#{order.MasterOrder_ID}</td>
                    <td>
                      <div><strong>Cust ID:</strong> {order.Cust_ID || "N/A"}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}><strong>Emp ID:</strong> {order.Emp_ID || "N/A"}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500' }}>
                        {order.Order_DateTime ? new Date(order.Order_DateTime).toLocaleDateString() : "Invalid Date"}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {order.Order_DateTime ? new Date(order.Order_DateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Qty: {order.T_Quantity || 0}</div>
                      <div style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }}>₹{parseFloat(order.T_Amount || 0).toFixed(2)}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(order.Order_Status)}`}>
                        {order.Order_Status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '300px' }}>
                        {statusOptions.map((status) => (
                          <label 
                            key={status} 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              fontSize: '0.8rem',
                              border: order.Order_Status === status ? '1px solid var(--color-primary-dark)' : '1px solid rgba(31,78,121,0.2)',
                              padding: '2px 8px',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              background: order.Order_Status === status ? 'rgba(31,78,121,0.05)' : 'transparent',
                              opacity: order.Order_Status === status ? 1 : 0.7
                            }}
                          >
                            <input
                              type="radio"
                              name={`status-${order.MasterOrder_ID}`}
                              value={status}
                              checked={order.Order_Status === status}
                              onChange={() => handleStatusChange(order.MasterOrder_ID, status)}
                              disabled={order.Order_Status === status}
                              style={{ margin: 0, scale: '0.8' }}
                            />
                            {status}
                          </label>
                        ))}
                      </div>
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
