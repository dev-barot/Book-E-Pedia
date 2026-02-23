import React, { useState } from 'react';
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import './AdminManageProducts.css';

function AdminViewProducts() {

  const [products, setProducts] = useState([
    {
      Product_ID: 1,
      Name: "Example Book",
      Author: "John Doe",
      Price: 19.99,
      Stock: 25
    },
    {
      Product_ID: 2,
      Name: "Another Book",
      Author: "Jane Smith",
      Price: 29.99,
      Stock: 10
    }
  ]);

  const handleEdit = (productId) => {
    alert(`Edit product with ID: ${productId}`);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.Product_ID !== productId));
    }
  };

  return (
    <div>
      <AdminSidebar />
      <AdminNavbar />

      <div className="view-products-temp content" style={{ marginLeft: "500px" }}>
        <div className="admin-panel">
          <main className="main-content">
            <section id="manage-products" className="section">
              <div className="container">
                <div className="header">
                  <h1>Manage Products</h1>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Author</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6">No products available</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.Product_ID}>
                          <td>{product.Product_ID}</td>
                          <td>{product.Name}</td>
                          <td>{product.Author}</td>
                          <td>${product.Price}</td>
                          <td>{product.Stock}</td>
                          <td className="actions">
                            <button
                              className="edit"
                              onClick={() => handleEdit(product.Product_ID)}
                            >
                              <i className="fas fa-edit"></i> Edit
                            </button>

                            <button
                              className="delete"
                              onClick={() => handleDelete(product.Product_ID)}
                            >
                              <i className="fas fa-trash-alt"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>
              </div>
            </section>
          </main>
        </div>
      </div>

      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </div>
  );
}

export default AdminViewProducts;
