import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminAddProducts.css";

function AdminAddProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product;

  const [categories] = useState([
    { Category_ID: 1, Category_Name: "Fiction" },
    { Category_ID: 2, Category_Name: "Education" }
  ]);

  const [bookTypes] = useState([
    { Book_ID: 1, Book_Name: "Physical Book", Physical_Book: "1" },
    { Book_ID: 2, Book_Name: "E-Book", E_Book: "1" },
    { Book_ID: 3, Book_Name: "Audio Book", Audio_Book: "1" }
  ]);

  const [employees] = useState([
    { Emp_ID: 1, Fname: "John", Lname: "Doe" },
    { Emp_ID: 2, Fname: "Jane", Lname: "Smith" }
  ]);

  const [formData, setFormData] = useState({
    Product_ID: productToEdit?.Product_ID || 1,
    Product_Name: productToEdit?.Product_Name || "",
    Category_ID: productToEdit?.Category_ID || "",
    Book_ID: productToEdit?.Book_ID || "",
    Emp_ID: productToEdit?.Emp_ID || "",
    Product_Description: productToEdit?.Product_Description || "",
    Author: productToEdit?.Author || "",
    Publisher: productToEdit?.Publisher || "",
    Language: productToEdit?.Language || "",
    Number_of_Pages: productToEdit?.Number_of_Pages || "",
    Time_Duration: productToEdit?.Time_Duration || "",
    Product_Price: productToEdit?.Product_Price || "",
    Stock: productToEdit?.Stock || "",
    Cover_Image: null,
    Back_Image: null,
    IsActive: productToEdit?.IsActive?.toString() || "1",
  });

  const [errors, setErrors] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.Product_Name.trim())
      newErrors.Product_Name = "Please enter Product name.";

    if (!formData.Category_ID)
      newErrors.Category_ID = "Please select Category.";

    if (!formData.Book_ID)
      newErrors.Book_ID = "Please select Book type.";

    if (!formData.Product_Price || Number(formData.Product_Price) <= 0)
      newErrors.Product_Price = "Enter valid price.";

    if (!formData.Stock || Number(formData.Stock) < 1)
      newErrors.Stock = "Stock must be at least 1.";

    if (!formData.Cover_Image && !productToEdit)
      newErrors.Cover_Image = "Cover photo required.";

    if (!formData.Back_Image && !productToEdit)
      newErrors.Back_Image = "Back photo required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Product Data (Frontend Only):", formData);

    navigate("/admin/manage-products");
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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title" style={{ textAlign: "center" }}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <form onSubmit={handleSubmit} className="admin-add-product-form">
            <div className="form-row">

              <div className="admin-add-product-field">
                <label>Product Name</label>
                <input name="Product_Name" value={formData.Product_Name} onChange={handleChange} />
                {errors.Product_Name && <p className="error-text">{errors.Product_Name}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Category</label>
                <select name="Category_ID" value={formData.Category_ID} onChange={handleChange}>
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => (
                    <option key={cat.Category_ID} value={cat.Category_ID}>
                      {cat.Category_Name}
                    </option>
                  ))}
                </select>
                {errors.Category_ID && <p className="error-text">{errors.Category_ID}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Book Type</label>
                <select name="Book_ID" value={formData.Book_ID} onChange={handleChange}>
                  <option value="">-- Select Book Type --</option>
                  {bookTypes.map(book => (
                    <option key={book.Book_ID} value={book.Book_ID}>
                      {book.Book_Name}
                    </option>
                  ))}
                </select>
                {errors.Book_ID && <p className="error-text">{errors.Book_ID}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Employee</label>
                <select name="Emp_ID" value={formData.Emp_ID} onChange={handleChange}>
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp.Emp_ID} value={emp.Emp_ID}>
                      {emp.Fname} {emp.Lname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-add-product-field">
                <label>Price</label>
                <input type="number" name="Product_Price" value={formData.Product_Price} onChange={handleChange} />
                {errors.Product_Price && <p className="error-text">{errors.Product_Price}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Stock</label>
                <input type="number" name="Stock" value={formData.Stock} onChange={handleChange} />
                {errors.Stock && <p className="error-text">{errors.Stock}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Cover Image</label>
                <input type="file" name="Cover_Image" onChange={handleChange} />
                {errors.Cover_Image && <p className="error-text">{errors.Cover_Image}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Back Image</label>
                <input type="file" name="Back_Image" onChange={handleChange} />
                {errors.Back_Image && <p className="error-text">{errors.Back_Image}</p>}
              </div>

              <button type="submit" className="admin-add-product-submit-btn">
                {productToEdit ? "Update Product" : "Add Product"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProducts;
