import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageCategory.css";

function AdminManageCategory() {
  const [categories, setCategories] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/category/");
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

  const handleEdit = (category) => {
    navigate("/admin/add-category", { state: { category } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/category/${id}/`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error("Failed to delete category");
        }
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
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
            <Link to="/admin/add-category" className="btn btn-primary">
              Add New Category
            </Link>
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
                  <th>Actions</th>
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
                      <td className="actions-cell">
                        <button className="icon-btn-lux edit" onClick={() => handleEdit(category)} title="Edit Category">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button className="icon-btn-lux delete" onClick={() => handleDelete(category.Category_ID)} title="Delete Category">
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
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

export default AdminManageCategory;
