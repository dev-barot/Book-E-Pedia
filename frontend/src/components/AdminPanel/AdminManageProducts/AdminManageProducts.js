import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminManageProducts.css";

function AdminManageProducts() {

  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Demo frontend data
  const [productList, setProductList] = useState([
    {
      Product_ID: 1,
      Product_Name: "The Great Book",
      Product_Description: "Sample description",
      Category_Name: "Fiction",
      Book_Type_Details: { Physical_Book: "1" },
      Author: "John Doe",
      Publisher: "ABC Publisher",
      Language: "English",
      Number_of_Pages: 250,
      Time_Duration: "",
      Product_Price: 499,
      Stock: 10,
      Cover_Photo: null,
      Back_Photo: null
    }
  ]);

  const handleEdit = (product) => {
    navigate("/admin/add-products", { state: { product } });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProductList(productList.filter(p => p.Product_ID !== productId));
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getBookTypes = (bookTypeDetails) => {
    const types = [];
    if (bookTypeDetails?.Physical_Book === "1") types.push("Physical Book");
    if (bookTypeDetails?.Audio_Book === "1") types.push("Audio Book");
    if (bookTypeDetails?.E_Book === "1") types.push("E-Book");
    if (bookTypeDetails?.Video_Book === "1") types.push("Video Book");
    return types.length > 0 ? types.join(", ") : "N/A";
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
        
        <Link to="/admin/add-products" className="btn btn-primary">
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
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {productList.length === 0 ? (
                <tr>
                  <td colSpan="13">No products available</td>
                </tr>
              ) : (
                productList.map((product) => (
                  <tr key={product.Product_ID}>
                    <td>{product.Product_ID}</td>
                    <td>{product.Product_Name}</td>
                    <td>{product.Product_Description}</td>
                    <td>{product.Category_Name || "N/A"}</td>
                    <td>{getBookTypes(product.Book_Type_Details || {})}</td>
                    <td>{product.Author || "N/A"}</td>
                    <td>{product.Publisher || "N/A"}</td>
                    <td>{product.Language || "N/A"}</td>
                    <td>{product.Number_of_Pages || "N/A"}</td>
                    <td>{product.Time_Duration || "N/A"}</td>
                    <td>{product.Product_Price}</td>
                    <td>{product.Stock}</td>
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

export default AdminManageProducts;
