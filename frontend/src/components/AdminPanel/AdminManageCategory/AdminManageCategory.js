import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminManageCategory.css";

function AdminManageCategory() {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Static demo data (frontend only)
  const [categories, setCategories] = useState([
    {
      Category_ID: 1,
      Category_Name: "Fiction",
      Category_Description: "Stories that contain imaginary events and characters.",
      IsActive: "1"
    },
    {
      Category_ID: 2,
      Category_Name: "Education",
      Category_Description: "Academic and learning-related books.",
      IsActive: "0"
    }
  ]);

  const handleEdit = (category) => {
    navigate("/admin/add-category", { state: { category } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(category => category.Category_ID !== id));
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
        
        <Link to="/admin/add-category" className="btn btn-primary">
          <i className="fa fa-plus-circle"></i> Add Category
        </Link>

        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Category List</h1>

          <table className="admin-view-book-type-table">
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
                    <td>{category.Category_ID}</td>
                    <td>{category.Category_Name}</td>
                    <td>{category.Category_Description}</td>
                    <td>{category.IsActive === '1' ? 'Active' : 'Inactive'}</td>
                    <td>
                      <button
                        className="admin-view-book-type-edit-btn"
                        onClick={() => handleEdit(category)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button
                        className="admin-view-book-type-delete-btn"
                        onClick={() => handleDelete(category.Category_ID)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="admin-view-book-type-no-data">
                    No categories found.
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

export default AdminManageCategory;
