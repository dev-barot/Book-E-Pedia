import React, { useEffect, useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import './AdminManageFeedback.css';
import { BASE_URL } from "../../../utils/config";

function AdminManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch feedback details from the Django API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/feedbacks/`); // Update to your actual API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFeedbacks(data.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle delete feedback
  const handleDeleteFeedback = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/feedbacks/${id}/delete/`, {
        method: "PUT"
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Delete failed");

      // remove from UI after backend success
      setFeedbacks(prev => prev.filter(f => f.Feedback_ID !== id));

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Top Navbar */}
      <div className={`top-main-dashboard-navbar  ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>

        <div className="section admin-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Customer Feedback</h2>
          </div>

          {/* DATA TABLE SECTION */}
          <div className="admin-table-wrapper glass-card">
            <table className="admin-lux-table">
              <thead>
                <tr>
                  <th>IDs Info</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state-cell">
                      <div className="empty-state-content">
                        <i className="fa-regular fa-comment-dots empty-icon"></i>
                        <p>No feedback available.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((feedback) => (
                    <tr key={feedback.Feedback_ID}>
                      <td>
                        <div style={{ fontSize: '0.9rem' }}><strong>Prod:</strong> {feedback.Product_ID}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}><strong>Cust:</strong> {feedback.Cust_ID}</div>
                      </td>
                      <td className="desc-cell">

                        {/* ⭐ Rating */}
                        <div style={{ marginBottom: "5px" }}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} style={{ color: i < feedback.rating ? "#f5b50a" : "#ccc" }}>
                              ★
                            </span>
                          ))}
                        </div>

                        {/* 💬 Review Text */}
                        <div title={feedback.Description}>
                          {feedback.Description}
                        </div>

                      </td>                    <td>
                        <div style={{ fontWeight: '500' }}>{new Date(feedback.Feedback_DateTime).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {new Date(feedback.Feedback_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${feedback.IsActive === "1" ? "optimal" : "neutral"}`}>
                          {feedback.IsActive === "1" ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="icon-btn-lux delete"
                          onClick={() => handleDeleteFeedback(feedback.Feedback_ID)}
                          title="Delete Feedback"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManageFeedback;
