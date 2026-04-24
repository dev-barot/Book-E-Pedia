import React, { useState, useEffect } from "react";
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "./EmployeeProfile.css";
import { BASE_URL } from "../../../utils/config";

function EmployeeProfile() {
  const [employee, setEmployee] = useState({
    Fname: "",
    Lname: "",
    email: "",
    Phone_Number: "",
    DOB: "",
    Gender: "",
    Address: "",
    Designation: "",
    Salary: "",
    Emp_Photo: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalEmployee, setOriginalEmployee] = useState(employee);
  const [message, setMessage] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const employeeId = localStorage.getItem("employee_id");

  useEffect(() => {
    if (employeeId) {
      fetch(`${BASE_URL}/api/employees/${employeeId}/`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Emp_ID) {
            setEmployee((prev) => ({ ...prev, ...data }));
            setOriginalEmployee((prev) => ({ ...prev, ...data }));
            if (data.Emp_Photo) {
              setImagePreview(data.Emp_Photo);
            }
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setEmployee((prev) => ({
        ...prev,
        Emp_Photo: file,
      }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(originalEmployee.Emp_Photo);
      }
    } else {
      setEmployee((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleSaveClick = () => {
    const formData = new FormData();
    for (const key in employee) {
      if (key === "Emp_Photo" && employee[key] instanceof File) {
        formData.append("Emp_Photo", employee[key]);
      } else if (key !== "Emp_Photo") {
        formData.append(key, employee[key]);
      }
    }

    fetch(`${BASE_URL}/api/employees/${employeeId}/`, {
      method: "PUT",
      body: formData,
    })
    .then(res => res.json())
    .then(data => {
      if (data.bool) {
        setIsEditing(false);
        setOriginalEmployee(employee);
        setMessage("Profile updated successfully! 🎉");
      } else {
        setMessage("Failed to update profile: " + data.msg);
      }
    })
    .catch(err => {
      console.error(err);
      setMessage("An error occurred while saving.");
    });
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
        </div>
        <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
        </div>
        <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
          <h2 style={{color: '#1A3B5C', textAlign: 'center', marginTop: '50px'}}>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-main-container ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className={`top-main-dashboard-navbar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeNavbar onToggleSidebar={handleSidebarToggle} />
      </div>

      <div className={`sidebar-main-section ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <EmployeeSidebar isCollapsed={isSidebarCollapsed} />
      </div>

      <div className={`dashboard-main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
        
        <div className="profile-header-lux mb-5">
          <h1 className="profile-title-lux">Welcome, {employee.Fname}!</h1>
          <p className="profile-subtitle-lux">Manage your personal information and preferences.</p>
        </div>

        <div className="profile-glass-card">
          
          <div className="profile-card-header mb-4">
            <h3 className="profile-section-title">Employee Details</h3>
            
            {message && <span className="profile-success-msg"><i className="fas fa-check-circle me-1"></i> {message}</span>}

            <div className="profile-actions">
              {isEditing ? (
                <button
                  className="btn-save-lux"
                  onClick={handleSaveClick}
                >
                  <i className="fas fa-save me-2"></i> Save Changes
                </button>
              ) : (
                <button
                  className="btn-edit-lux"
                  onClick={handleEditClick}
                >
                  <i className="fas fa-edit me-2"></i> Edit Profile
                </button>
              )}
            </div>
          </div>

          <form className="profile-lux-form row g-4">
            
            <div className="col-md-12 text-center mb-3">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2980b9'}} />
              ) : (
                <div style={{width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#a0b6c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '3rem', color: 'white'}}>
                  <i className="fas fa-user"></i>
                </div>
              )}
              {isEditing && (
                <div className="mt-3">
                   <label htmlFor="Emp_Photo" className="btn btn-outline-primary" style={{cursor: 'pointer', border: '2px solid #2980b9', borderRadius: '8px', padding: '5px 15px', fontWeight: 'bold', color: '#2980b9'}}>Change Photo</label>
                   <input type="file" id="Emp_Photo" accept="image/*" onChange={handleInputChange} style={{display: 'none'}} />
                </div>
              )}
            </div>

            {[
              { label: "First Name", id: "Fname", type: "text", icon: "fa-user", constant: false },
              { label: "Last Name", id: "Lname", type: "text", icon: "fa-user", constant: false },
              { label: "Email Address", id: "email", type: "email", icon: "fa-envelope", constant: true },
              { label: "Phone Number", id: "Phone_Number", type: "tel", icon: "fa-phone", constant: false },
              { label: "Date of Birth", id: "DOB", type: "date", icon: "fa-calendar", constant: false },
              { label: "Gender (M/F)", id: "Gender", type: "text", icon: "fa-venus-mars", constant: false },
              { label: "Address", id: "Address", type: "text", icon: "fa-map-marker-alt", constant: false },
              { label: "Designation", id: "Designation", type: "text", icon: "fa-briefcase", constant: true },
              { label: "Salary", id: "Salary", type: "text", icon: "fa-rupee-sign", constant: true },
            ].map(({ label, id, type, icon, constant }) => (
              <div className="col-md-6" key={id}>
                <div className="profile-input-group">
                  <label htmlFor={id} className="profile-label-lux">{label}</label>
                  <div className="input-icon-wrapper-lux">
                    <i className={`fas ${icon} input-lux-icon`}></i>
                    <input
                      type={type}
                      id={id}
                      className={`form-control-lux ${(!isEditing || constant) ? 'input-readonly' : ''}`}
                      style={constant ? { opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.2)' } : {}}
                      value={employee[id] || ''}
                      onChange={handleInputChange}
                      readOnly={!isEditing || constant}
                      disabled={constant}
                    />
                  </div>
                </div>
              </div>
            ))}
          </form>

        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
