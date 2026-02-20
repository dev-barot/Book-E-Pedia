// export default AdminAddProducts;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeAddProducts.css";

function EmployeeAddProducts({ onAddProduct }) {
  const location = useLocation();
  const navigate = useNavigate();
  const productToEdit = location.state?.product;

  const [nextProductId, setNextProductId] = useState(null);
  const [categories, setCategories] = useState([]); // Fetch categories dynamically
  const [bookTypes, setBookTypes] = useState([]); // Fetch book types dynamically
  const [employees, setEmployees] = useState([]);

  // Fetch max Product_ID, categories, and book types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch("http://127.0.0.1:8000/api/products/");
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const productData = await productResponse.json();
        const products = productData.data || [];
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.Product_ID)) : 0;
        setNextProductId(maxId + 1);

        const categoryResponse = await fetch("http://127.0.0.1:8000/api/category/");
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.data || []);

        const bookTypeResponse = await fetch("http://127.0.0.1:8000/api/book-types/");
        if (!bookTypeResponse.ok) throw new Error("Failed to fetch book types");
        const bookTypeData = await bookTypeResponse.json();
        setBookTypes(bookTypeData.data || []);

        const employeeResponse = await fetch("http://127.0.0.1:8000/api/employees/");
        if (!employeeResponse.ok) throw new Error("Failed to fetch employees");
        const employeeData = await employeeResponse.json();
        setEmployees(employeeData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNextProductId(1);
        setCategories([]);
        setBookTypes([]);
        setEmployees([]);
      }
    };
    if (!productToEdit) fetchData();
  }, [productToEdit]);

  const [formData, setFormData] = useState({
    Product_ID: productToEdit?.Product_ID || "",
    Product_Name: productToEdit?.Product_Name || "",
    Category_ID: productToEdit?.Category_ID || "",
    Book_ID: productToEdit?.Book_ID || "",
    Emp_ID: productToEdit?.Emp_ID || "", // Ensure initial value
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
    IsActive: productToEdit?.IsActive !== undefined ? productToEdit.IsActive.toString() : "1", // Default to "1" as string
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nextProductId && !productToEdit) {
      setFormData((prev) => ({ ...prev, Product_ID: nextProductId }));
    }
  }, [nextProductId, productToEdit]);

