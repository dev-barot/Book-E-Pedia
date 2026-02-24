import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeAddProducts.css";

function EmployeeAddProducts() {
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product;

  const [categories, setCategories] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    Product_ID: "",
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
    Cover_Image: productToEdit?.Cover_Photo || "",
    Back_Image: productToEdit?.Back_Photo || "",
    IsActive: productToEdit?.IsActive || "1",
  });

  const [errors, setErrors] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ✅ Load data from localStorage
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    const storedBookTypes = JSON.parse(localStorage.getItem("bookTypes")) || [];
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    setCategories(storedCategories);
    setBookTypes(storedBookTypes);
    setEmployees(storedEmployees);

    if (!productToEdit) {
      const maxId =
        storedProducts.length > 0
          ? Math.max(...storedProducts.map((p) => p.Product_ID))
          : 0;

      setFormData((prev) => ({
        ...prev,
        Product_ID: maxId + 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        Product_ID: productToEdit.Product_ID,
      }));
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.Product_Name.trim())
      newErrors.Product_Name = "Product name required.";

    if (!formData.Category_ID)
      newErrors.Category_ID = "Select category.";

    if (!formData.Book_ID)
      newErrors.Book_ID = "Select book type.";

    if (!formData.Product_Price || formData.Product_Price <= 0)
      newErrors.Product_Price = "Enter valid price.";

    if (!formData.Stock || formData.Stock < 1)
      newErrors.Stock = "Stock must be at least 1.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const storedProducts =
      JSON.parse(localStorage.getItem("products")) || [];

    if (productToEdit) {
      const updatedProducts = storedProducts.map((product) =>
        product.Product_ID === productToEdit.Product_ID
          ? { ...formData }
          : product
      );

      localStorage.setItem("products", JSON.stringify(updatedProducts));
    } else {
      localStorage.setItem(
        "products",
        JSON.stringify([...storedProducts, formData])
      );
    }

    navigate("/employee/manage-products");
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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title" style={{ textAlign: "center" }}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h1>

          <form onSubmit={handleSubmit} className="admin-add-product-form">

            <input type="text" name="Product_Name" placeholder="Product Name"
              value={formData.Product_Name} onChange={handleChange} />
            {errors.Product_Name && <p className="error-text">{errors.Product_Name}</p>}

            <select name="Category_ID" value={formData.Category_ID} onChange={handleChange}>
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.Category_ID} value={cat.Category_ID}>
                  {cat.Category_Name}
                </option>
              ))}
            </select>

            <select name="Book_ID" value={formData.Book_ID} onChange={handleChange}>
              <option value="">-- Select Book Type --</option>
              {bookTypes.map((book) => (
                <option key={book.Book_ID} value={book.Book_ID}>
                  {book.Book_Name}
                </option>
              ))}
            </select>

            <input type="text" name="Author" placeholder="Author"
              value={formData.Author} onChange={handleChange} />

            <input type="number" name="Product_Price" placeholder="Price"
              value={formData.Product_Price} onChange={handleChange} />
            {errors.Product_Price && <p className="error-text">{errors.Product_Price}</p>}

            <input type="number" name="Stock" placeholder="Stock"
              value={formData.Stock} onChange={handleChange} />
            {errors.Stock && <p className="error-text">{errors.Stock}</p>}

            <input type="file" name="Cover_Image" onChange={handleChange} />
            <input type="file" name="Back_Image" onChange={handleChange} />

            <button type="submit" className="admin-add-product-submit-btn">
              {productToEdit ? "Update Product" : "Add Product"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAddProducts;
