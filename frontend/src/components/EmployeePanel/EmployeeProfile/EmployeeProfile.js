import { React, useState } from 'react'

import EmployeeSidebar from "../EmployeeSidebar/EmployeeSidebar";
import EmployeeNavbar from "../EmployeeNavbar/EmployeeNavbar";

function EmployeeProfile() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 col-12 mb-2">
          <EmployeeSidebar />
        </div>
        <div className="col-md-9 col-12 mb-2">
          <div className="row">
              <div className="card">
                <h4 className="card-header">Update Profile</h4>
                <div className="card-body">
                  <form>
                    <div className="row mb-3">
                      <label
                        for="firstName"
                        className="col-sm-2 col-form-label"
                      >
                        First Name
                      </label>
                      <div className="col-sm-10 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label for="lastName" className="col-sm-2 col-form-label">
                        Last Name
                      </label>
                      <div className="col-sm-10 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label for="username" className="col-sm-2 col-form-label">
                        Username
                      </label>
                      <div className="col-sm-10 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label for="email" className="col-sm-2 col-form-label">
                        Email
                      </label>
                      <div className="col-sm-10 mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label for="profileImg" className="col-sm-2 col-form-label">
                        Profile Image
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="file"
                          className="form-control"
                          id="profileImg"
                        />
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
        </div>
      </div>
      </div>
  )
}

export default EmployeeProfile
