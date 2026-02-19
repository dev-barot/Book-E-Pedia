import React from 'react';
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import './AdminManageProducts.css';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
function AdminViewProducts() {
  const handleEdit = (productId) => {
    alert(`Edit product with ID: ${productId}`);
    // Add navigation or modal logic for editing
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      alert(`Product with ID: ${productId} deleted.`);
      // Add delete logic (e.g., API call)
    }
  };

  return (
    <div>
          <AdminSidebar />
          <AdminNavbar/>
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
                    {/* Sample data - replace with dynamic data */}
                    <tr>
                      <td>1</td>
                      <td>Example Book</td>
                      <td>John Doe</td>
                      <td>$19.99</td>
                      <td>25</td>
                      <td className="actions">
                        <button
                          className="edit"
                          onClick={() => handleEdit(1)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDelete(1)}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </td>
                    </tr>
                    {/* Map dynamic rows here */}
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
