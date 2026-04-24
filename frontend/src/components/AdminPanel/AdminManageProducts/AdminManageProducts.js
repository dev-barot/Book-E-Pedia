import React, { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageProducts.css";
import { BASE_URL } from "../../../utils/config";

function AdminManageProducts() {
  const [productList, setProductList] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      console.log("Raw response from /api/products/:", data);
      if (data.data && Array.isArray(data.data)) {
        if (data.data.length > 0) {
          console.log("First product details:", data.data[0]);
        }
        setProductList(data.data);
      } else {
        console.error("Expected data.data to be an array but got:", data);
        setProductList([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    navigate("/admin/add-products", { state: { product } });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `${BASE_URL}/api/delete-product/${productId}/`,
          {
            method: "DELETE",
          }
        );

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

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Premium ambient animated background elements */}
      <div className="dashboard-ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <AdminSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        <div className="section admin-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Product Management</h2>
            <Link to="/admin/add-products" className="btn btn-primary">
              Add New Product
            </Link>
          </div>

        {/* DATA TABLE SECTION */}
        <div className="admin-table-wrapper glass-card" style={{ overflowX: 'auto' }}>
          <table className="admin-lux-table" style={{ minWidth: '1200px' }}>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Product Info</th>
                <th>Category</th>
                <th>Formats</th>
                <th>Author/Pub</th>
                <th>Metrics</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state-cell">
                    <div className="empty-state-content">
                      <i className="fa-solid fa-box-open empty-icon"></i>
                      <p>No products available in inventory.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                productList.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.cover_photo ? (
                        <div
                          style={{
                            width: "50px",
                            height: "65px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                          }}
                        >
                          <img
                            src={product.cover_photo.startsWith('http') ? product.cover_photo : `${BASE_URL}${product.cover_photo}`}
                            alt="Cover"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "50px",
                            height: "65px",
                            borderRadius: "6px",
                            background: "rgba(31,78,121,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <i className="fa-solid fa-image"></i>
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="name-cell">{product.name}</div>
                      <div className="desc-cell" style={{ fontSize: "0.8rem" }}>
                        #{product.id} • {product.language}
                      </div>
                    </td>

                    <td>
                      <span className="status-badge neutral">
                        {product.category_name}
                      </span>
                    </td>

                    <td>{product.book_name}</td>

                    <td>
                      <div>{product.author}</div>
                      <div style={{ fontSize: "0.8rem" }}>
                        {product.publisher}
                      </div>
                    </td>

                    <td>
                      <div>{product.pages} Pages</div>
                      <div>{product.duration}</div>
                    </td>

                    <td>₹{product.price}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          product.stock > 10
                            ? "optimal"
                            : product.stock > 0
                            ? "neutral"
                            : "critical"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="actions-cell">
                      <button
                        className="icon-btn-lux edit"
                        onClick={() => handleEdit(product)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button
                        className="icon-btn-lux delete"
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
}

export default AdminManageProducts;
