import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageEmployees.css";

function AdminManageEmployees() {
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/employees/");
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      console.log("Raw response from /api/employees/:", data); // Debug log
      setEmployeeList(data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployeeList([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    navigate("/admin/add-employees", { state: { employee } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/employees/${id}/`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }
        fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

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
{/* TOP ACTION BAR */}
<div className="admin-action-bar">
  <Link 
    to="/admin/add-employees" 
    className="btn-primary-lux action-bar-btn"
    style={{ textDecoration: 'none' }}
  >
    <span className="add-btn-content">
      <i className="fa-solid fa-plus-circle"></i> Add Employee
    </span>
  </Link>
</div>

{/* TITLE SECTION */}
<div className="admin-header-titles centered">
  <h1 className="text-gradient-lux">Team Management</h1>
  <p>Administer staff, roles, and employee records.</p>
</div>

        {/* DATA TABLE SECTION */}
        <div className="admin-table-wrapper glass-card">
          <table className="admin-lux-table">
            <thead>
              <tr>
                <th>ID & Name</th>
                <th>Contact Info</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state-cell">
                    <div className="empty-state-content">
                      <i className="fa-solid fa-users-slash empty-icon"></i>
                      <p>No Employees available in the system.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employeeList.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="id-cell">#{employee.id}</div>
                      <div className="name-cell" style={{ marginTop: '4px' }}>
                        {employee.fname} {employee.lname}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-regular fa-envelope" style={{ color: 'var(--color-text-muted)' }}></i> {employee.email}
                      </div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-phone"></i> {employee.phone}
                      </div>
                    </td>
                    <td>
                      <span className="status-badge neutral" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                        {employee.designation}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="icon-btn-lux edit"
                        onClick={() => handleEdit(employee)}
                        title="Edit Employee"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        className="icon-btn-lux delete"
                        onClick={() => handleDelete(employee.id)}
                        title="Remove Employee"
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

export default AdminManageEmployees;
