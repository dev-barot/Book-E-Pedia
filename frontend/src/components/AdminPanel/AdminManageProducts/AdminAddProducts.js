import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminAddProducts.css";
import { BASE_URL } from "../../../utils/config";

function AdminAddProducts() {
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
        const productResponse = await fetch(`${BASE_URL}/api/products/`);
        if (!productResponse.ok) throw new Error("Failed to fetch products");
        const productData = await productResponse.json();
        const products = productData.data || [];
        const maxId = products.length > 0 ? Math.max(...products.map(p => p.Product_ID)) : 0;
        setNextProductId(maxId + 1);

        const categoryResponse = await fetch(`${BASE_URL}/api/category/`);
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.data || []);

        const bookTypeResponse = await fetch(`${BASE_URL}/api/book-types/`);
        if (!bookTypeResponse.ok) throw new Error("Failed to fetch book types");
        const bookTypeData = await bookTypeResponse.json();
        setBookTypes(bookTypeData.data || []);

        const employeeResponse = await fetch(`${BASE_URL}/api/employees/`);
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
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit]);

  const [formData, setFormData] = useState({
    Product_Name: productToEdit?.name || "",
    Category_ID: productToEdit?.category_id || "",
    Book_ID: productToEdit?.book_id || "",
    Emp_ID: productToEdit?.emp_id || "",
    Product_Description: productToEdit?.description || "",
    Author: productToEdit?.author || "",
    Publisher: productToEdit?.publisher || "",
    Language: productToEdit?.language || "",
    Number_of_Pages: productToEdit?.pages || "",
    Time_Duration: productToEdit?.duration || "",
    Product_Price: productToEdit?.price || "",
    Stock: productToEdit?.stock || "",
    Cover_Image: null,
    Back_Image: null,
    IsActive: productToEdit?.is_active ? "1" : "0"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nextProductId && !productToEdit) {
      setFormData((prev) => ({ ...prev, Product_ID: nextProductId }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextProductId, productToEdit]);

const handleChange = (e) => {
    const { name, value, type, files } = e.target;
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
  
    const selectedBook = bookTypes.find(bt => String(bt.id) === String(formData.Book_ID));

    if (
      selectedBook &&
      (selectedBook.physical === "1" ||
        selectedBook.ebook === "1")
    ) {
      if (!formData.Number_of_Pages || Number(formData.Number_of_Pages) <= 0) {
        newErrors.Number_of_Pages = "Enter a valid number of pages.";
      }
    }

    if (
      selectedBook &&
      (selectedBook.audio === "1" ||
        selectedBook.video === "1")
    ) {
      if (!formData.Time_Duration.trim()) {
        newErrors.Time_Duration = "Duration is required.";
      }
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
      const productId = productToEdit?.id;

      const url = productId
        ? `${BASE_URL}/api/products/${productId}/`
        : `${BASE_URL}/api/products/`;

      const method = productId ? "POST" : "POST";

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
  
      navigate("/admin/manage-products");
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
                  name="Category_ID"
                  value={formData.Category_ID}
                  onChange={handleChange}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option
                      key={`cat-${cat.Category_ID}`}
                      value={cat.Category_ID}
                    >
                      {cat.Category_Name}
                    </option>
                  ))}
                </select>
                {errors.Category_ID && <p className="error-text">*{errors.Category_ID}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Book_ID">Book Type</label>
                <select
                  name="Book_ID"
                  value={formData.Book_ID}
                  onChange={handleChange}
                >
                  <option value="">-- Select Book Type --</option>
                  {bookTypes.map((book) => (
                    <option
                      key={`book-${book.id}`}
                      value={book.id}
                    >
                      {book.name}
                    </option>
                  ))}
                </select>
                {errors.Book_ID && <p className="error-text">*{errors.Book_ID}</p>}
              </div>
              <div className="admin-add-product-field">
                <label htmlFor="Emp_ID">Employee</label>
               <select
                  name="Emp_ID"
                  value={formData.Emp_ID}
                  onChange={handleChange}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.id} - {emp.fname} {emp.lname}
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
                    src={productToEdit.Cover_Image.startsWith('http') ? productToEdit.Cover_Image : `${BASE_URL}${productToEdit.Cover_Image}`}
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
                    src={productToEdit.Back_Image.startsWith('http') ? productToEdit.Back_Image : `${BASE_URL}${productToEdit.Back_Image}`}
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

export default AdminAddProducts;
