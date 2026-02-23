import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminAddCategory.css';

function AdminAddCategory() {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryToEdit = location.state?.category;

  const [categoryData, setCategoryData] = useState({
    Category_Name: categoryToEdit ? categoryToEdit.Category_Name : '',
    Category_Photo: null,
    Category_Description: categoryToEdit ? categoryToEdit.Category_Description : '',
    IsActive: categoryToEdit ? categoryToEdit.IsActive : '1',
  });

  const [errors, setErrors] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({
      ...categoryData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setCategoryData({
      ...categoryData,
      Category_Photo: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!categoryData.Category_Name)
      formErrors.Category_Name = 'Please enter Category Name.';
    else if (categoryData.Category_Name.length > 25)
      formErrors.Category_Name = "Category name should not be more than 25 letters.";

    if (!categoryData.Category_Photo && !categoryToEdit?.Category_Photo)
      formErrors.Category_Photo = 'Please enter Category photo.';

    if (!categoryData.Category_Description)
      formErrors.Category_Description = 'Please enter Category description.';
    else if (categoryData.Category_Description.length > 250)
      formErrors.Category_Description = "Category Description should not be more than 250 letters.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log("Category Data (Frontend Only):", categoryData);

    navigate("/admin/manage-categories");
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="admin-add-category-container admin-add-product-container">
          
          <h1 className="admin-add-category-title admin-add-product-title">
            {categoryToEdit ? "Edit Category" : "Add New Category"}
          </h1>

          <form onSubmit={handleSubmit} className="admin-add-category-form admin-add-product-form">

            <div className="form-group">
              <label htmlFor="Category_Name">Category Name</label>
              <input
                type="text"
                id="Category_Name"
                name="Category_Name"
                value={categoryData.Category_Name}
                onChange={handleChange}
                className="form-input"
              />
              {errors.Category_Name && <div className="error">{errors.Category_Name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="Category_Photo">Category Photo</label>
              <input
                type="file"
                id="Category_Photo"
                name="Category_Photo"
                onChange={handleFileChange}
                className="form-input"
              />
              {errors.Category_Photo && <div className="error">{errors.Category_Photo}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="Category_Description">Category Description</label>
              <textarea
                id="Category_Description"
                name="Category_Description"
                value={categoryData.Category_Description}
                onChange={handleChange}
                className="form-input"
              />
              {errors.Category_Description && <div className="error">{errors.Category_Description}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="IsActive">Is Active</label>
              <select
                id="IsActive"
                name="IsActive"
                value={categoryData.IsActive}
                onChange={handleChange}
                className="form-input"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              {categoryToEdit ? "Update Category" : "Add Category"}
            </button>

            {errors.submit && <div className="error">{errors.submit}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddCategory;
