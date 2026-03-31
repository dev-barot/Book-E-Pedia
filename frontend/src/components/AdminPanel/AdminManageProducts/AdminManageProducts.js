// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AdminSidebar from "../AdminSidebar/AdminSidebar";
// import AdminNavbar from "../AdminNavbar/AdminNavbar";
// import "./AdminManageProducts.css";

// function AdminManageProducts() {
//   const [productList, setProductList] = useState([]);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/products/");
//       if (!response.ok) throw new Error("Failed to fetch products");
//       const data = await response.json();
//       console.log("Raw response from /api/products/:", data);
//       setProductList(data.data || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProductList([]);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleEdit = (product) => {
//     navigate("/admin/add-products", { state: { product } });
//   };

//   const handleDelete = async (productId) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
//           method: "DELETE",
//         });
//         if (!response.ok) throw new Error("Failed to delete product");
//         fetchProducts(); // Refresh list
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   const handleSidebarToggle = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
//       <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminNavbar onToggleSidebar={handleSidebarToggle} />
//       </div>
//       <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminSidebar isCollapsed={isSidebarCollapsed} />
//       </div>
//       <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
//         <Link to="/admin/add-products" className="btn btn-primary">
//           <i className="fa fa-plus-circle"></i> Add Product
//         </Link>
//         <div className="admin-view-book-type-container">
//           <h1 className="admin-view-book-type-title">Manage Products</h1>
//           <table className="admin-view-book-type-table">
//             <thead>
//               <tr>
//                 <th>Product ID</th>
//                 <th>Product Name</th>
//                 <th>Description</th>
//                 <th>Category</th>
//                 <th>Book Type</th>
//                 <th>Author</th>
//                 <th>Publisher</th>
//                 <th>Language</th>
//                 <th>Pages</th>
//                 <th>Duration</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Cover Image</th>
//                 <th>Back Image</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {productList.length === 0 ? (
//                 <tr>
//                   <td colSpan="15">No products available</td>
//                 </tr>
//               ) : (
//                 productList.map((product) => (
//                   <tr key={product.Product_ID}>
//                     <td>{product.Product_ID}</td>
//                     <td>{product.Product_Name}</td>
//                     <td>{product.Product_Description}</td>
//                     <td>{product.Category_ID?.Category_Name || "N/A"}</td>
//                     <td>{product.Book_Name}</td>
//                     <td>{product.Author}</td>
//                     <td>{product.Publisher}</td>
//                     <td>{product.Language}</td>
//                     <td>{product.Number_of_Pages || "N/A"}</td>
//                     <td>{product.Time_Duration || "N/A"}</td>
//                     <td>{product.Product_Price}</td>
//                     <td>{product.Stock}</td>
//                     <td>
//                       {product.Cover_Image && (
//                         <img
//                           src={`http://127.0.0.1:8000${product.Cover_Image}`}
//                           alt="Cover"
//                           width={50}
//                         />
//                       )}
//                     </td>
//                     <td>
//                       {product.Back_Image && (
//                         <img
//                           src={`http://127.0.0.1:8000${product.Back_Image}`}
//                           alt="Back"
//                           width={50}
//                         />
//                       )}
//                     </td>
//                     <td>
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="admin-view-book-type-edit-btn"
//                       >
//                         <i className="fa-solid fa-pen"></i>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.Product_ID)}
//                         className="admin-view-book-type-delete-btn"
//                       >
//                         <i className="fa-solid fa-trash-can"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminManageProducts;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AdminSidebar from "../AdminSidebar/AdminSidebar";
// import AdminNavbar from "../AdminNavbar/AdminNavbar";
// import "./AdminManageProducts.css";

// function AdminManageProducts() {
//   const [productList, setProductList] = useState([]);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/products/");
//       if (!response.ok) throw new Error("Failed to fetch products");
//       const data = await response.json();
//       console.log("Raw response from /api/products/:", data);
//       setProductList(data.data || []);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProductList([]);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleEdit = (product) => {
//     navigate("/admin/add-products", { state: { product } });
//   };

//   const handleDelete = async (productId) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       try {
//         const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
//           method: "DELETE",
//         });
//         if (!response.ok) throw new Error("Failed to delete product");
//         fetchProducts(); // Refresh list
//       } catch (error) {
//         console.error("Error deleting product:", error);
//       }
//     }
//   };

