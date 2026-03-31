// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from 'react-router-dom';
// // import AdminSidebar from "../AdminSidebar/AdminSidebar";
// // import AdminNavbar from "../AdminNavbar/AdminNavbar";
// // import './AdminManageBookType.css';

// // function AdminManageBookType() {
// //   const [bookTypes, setBookTypes] = useState([]);
// //   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
// //   const navigate = useNavigate();

// //   // Fetch the book types from the backend API
// //   useEffect(() => {
// //     fetch('http://127.0.0.1:8000/api/booktypes/')
// //       .then((res) => {
// //         if (!res.ok) {
// //           throw new Error('Network response was not ok');
// //         }
// //         return res.json();
// //       })
// //       .then((data) => {
// //         // Ensure data is an array (DRF returns { results: [...] } with pagination)
// //         setBookTypes(data.results || data);  // Handle both paginated and non-paginated responses
// //         console.log('Fetched book types:', data);
// //       })
// //       .catch((error) => console.error('Error fetching book types:', error));
// //   }, []);

// //   const handleEdit = (book) => {
// //     navigate("/admin/add-booktype", { state: { book } });
// //   };

// //   const handleDelete = (id) => {
// //     // Confirm deletion
// //     if (window.confirm("Are you sure you want to delete this book type?")) {
// //       // You can handle deletion logic here (e.g., call API to delete the book type)
// //     }
// //   };

// //   const handleSidebarToggle = () => {
// //     setIsSidebarCollapsed(!isSidebarCollapsed);
// //   };

// //   return (
// //     <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
// //       <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
// //         <AdminNavbar onToggleSidebar={handleSidebarToggle} />
// //       </div>

// //       <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
// //         <AdminSidebar isCollapsed={isSidebarCollapsed} />
// //       </div>

// //       <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
// //         <Link to="/admin/add-booktype" className="btn btn-primary">
// //           Add New Book Type
// //         </Link>

// //         <div className="admin-view-book-type-container">
// //           <h1 className="admin-view-book-type-title">Book Type List</h1>
// //           <table className="admin-view-book-type-table">
// //             <thead>
// //               <tr>
// //                 <th>Book ID</th>
// //                 <th>Book Name</th>
// //                 <th>Physical Book</th>
// //                 <th>Audio Book</th>
// //                 <th>E-Book</th>
// //                 <th>Video Book</th>
// //                 <th>Is Active</th>
// //                 <th>Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {bookTypes.length > 0 ? (
// //                 bookTypes.map((book) => (
// //                   <tr key={book.Book_ID}>
// //                     <td>{book.Book_ID}</td>
// //                     <td>{book.Book_Name}</td>
// //                     <td>{book.Physical_Book}</td>
// //                     <td>{book.Audio_Book}</td>
// //                     <td>{book.E_Book}</td>
// //                     <td>{book.Video_Book}</td>
// //                     <td>{book.IsActive === "1" ? "Active" : "Inactive"}</td>
// //                     <td>
// //                       <button
// //                         className="admin-view-book-type-edit-btn"
// //                         onClick={() => handleEdit(book)}
// //                       >
// //                         <i className="fa-solid fa-pen"></i>
// //                       </button>
// //                       <button
// //                         className="admin-view-book-type-delete-btn"
// //                         onClick={() => handleDelete(book.Book_ID)}
// //                       >
// //                         <i className="fa-solid fa-trash-can"></i>
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan="8" className="admin-view-book-type-no-data">
// //                     No book types found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default AdminManageBookType;
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import AdminSidebar from "../AdminSidebar/AdminSidebar";
// import AdminNavbar from "../AdminNavbar/AdminNavbar";
// import "../AdminCommon.css";
// import './AdminManageBookType.css';

// function AdminManageBookType() {
//   const [bookTypes, setBookTypes] = useState([]);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const navigate = useNavigate();

//   // Fetch the book types from the backend API
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/booktypes/')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         console.log('Raw response from /api/booktypes/:', data); // Debug log
//         // Extract the 'data' array from the paginated response
//         setBookTypes(data.data || []);
//       })
//       .catch((error) => console.error('Error fetching book types:', error));
//   }, []);

