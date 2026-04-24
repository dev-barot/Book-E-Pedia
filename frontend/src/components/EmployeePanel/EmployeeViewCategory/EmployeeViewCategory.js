import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "../../AdminPanel/AdminDashboard/AdminDashboard.css";
import "./EmployeeViewCategory.css";
import { BASE_URL } from "../../../utils/config";

function EmployeeViewCategory() {

  const [categories, setCategories] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/category/`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);





  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

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
            <h2>Category Management</h2>

          </div>

          {/* DATA TABLE SECTION */}
          <div className="admin-table-wrapper glass-card">
            <table className="admin-lux-table">
              <thead>
                <tr>
                  <th>Category ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.Category_ID}>
                      <td className="id-cell">#{category.Category_ID}</td>
                      <td className="name-cell">{category.Category_Name}</td>
                      <td className="desc-cell">{category.Category_Description}</td>
                      <td>
                        <span className={`status-badge ${category.IsActive === '1' ? 'optimal' : 'critical'}`}>
                          <i className={`fa-solid ${category.IsActive === '1' ? 'fa-check-circle' : 'fa-xmark-circle'}`}></i>
                          {category.IsActive === '1' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state-cell">
                      <div className="empty-state-content">
                        <i className="fa-solid fa-folder-open empty-icon"></i>
                        <p>No categories found in the system.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeViewCategory;
