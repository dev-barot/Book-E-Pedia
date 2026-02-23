import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminAddEmployees.css';

function AdminAddEmployees() {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeToEdit = location.state?.employee;

  const [formData, setFormData] = useState({
    Emp_ID: employeeToEdit ? employeeToEdit.Emp_ID : 1,
    Emp_Type: employeeToEdit ? employeeToEdit.Emp_Type : "0",
    Fname: employeeToEdit ? employeeToEdit.Fname : "",
    Lname: employeeToEdit ? employeeToEdit.Lname : "",
    Gender: employeeToEdit ? employeeToEdit.Gender : "",
    DOB: employeeToEdit ? employeeToEdit.DOB : "",
    email: employeeToEdit ? employeeToEdit.email : "",
    Password: employeeToEdit ? employeeToEdit.Password : "",
    Phone_Number: employeeToEdit ? employeeToEdit.Phone_Number : "",
    Address: employeeToEdit ? employeeToEdit.Address : "",
    Salary: employeeToEdit ? employeeToEdit.Salary : "",
    Designation: employeeToEdit ? employeeToEdit.Designation : "",
    Emp_Photo: null,
    IsActive: employeeToEdit ? employeeToEdit.IsActive : "1",
  });

  const [errors, setErrors] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Fname.trim())
      newErrors.Fname = "Please enter First Name.";

    if (!formData.Lname.trim())
      newErrors.Lname = "Please enter Last Name.";

    if (!formData.Gender)
      newErrors.Gender = "Please select gender.";

    if (!formData.DOB)
      newErrors.DOB = "Please enter date of Birth.";

    if (!formData.email)
      newErrors.email = "Email is required.";

    if (!formData.Password)
      newErrors.Password = "Please enter Password.";

    if (!formData.Phone_Number)
      newErrors.Phone_Number = "Please enter Phone Number.";

    if (!formData.Address.trim())
      newErrors.Address = "Please enter Address.";

    if (!formData.Salary)
      newErrors.Salary = "Please enter salary.";

    if (!formData.Designation.trim())
      newErrors.Designation = "Please enter Designation.";

    if (!formData.Emp_Photo && !employeeToEdit)
      newErrors.Emp_Photo = "Employee photo is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Employee Data (Frontend Only):", formData);

    navigate("/admin/manage-employees");
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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title">
            {employeeToEdit ? "Edit Employee" : "Add Employee"}
          </h1>

          <form onSubmit={handleSubmit} className="admin-add-product-form">

            <div className="form-row">

              <div className="admin-add-product-field">
                <label>Employee Type:</label>
                <select name="Emp_Type" value={formData.Emp_Type} onChange={handleChange}>
                  <option value="1">Admin</option>
                  <option value="0">Staff</option>
                </select>
              </div>

              <div className="admin-add-product-field">
                <label>Active Status:</label>
                <select name="IsActive" value={formData.IsActive} onChange={handleChange}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              <div className="admin-add-product-field">
                <label>First Name:</label>
                <input type="text" name="Fname" value={formData.Fname} onChange={handleChange} />
                {errors.Fname && <p className="admin-manage-emp-error">{errors.Fname}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Last Name:</label>
                <input type="text" name="Lname" value={formData.Lname} onChange={handleChange} />
                {errors.Lname && <p className="admin-manage-emp-error">{errors.Lname}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Gender:</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                {errors.Gender && <p className="admin-manage-emp-error">{errors.Gender}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Date of Birth:</label>
                <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} />
                {errors.DOB && <p className="admin-manage-emp-error">{errors.DOB}</p>}
              </div>

              <div className="admin-add-product-field admin-add-product-description">
                <label>Address:</label>
                <textarea name="Address" value={formData.Address} onChange={handleChange} />
                {errors.Address && <p className="admin-manage-emp-error">{errors.Address}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="admin-manage-emp-error">{errors.email}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Password:</label>
                <input type="text" name="Password" value={formData.Password} onChange={handleChange} />
                {errors.Password && <p className="admin-manage-emp-error">{errors.Password}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Phone Number:</label>
                <input type="text" name="Phone_Number" value={formData.Phone_Number} onChange={handleChange} />
                {errors.Phone_Number && <p className="admin-manage-emp-error">{errors.Phone_Number}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Salary:</label>
                <input type="text" name="Salary" value={formData.Salary} onChange={handleChange} />
                {errors.Salary && <p className="admin-manage-emp-error">{errors.Salary}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Designation:</label>
                <input type="text" name="Designation" value={formData.Designation} onChange={handleChange} />
                {errors.Designation && <p className="admin-manage-emp-error">{errors.Designation}</p>}
              </div>

              <div className="admin-add-product-field">
                <label>Employee Photo:</label>
                <input type="file" name="Emp_Photo" onChange={handleChange} />
                {errors.Emp_Photo && <p className="admin-manage-emp-error">{errors.Emp_Photo}</p>}
              </div>

              <button type="submit" className="admin-add-product-submit-btn">
                {employeeToEdit ? "Update Employee" : "Add Employee"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddEmployees;
