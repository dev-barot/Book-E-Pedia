import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeViewFeedback.css";

function EmployeeViewFeedback() {

  const [feedbackList, setFeedbackList] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ✅ Load feedback from localStorage
  useEffect(() => {
    const storedFeedback =
      JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbackList(storedFeedback);
  }, []);

  const handleSidebarToggle = () =>
    setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>

        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">
            Customer Feedback
          </h1>

          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {feedbackList.length > 0 ? (
                feedbackList.map((feedback, index) => (
                  <tr key={index}>
                    <td>{feedback.Feedback_ID || index + 1}</td>
                    <td>{feedback.Product_Name || "N/A"}</td>
                    <td>{feedback.Customer_Name || "N/A"}</td>
                    <td>{feedback.Description}</td>
                    <td>
                      {feedback.Date
                        ? new Date(feedback.Date).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-view-book-type-no-data">
                    No feedback available.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default EmployeeViewFeedback;
