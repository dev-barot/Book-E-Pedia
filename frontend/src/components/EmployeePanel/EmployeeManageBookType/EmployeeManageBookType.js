import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "../../AdminPanel/AdminDashboard/AdminDashboard.css";
import "./EmployeeManageBookType.css";
import { BASE_URL } from "../../../utils/config";

function EmployeeManageBookType() {
  const [bookTypes, setBookTypes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchBookTypes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/book-types/`);
      const data = await res.json();
      setBookTypes(data.data || []);
    } catch (error) {
      console.error("Error fetching book types:", error);
    }
  };

  useEffect(() => {
    fetchBookTypes();
  }, []);

  const handleEdit = (book) => {
    navigate("/admin/add-booktype", { state: { book } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book type?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/delete-book-type/${id}/`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      console.log(data);

      fetchBookTypes();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
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
     

        <div className="section admin-panel">
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    }}
  >
    <h2>Manage Book Types</h2>

    <Link to="/employee/add-booktype" className="btn btn-primary">
      Add New Book Type
    </Link>
  </div>

  
<div className="admin-table-wrapper glass-card">
  <table className="admin-lux-table">
    <thead>
      <tr>
        <th>Book ID</th>
        <th>Book Name</th>
        <th>Physical</th>
        <th>Audio</th>
        <th>E-Book</th>
        <th>Video</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {bookTypes.length > 0 ? (
        bookTypes.map((book) => (
          <tr key={book.id}>
            <td className="id-cell">#{book.id}</td>

            <td className="name-cell">{book.name}</td>

            <td>
              {book.physical === "1" ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#10b981" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ef4444" }}
                ></i>
              )}
            </td>

            <td>
              {book.audio === "1" ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#10b981" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ef4444" }}
                ></i>
              )}
            </td>

            <td>
              {book.ebook === "1" ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#10b981" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ef4444" }}
                ></i>
              )}
            </td>

            <td>
              {book.video === "1" ? (
                <i
                  className="fa-solid fa-check"
                  style={{ color: "#10b981" }}
                ></i>
              ) : (
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "#ef4444" }}
                ></i>
              )}
            </td>

            <td>
              <span
                className={`status-badge ${
                  book.is_active === "1"
                    ? "optimal"
                    : "critical"
                }`}
              >
                <i
                  className={`fa-solid ${
                    book.is_active === "1"
                      ? "fa-check-circle"
                      : "fa-xmark-circle"
                  }`}
                ></i>

                {book.is_active === "1"
                  ? "Active"
                  : "Inactive"}
              </span>
            </td>

            <td className="actions-cell">
              <button
                className="icon-btn-lux edit"
                onClick={() => handleEdit(book)}
                title="Edit"
              >
                <i className="fa-solid fa-pen"></i>
              </button>

              <button
                className="icon-btn-lux delete"
                onClick={() => handleDelete(book.id)}
                title="Delete"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="empty-state-cell">
            <div className="empty-state-content">
              <i className="fa-solid fa-book-open empty-icon"></i>
              <p>No book types found.</p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>
      </div>
    </div>
  );
}


export default EmployeeManageBookType;
