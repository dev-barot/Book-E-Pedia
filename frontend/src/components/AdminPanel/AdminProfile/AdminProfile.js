import React, { useState } from 'react';
import AdminSidebar from '../AdminSidebar/AdminSidebar';

function AdminProfile() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profileImg: null
  });

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    setFormData({
      ...formData,
      [id]: type === "file" ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
    alert("Profile updated successfully (Frontend Only)");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        
        <div className="col-md-3 col-12 mb-2">
          <AdminSidebar />
        </div>

        <div className="col-md-9 col-12 mb-2">
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
                      value={formData.firstName}
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
                      value={formData.lastName}
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
                      value={formData.username}
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
                      value={formData.email}
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

export default AdminProfile;
