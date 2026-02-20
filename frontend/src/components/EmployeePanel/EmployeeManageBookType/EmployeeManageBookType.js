import { React, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import './EmployeeManageBookType.css';

function EmployeeManageBookType() {

  const [bookTypes, setBookTypes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Fetch the book types from the backend API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/booktypes/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Raw response from /api/booktypes/:', data); // Debug log
        // Extract the 'data' array from the paginated response
        setBookTypes(data.data || []);
      })
      .catch((error) => console.error('Error fetching book types:', error));
  }, []);

  const handleEdit = (book) => {
    navigate("/employee/add-booktype", { state: { book } });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book type?")) {
      // Add deletion logic here (e.g., API call)
      console.log(`Delete book with ID: ${id}`);
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
        <Link to="/employee/add-booktype" className="btn btn-primary">
          Add New Book Type
        </Link>
        <div className="admin-view-book-type-container">
          <h1 className="admin-view-book-type-title">Book Type List</h1>
          <table className="admin-view-book-type-table">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Name</th>
                <th>Physical Book</th>
                <th>Audio Book</th>
                <th>E-Book</th>
                <th>Video Book</th>
                <th>Is Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookTypes.length > 0 ? (
                bookTypes.map((book) => (
                  <tr key={book.Book_ID}>
                    <td>{book.Book_ID}</td>
                    <td>{book.Book_Name}</td>
                    <td>{book.Physical_Book === "1" ? "Yes" : "No"}</td> {/* Check string "1" */}
                    <td>{book.Audio_Book === "1" ? "Yes" : "No"}</td>
                    <td>{book.E_Book === "1" ? "Yes" : "No"}</td>
                    <td>{book.Video_Book === "1" ? "Yes" : "No"}</td>
                    <td>{book.IsActive === "1" ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="admin-view-book-type-edit-btn"
                        onClick={() => handleEdit(book)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="admin-view-book-type-delete-btn"
                        onClick={() => handleDelete(book.Book_ID)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="admin-view-book-type-no-data">
                    No book types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default EmployeeManageBookType;
