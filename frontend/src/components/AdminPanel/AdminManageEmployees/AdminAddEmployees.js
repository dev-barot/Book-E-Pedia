import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import './AdminAddEmployees.css';
import { BASE_URL } from "../../../utils/config";

function AdminAddEmployees() {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeToEdit = location.state?.employee;

  const [formData, setFormData] = useState({
    Emp_ID: employeeToEdit ? employeeToEdit.Emp_ID : "",
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        let value = formData[key];
        // Ensure string-based fields are strings
        if (key === "IsActive" || key === "Emp_Type") {
          value = String(value);
        }
        formDataToSend.append(key, value);
      }
    }

    try {
      const url = employeeToEdit
        ? `${BASE_URL}/api/employees/${employeeToEdit.Emp_ID}/`
        : `${BASE_URL}/api/employees/`;
      const method = "POST"; // Use POST for both add and edit due to FormData parsing limitations with PUT in Django

      const response = await fetch(url, {
        method: method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `Failed to save employee: ${response.status}`);
      }

      const data = await response.json();
      console.log("Employee saved:", data);

      navigate("/admin/manage-employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      setErrors({ submit: error.message });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Emp_ID) newErrors.Emp_ID = "Employee ID is required.";
    else if (isNaN(Number(formData.Emp_ID))) newErrors.Emp_ID = "Employee ID must be a number.";

    if (!formData.Fname.trim()) newErrors.Fname = "Please enter First Name.";
    else if (formData.Fname.length > 20) newErrors.Fname = "First name should not be more than 20 letters.";

    if (!formData.Lname.trim()) newErrors.Lname = "Please enter Last Name.";
    else if (formData.Lname.length > 25) newErrors.Lname = "Last name should not be more than 25 letters.";

    if (!formData.Gender) newErrors.Gender = "Please select gender.";

    if (!formData.DOB) newErrors.DOB = "Please enter date of Birth.";
    else if (new Date().getFullYear() - new Date(formData.DOB).getFullYear() < 18)
      newErrors.DOB = "Employee must be at least 18 years old.";

    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format.";

    if (!formData.Password) newErrors.Password = "Please enter Password.";
    else if (formData.Password.length < 8 || formData.Password.length > 15)
      newErrors.Password = "Password must be 8-15 characters.";

    if (!formData.Phone_Number) newErrors.Phone_Number = "Please enter Phone Number.";
    else if (!/^\d{10}$/.test(formData.Phone_Number)) newErrors.Phone_Number = "Phone number must be 10 digits.";

    if (!formData.Address.trim()) newErrors.Address = "Please enter Address.";
    else if (formData.Address.length > 250) newErrors.Address = "Address should not be more than 250 letters.";

    if (!formData.Salary) newErrors.Salary = "Please enter salary.";
    else if (isNaN(Number(formData.Salary))) newErrors.Salary = "Salary must be a valid number.";

    if (!formData.Designation.trim()) newErrors.Designation = "Please enter Designation.";
    else if (formData.Designation.length > 25) newErrors.Designation = "Designation should not be more than 25 letters.";

    if (!formData.Emp_Photo && !employeeToEdit) newErrors.Emp_Photo = "Employee photo is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
        <div className="admin-add-product-container">
          <h1 className="admin-add-product-title">{employeeToEdit ? "Edit Employee" : "Add Employee"}</h1>
          <form onSubmit={handleSubmit} className="admin-add-product-form">
            <div className="form-row">
              <div className="admin-add-product-field">
                <label>Employee ID:</label>
                <input 
                  type="text" 
                  name="Emp_ID" 
                  value={formData.Emp_ID} 
                  onChange={handleChange} 
                  disabled={!!employeeToEdit}
                  placeholder="Enter unique ID (e.g. 101)"
                />
                {errors.Emp_ID && <p className="admin-manage-emp-error">{errors.Emp_ID}</p>}
              </div>
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
                {employeeToEdit && employeeToEdit.Emp_Photo && (
                  <img
                    src={employeeToEdit.Emp_Photo.startsWith('http') ? employeeToEdit.Emp_Photo : `${BASE_URL}${employeeToEdit.Emp_Photo}`}
                    alt="Employee"
                    className="employee-photo-preview"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}
                {errors.Emp_Photo && <p className="admin-manage-emp-error">{errors.Emp_Photo}</p>}
              </div>
              <button type="submit" className="admin-add-product-submit-btn">
                {employeeToEdit ? "Update Employee" : "Add Employee"}
              </button>
              {errors.submit && <p className="admin-manage-emp-error">{errors.submit}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddEmployees;
