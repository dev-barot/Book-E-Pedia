import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeViewCategory.css";

function EmployeeViewCategory() {
  

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
  
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/category/"); // Added /api/
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
          const response = await fetch(`http://127.0.0.1:8000/api/category/${id}/`, { // Added /api/
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
  
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
  

export default EmployeeViewCategory;
