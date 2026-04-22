import React, { useState, useEffect } from 'react';
import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";
import "../../AdminPanel/AdminDashboard/AdminDashboard.css";

function EmployeeProfile() {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profileImg: ""
  });

  // ✅ Load from localStorage
  useEffect(() => {
    const savedProfile =
      JSON.parse(localStorage.getItem("employeeProfile")) || null;

    if (savedProfile) {
      setProfileData(savedProfile);
    }
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({
          ...prev,
          profileImg: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfileData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "employeeProfile",
      JSON.stringify(profileData)
    );

    alert("Profile Updated Successfully!");
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

        <div className="container mt-4">
          <div className="card">
            <h4 className="card-header">Update Profile</h4>
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="row mb-3">
                  <label htmlFor="firstName" className="col-sm-2 col-form-label">
                    First Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="lastName" className="col-sm-2 col-form-label">
                    Last Name
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="username" className="col-sm-2 col-form-label">
                    Username
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={profileData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="email" className="col-sm-2 col-form-label">
                    Email
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={profileData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <label htmlFor="profileImg" className="col-sm-2 col-form-label">
                    Profile Image
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="file"
                      className="form-control"
                      id="profileImg"
                      onChange={handleChange}
                    />
                    {profileData.profileImg && (
                      <img
                        src={profileData.profileImg}
                        alt="Profile"
                        style={{ width: "80px", marginTop: "10px" }}
                      />
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>

              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmployeeProfile;
