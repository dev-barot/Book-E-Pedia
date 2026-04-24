import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import "../AdminCommon.css";
import "./AdminManageEmployees.css";
import { BASE_URL } from "../../../utils/config";

function AdminManageEmployees() {
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/employees/`);
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
        const response = await fetch(`${BASE_URL}/api/employees/${id}/`, {
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
            <h2>Team Management</h2>
            <Link to="/admin/add-employees" className="btn btn-primary">
              Add Employee
            </Link>
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
                    <tr key={employee.Emp_ID}>
                      <td>
                        <div className="id-cell">#{employee.Emp_ID}</div>
                        <div className="name-cell" style={{ marginTop: '4px' }}>
                          {employee.Fname} {employee.Lname}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-regular fa-envelope" style={{ color: 'var(--color-text-muted)' }}></i> {employee.email}
                        </div>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-phone"></i> {employee.Phone_Number}
                        </div>
                      </td>
                      <td>
                        <span className="status-badge neutral" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                          {employee.Designation}
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
                          onClick={() => handleDelete(employee.Emp_ID)}
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
    </div>
  );
}

export default AdminManageEmployees;
