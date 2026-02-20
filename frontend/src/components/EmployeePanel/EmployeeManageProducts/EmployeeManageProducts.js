import EmployeeSidebar from '../EmployeeSidebar/EmployeeSidebar';
import React, { useState, useEffect } from "react";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import { Link } from "react-router-dom";
import "./EmployeeManageProducts.css";
import { useNavigate } from "react-router-dom";

function EmployeeManageProducts() {

  const [productList, setProductList] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      console.log("Raw response from /api/products/:", data);
      setProductList(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    navigate("/employee/add-products", { state: { product } });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete product");
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Function to get book type names based on active fields
  const getBookTypes = (bookTypeDetails) => {
    const types = [];
    if (bookTypeDetails.Physical_Book === "1") types.push("Physical Book");
    if (bookTypeDetails.Audio_Book === "1") types.push("Audio Book");
    if (bookTypeDetails.E_Book === "1") types.push("E-Book");
    if (bookTypeDetails.Video_Book === "1") types.push("Video Book");
    return types.length > 0 ? types.join(", ") : "N/A";
  };

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>
      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>
      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <Link to="/employee/add-products" className="btn btn-primary">
          <i className="fa fa-plus-circle"></i> Add Product
        </Link>
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Manage Products</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Book Type</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Language</th>
                <th>Pages</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Cover Image</th>
                <th>Back Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.length === 0 ? (
                <tr>
                  <td colSpan="15">No products available</td>
                </tr>
              ) : (
                productList.map((product) => (
                  <tr key={product.Product_ID}>
                    <td>{product.Product_ID}</td>
                    <td>{product.Product_Name}</td>
                    <td>{product.Product_Description}</td>
                    <td>{product.Category_Name || "N/A"}</td>
                    <td>{getBookTypes(product.Book_Type_Details || {})}</td> {/* Use function to get types */}
                    <td>{product.Author || "N/A"}</td>
                    <td>{product.Publisher || "N/A"}</td>
                    <td>{product.Language || "N/A"}</td>
                    <td>{product.Number_of_Pages || "N/A"}</td>
                    <td>{product.Time_Duration || "N/A"}</td>
                    <td>{product.Product_Price}</td>
                    <td>{product.Stock}</td>
                    <td>
                      {product.Cover_Photo && (
                        <img
                          src={`http://127.0.0.1:8000${product.Cover_Photo}`}
                          alt="Cover"
                          width={50}
                        />
                      )}
                    </td>
                    <td>
                      {product.Back_Photo && (
                        <img
                          src={`http://127.0.0.1:8000${product.Back_Photo}`}
                          alt="Back"
                          width={50}
                        />
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(product)}
                        className="admin-view-book-type-edit-btn"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(product.Product_ID)}
                        className="admin-view-book-type-delete-btn"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



export default EmployeeManageProducts;
