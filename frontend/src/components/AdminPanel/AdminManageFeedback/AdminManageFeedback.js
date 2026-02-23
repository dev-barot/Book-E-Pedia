import React, { useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminManageFeedback.css';

function AdminManageFeedback() {

  // Static demo data (frontend only)
  const [feedbacks, setFeedbacks] = useState([
    {
      Feedback_ID: 1,
      Product_ID: 101,
      Cust_ID: 501,
      Description: "Great product quality!",
      Feedback_DateTime: new Date().toISOString(),
      IsActive: "1"
    },
    {
      Feedback_ID: 2,
      Product_ID: 102,
      Cust_ID: 502,
      Description: "Delivery was slightly late.",
      Feedback_DateTime: new Date().toISOString(),
      IsActive: "0"
    }
  ]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id) => {
    const updatedFeedbacks = feedbacks.filter(
      feedback => feedback.Feedback_ID !== id
    );
    setFeedbacks(updatedFeedbacks);
    alert(`Feedback with ID ${id} has been deleted.`);
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
          <h1 className="admin-view-book-type-title">Customer Feedback</h1>

          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Product ID</th>
                <th>Customer ID</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7">No feedback available</td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.Feedback_ID}>
                    <td>{feedback.Feedback_ID}</td>
                    <td>{feedback.Product_ID}</td>
                    <td>{feedback.Cust_ID}</td>
                    <td>{feedback.Description}</td>
                    <td>{new Date(feedback.Feedback_DateTime).toLocaleString()}</td>
                    <td>{feedback.IsActive === "1" ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="delete-feedback-btn"
                        onClick={() => handleDeleteFeedback(feedback.Feedback_ID)}
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
  );
}

export default AdminManageFeedback;