const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const validateForm = () => {
    let newErrors = {};
  
    if (!formData.Product_Name.trim()) newErrors.Product_Name = "Please enter Product name.";
    else if (formData.Product_Name.length > 150) newErrors.Product_Name = "Product name should not be more than 150 letters.";
  
    if (!formData.Category_ID) newErrors.Category_ID = "Please select Category.";
  
    if (!formData.Book_ID) newErrors.Book_ID = "Please select Book type."; // Ensure Book_ID is validated
  
    if (!formData.Product_Description.trim()) newErrors.Product_Description = "Please enter Description of Product.";
    else if (formData.Product_Description.length > 250) newErrors.Product_Description = "Description should not be more than 250 letters.";
  
    if (!formData.Author.trim()) newErrors.Author = "Please enter Author name.";
    else if (formData.Author.length > 50) newErrors.Author = "Author name should not be more than 50 letters.";
  
    if (!formData.Publisher.trim()) newErrors.Publisher = "Please enter Publisher name.";
    else if (formData.Publisher.length > 50) newErrors.Publisher = "Publisher name should not be more than 50 letters.";
  
    if (!formData.Language.trim()) newErrors.Language = "Please enter Language.";
    else if (formData.Language.length > 20) newErrors.Language = "Language should not be more than 20 letters.";
  
    if (!formData.Product_Price || isNaN(formData.Product_Price) || Number(formData.Product_Price) <= 0) {
      newErrors.Product_Price = "Enter a valid price.";
    }
  
    if (!formData.Stock || isNaN(formData.Stock) || Number(formData.Stock) < 1) {
      newErrors.Stock = "Stock must be at least 1.";
    }
  
    if (formData.Book_ID && bookTypes.find(bt => bt.Book_ID === formData.Book_ID)?.Physical_Book === "1" || bookTypes.find(bt => bt.Book_ID === formData.Book_ID)?.E_Book === "1") {
      if (!formData.Number_of_Pages || Number(formData.Number_of_Pages) <= 0) {
        newErrors.Number_of_Pages = "Enter a valid number of pages.";
      }
    }
  
    if (formData.Book_ID && (bookTypes.find(bt => bt.Book_ID === formData.Book_ID)?.Audio_Book === "1" || bookTypes.find(bt => bt.Book_ID === formData.Book_ID)?.Video_Book === "1")) {
      if (!formData.Time_Duration.trim()) newErrors.Time_Duration = "Duration is required.";
    }
  
    if (!formData.Cover_Image && !productToEdit) newErrors.Cover_Image = "Cover photo is required.";
    if (!formData.Back_Image && !productToEdit) newErrors.Back_Image = "Back photo is required.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        if (key === "Cover_Image" || key === "Back_Image") {
          if (formData[key]) formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }
    // Debug the submitted data
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const url = productToEdit
        ? `http://127.0.0.1:8000/api/products/${productToEdit.Product_ID}/`
        : "http://127.0.0.1:8000/api/products/";
      const method = productToEdit ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save product: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Product saved:", data);
  
      if (!productToEdit) {
        setNextProductId((prev) => prev + 1);
      }
  
      navigate("/employee/manage-products");
    } catch (error) {
      console.error("Error saving product:", error);
      setErrors({ submit: error.message });
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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title" style={{ textAlign: "center" }}>
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <form onSubmit={handleSubmit} className="admin-add-product-form">
            <div className="form-row">
              <div className="admin-add-product-field">
                <label htmlFor="Product_Name">Product Name</label>
                <input
                  type="text"
                  id="Product_Name"
                  name="Product_Name"
                  value={formData.Product_Name}
                  onChange={handleChange}
                />
                {errors.Product_Name && <p className="error-text">*{errors.Product_Name}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Category_ID">Category</label>
                <select
                  id="Category_ID"
                  name="Category_ID"
                  value={formData.Category_ID}
                  onChange={handleChange}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.Category_ID} value={cat.Category_ID}>
                      {cat.Category_Name}
                    </option>
                  ))}
                </select>
                {errors.Category_ID && <p className="error-text">*{errors.Category_ID}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Book_ID">Book Type</label>
                <select
                  id="Book_ID"
                  name="Book_ID" // Changed from Book_Name to Book_ID
                  value={formData.Book_ID}
                  onChange={handleChange}
                >
                  <option value="">-- Select Book Type --</option>
                  {bookTypes.map((book) => (
                    <option key={book.Book_ID} value={book.Book_ID}>
                      {`${book.Physical_Book === "1" ? "Physical Book: " : ""}`}
                      {`${book.Audio_Book === "1" ? "Audio Book: " : ""}`}
                      {`${book.E_Book === "1" ? "E-Book: " : ""}`}
                      {`${book.Video_Book === "1" ? "Video Book: " : ""}`}
                      {book.Book_Name || `Book ID ${book.Book_ID}`} {/* Fallback to Book_ID if no Book_Name */}
                    </option>
                  ))}
                </select>
                {errors.Book_ID && <p className="error-text">*{errors.Book_ID}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Emp_ID">Employee</label>
                <select
                  id="Emp_ID"
                  name="Emp_ID"
                  value={formData.Emp_ID}
                  onChange={handleChange}
                  required // Enforce selection
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.Emp_ID} value={emp.Emp_ID}>
                      {`${emp.Fname} ${emp.Lname}`}
                    </option>
                  ))}
                </select>
                {errors.Emp_ID && <p className="error-text">*{errors.Emp_ID}</p>}
              </div>
              <div className="admin-add-product-field admin-add-product-description">
                <label htmlFor="Product_Description">Product Description</label>
                <textarea
                  id="Product_Description"
                  name="Product_Description"
                  value={formData.Product_Description}
                  onChange={handleChange}
                  placeholder="Enter a detailed description"
                />
                {errors.Product_Description && <p className="error-text">*{errors.Product_Description}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Author">Author</label>
                <input
                  type="text"
                  id="Author"
                  name="Author"
                  value={formData.Author}
                  onChange={handleChange}
                />
                {errors.Author && <p className="error-text">*{errors.Author}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Publisher">Publisher</label>
                <input
                  type="text"
                  id="Publisher"
                  name="Publisher"
                  value={formData.Publisher}
                  onChange={handleChange}
                />
                {errors.Publisher && <p className="error-text">*{errors.Publisher}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Language">Language</label>
                <input
                  type="text"
                  id="Language"
                  name="Language"
                  value={formData.Language}
                  onChange={handleChange}
                />
                {errors.Language && <p className="error-text">*{errors.Language}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Number_of_Pages">Number of Pages</label>
                <input
                  type="number"
                  id="Number_of_Pages"
                  name="Number_of_Pages"
                  value={formData.Number_of_Pages}
                  onChange={handleChange}
                />
                {errors.Number_of_Pages && <p className="error-text">*{errors.Number_of_Pages}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Time_Duration">Duration</label>
                <input
                  type="text"
                  id="Time_Duration"
                  name="Time_Duration"
                  value={formData.Time_Duration}
                  onChange={handleChange}
                />
                {errors.Time_Duration && <p className="error-text">*{errors.Time_Duration}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Product_Price">Price</label>
                <input
                  type="number"
                  id="Product_Price"
                  name="Product_Price"
                  value={formData.Product_Price}
                  onChange={handleChange}
                  step="0.01"
                />
                {errors.Product_Price && <p className="error-text">*{errors.Product_Price}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Stock">Stock</label>
                <input
                  type="number"
                  id="Stock"
                  name="Stock"
                  value={formData.Stock}
                  onChange={handleChange}
                />
                {errors.Stock && <p className="error-text">*{errors.Stock}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Cover_Image">Cover Image</label>
                <input
                  type="file"
                  id="Cover_Image"
                  name="Cover_Image"
                  onChange={handleChange}
                />
                {productToEdit && productToEdit.Cover_Image && (
                  <img
                    src={`http://127.0.0.1:8000${productToEdit.Cover_Image}`}
                    alt="Cover"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}
                {errors.Cover_Image && <p className="error-text">*{errors.Cover_Image}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Back_Image">Back Image</label>
                <input
                  type="file"
                  id="Back_Image"
                  name="Back_Image"
                  onChange={handleChange}
                />
                {productToEdit && productToEdit.Back_Image && (
                  <img
                    src={`http://127.0.0.1:8000${productToEdit.Back_Image}`}
                    alt="Back"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}
                {errors.Back_Image && <p className="error-text">*{errors.Back_Image}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="IsActive">Is Active</label>
                <select
                  id="IsActive"
                  name="IsActive"
                  value={formData.IsActive}
                  onChange={handleChange}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
                {errors.IsActive && <p className="error-text">*{errors.IsActive}</p>}
              </div>
              <button type="submit" className="admin-add-product-submit-btn">
                {productToEdit ? "Update Product" : "Add Product"}
              </button>
              {errors.submit && <p className="error-text">*{errors.submit}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAddProducts;