//   const handleSidebarToggle = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   // Function to get book type names based on active fields
//   const getBookTypes = (bookTypeDetails) => {
//     const types = [];
//     if (bookTypeDetails.Physical_Book === "1") types.push("Physical Book");
//     if (bookTypeDetails.Audio_Book === "1") types.push("Audio Book");
//     if (bookTypeDetails.E_Book === "1") types.push("E-Book");
//     if (bookTypeDetails.Video_Book === "1") types.push("Video Book");
//     return types.length > 0 ? types.join(", ") : "N/A";
//   };

//   return (
//     <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
//       <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminNavbar onToggleSidebar={handleSidebarToggle} />
//       </div>
//       <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminSidebar isCollapsed={isSidebarCollapsed} />
//       </div>
//       <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
//         <Link to="/admin/add-products" className="btn btn-primary">
//           <i className="fa fa-plus-circle"></i> Add Product
//         </Link>
//         <div className="admin-view-book-type-container">
//           <h1 className="admin-view-book-type-title">Manage Products</h1>
//           <table className="admin-view-book-type-table">
//             <thead>
//               <tr>
//                 <th>Product ID</th>
//                 <th>Product Name</th>
//                 <th>Description</th>
//                 <th>Category</th>
//                 <th>Book Type</th>
//                 <th>Author</th>
//                 <th>Publisher</th>
//                 <th>Language</th>
//                 <th>Pages</th>
//                 <th>Duration</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Cover Image</th>
//                 <th>Back Image</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {productList.length === 0 ? (
//                 <tr>
//                   <td colSpan="15">No products available</td>
//                 </tr>
//               ) : (
//                 productList.map((product) => (
//                   <tr key={product.Product_ID}>
//                     <td>{product.Product_ID}</td>
//                     <td>{product.Product_Name}</td>
//                     <td>{product.Product_Description}</td>
//                     <td>{product.Category_Name || "N/A"}</td>
//                     <td>{getBookTypes(product.Book_Type_Details || {})}</td> {/* Use function to get types */}
//                     <td>{product.Author || "N/A"}</td>
//                     <td>{product.Publisher || "N/A"}</td>
//                     <td>{product.Language || "N/A"}</td>
//                     <td>{product.Number_of_Pages || "N/A"}</td>
//                     <td>{product.Time_Duration || "N/A"}</td>
//                     <td>{product.Product_Price}</td>
//                     <td>{product.Stock}</td>
//                     <td>
//                       {product.Cover_Photo && (
//                         <img
//                           src={`http://127.0.0.1:8000${product.Cover_Photo}`}
//                           alt="Cover"
//                           width={50}
//                         />
//                       )}
//                     </td>
//                     <td>
//                       {product.Back_Photo && (
//                         <img
//                           src={`http://127.0.0.1:8000${product.Back_Photo}`}
//                           alt="Back"
//                           width={50}
//                         />
//                       )}
//                     </td>
//                     <td>
//                       <button
//                         onClick={() => handleEdit(product)}
//                         className="admin-view-book-type-edit-btn"
//                       >
//                         <i className="fa-solid fa-pen"></i>
//                       </button>
//                       <button
//                         onClick={() => handleDelete(product.Product_ID)}
//                         className="admin-view-book-type-delete-btn"
//                       >
//                         <i className="fa-solid fa-trash-can"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminManageProducts;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageProducts.css";

function AdminManageProducts() {
  const [productList, setProductList] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/");
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
          `http://127.0.0.1:8000/api/delete-product/${productId}/`,
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

  const getBookTypes = (bookTypeDetails) => {
    const types = [];
    if (bookTypeDetails?.Physical_Book === "1") types.push("Physical");
    if (bookTypeDetails?.Audio_Book === "1") types.push("Audio");
    if (bookTypeDetails?.E_Book === "1") types.push("E-Book");
    if (bookTypeDetails?.Video_Book === "1") types.push("Video");
    return types.length > 0 ? types.join(", ") : "N/A";
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
        
        {/* HEADER SECTION */}

        <div className="admin-action-bar">
  <Link 
    to="/admin/add-products" 
    className="btn-primary-lux action-bar-btn"
    style={{ textDecoration: 'none' }}
  >
    <span className="add-btn-content">
      <i className="fa-solid fa-plus-circle"></i> Add Product
    </span>
  </Link>
</div>

{/* TITLE SECTION */}
<div className="admin-header-titles centered">
  <h1 className="text-gradient-lux">Product Inventory</h1>
  <p>Administer staff, roles, and employee records.</p>
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
                            src={`http://127.0.0.1:8000${product.cover_photo}`}
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
  );
}

export default AdminManageProducts;