//   const handleEdit = (book) => {
//     navigate("/admin/add-booktype", { state: { book } });
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this book type?")) {
//       // Add deletion logic here (e.g., API call)
//       console.log(`Delete book with ID: ${id}`);
//     }
//   };

//   const handleSidebarToggle = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
//       {/* Premium ambient animated background elements */}
//       <div className="dashboard-ambient-bg">
//         <div className="ambient-orb orb-1"></div>
//         <div className="ambient-orb orb-2"></div>
//         <div className="ambient-orb orb-3"></div>
//       </div>

//       <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminNavbar onToggleSidebar={handleSidebarToggle} />
//       </div>

//       <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
//         <AdminSidebar isCollapsed={isSidebarCollapsed} />
//       </div>

//       <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
//         {/* HEADER SECTION */}

//         <div className="admin-action-bar">
//   <Link 
//     to="/admin/add-booktype" 
//     className="btn-primary-lux action-bar-btn"
//     style={{ textDecoration: 'none' }}
//   >
//     <span className="add-btn-content">
//       <i className="fa-solid fa-plus-circle"></i> Add Book Type
//     </span>
//   </Link>
// </div>

// {/* TITLE SECTION */}
// <div className="admin-header-titles centered">
//   <h1 className="text-gradient-lux">Book Type Management</h1>
//   <p>Administer staff, roles, and employee records.</p>
// </div>

//         {/* DATA TABLE SECTION */}
//         <div className="admin-table-wrapper glass-card">
//           <table className="admin-lux-table">
//             <thead>
//               <tr>
//                 <th>Book ID</th>
//                 <th>Book Name</th>
//                 <th>Physical</th>
//                 <th>Audio</th>
//                 <th>E-Book</th>
//                 <th>Video</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookTypes.length > 0 ? (
//                 bookTypes.map((book) => (
//                   <tr key={book.Book_ID}>
//                     <td className="id-cell">#{book.Book_ID}</td>
//                     <td className="name-cell">{book.Book_Name}</td>
//                     <td>{book.Physical_Book === "1" ? <i className="fa-solid fa-check text-green-500" style={{color: '#10b981'}}></i> : <i className="fa-solid fa-xmark text-red-500" style={{color: '#ef4444'}}></i>}</td>
//                     <td>{book.Audio_Book === "1" ? <i className="fa-solid fa-check text-green-500" style={{color: '#10b981'}}></i> : <i className="fa-solid fa-xmark text-red-500" style={{color: '#ef4444'}}></i>}</td>
//                     <td>{book.E_Book === "1" ? <i className="fa-solid fa-check text-green-500" style={{color: '#10b981'}}></i> : <i className="fa-solid fa-xmark text-red-500" style={{color: '#ef4444'}}></i>}</td>
//                     <td>{book.Video_Book === "1" ? <i className="fa-solid fa-check text-green-500" style={{color: '#10b981'}}></i> : <i className="fa-solid fa-xmark text-red-500" style={{color: '#ef4444'}}></i>}</td>
//                     <td>
//                       <span className={`status-badge ${book.IsActive === '1' ? 'optimal' : 'critical'}`}>
//                         <i className={`fa-solid ${book.IsActive === '1' ? 'fa-check-circle' : 'fa-xmark-circle'}`}></i>
//                         {book.IsActive === '1' ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="actions-cell">
//                       <button className="icon-btn-lux edit" onClick={() => handleEdit(book)} title="Edit">
//                         <i className="fa-solid fa-pen"></i>
//                       </button>
//                       <button className="icon-btn-lux delete" onClick={() => handleDelete(book.Book_ID)} title="Delete">
//                         <i className="fa-solid fa-trash-can"></i>
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="empty-state-cell">
//                     <div className="empty-state-content">
//                       <i className="fa-solid fa-book-open empty-icon"></i>
//                       <p>No book types found.</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminManageBookType;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "./AdminManageBookType.css";

function AdminManageBookType() {
  const [bookTypes, setBookTypes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const fetchBookTypes = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/book-types/");
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
        `http://127.0.0.1:8000/api/delete-book-type/${id}/`,
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
    <h2>Manage Book Types</h2>

    <Link to="/admin/add-booktype" className="btn btn-primary">
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

export default AdminManageBookType;