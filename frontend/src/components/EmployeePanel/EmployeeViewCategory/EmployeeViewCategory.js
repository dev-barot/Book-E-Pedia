import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeViewCategory.css";

function EmployeeViewCategory() {

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ✅ Load categories from localStorage
  useEffect(() => {
    const storedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(storedCategories);
  }, []);

  const handleEdit = (category) => {
    navigate("/admin/add-category", { state: { category } });
  };

  // ✅ Delete locally
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {

      const updatedCategories = categories.filter(
        (category) => category.Category_ID !== id
      );

      setCategories(updatedCategories);
      localStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );

      console.log("Category deleted:", id);
    }
  };

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
            Category List
          </h1>

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
                    <td>
                      {category.IsActive === "1"
                        ? "Active"
                        : "Inactive"}
                    </td>
                    <td>
                      <button
                        className="admin-view-book-type-edit-btn"
                        onClick={() => handleEdit(category)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button
                        className="admin-view-book-type-delete-btn"
                        onClick={() =>
                          handleDelete(category.Category_ID)
                        }
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
