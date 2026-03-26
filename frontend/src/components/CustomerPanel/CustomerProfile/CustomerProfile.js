import React, { useState } from "react";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerProfile.css";

function CustomerProfile() {

  // Dummy Customer Data (Frontend Only)
  const [customer, setCustomer] = useState({
    Fname: "Mit",
    Lname: "Sheth",
    Email: "mit@example.com",
    Phone_Number: "9876543210",
    DOB: "2002-05-15",
    Gender: "Male",
    Country: "India",
    Street: "456 Gandhinagar, Gujarat",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalCustomer, setOriginalCustomer] = useState(customer);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [id]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setOriginalCustomer(customer);
    setMessage("Profile updated successfully! 🎉");
  };

  return (
    <div className="cust-lux-body">
      <CustomerSidebar />

      <div className="cust-lux-main">
        
        <div className="profile-header-lux mb-5">
          <h1 className="profile-title-lux">Welcome, {customer.Fname}!</h1>
          <p className="profile-subtitle-lux">Manage your personal information and preferences.</p>
        </div>

        <div className="profile-glass-card">
          
          <div className="profile-card-header mb-4">
            <h3 className="profile-section-title">Account Details</h3>
            
            {message && <span className="profile-success-msg"><i className="fas fa-check-circle me-1"></i> {message}</span>}

            <div className="profile-actions">
              {isEditing ? (
                <button
                  className="btn-save-lux"
                  onClick={handleSaveClick}
                  disabled={JSON.stringify(customer) === JSON.stringify(originalCustomer)}
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
            {[
              { label: "First Name", id: "Fname", type: "text", icon: "fa-user" },
              { label: "Last Name", id: "Lname", type: "text", icon: "fa-user" },
              { label: "Email Address", id: "Email", type: "email", icon: "fa-envelope" },
              { label: "Phone Number", id: "Phone_Number", type: "tel", icon: "fa-phone" },
              { label: "Date of Birth", id: "DOB", type: "date", icon: "fa-calendar" },
              { label: "Gender", id: "Gender", type: "text", icon: "fa-venus-mars" },
              { label: "Street Address", id: "Street", type: "text", icon: "fa-map-marker-alt" },
              { label: "Country", id: "Country", type: "text", icon: "fa-globe" },
            ].map(({ label, id, type, icon }) => (
              <div className="col-md-6" key={id}>
                <div className="profile-input-group">
                  <label htmlFor={id} className="profile-label-lux">{label}</label>
                  <div className="input-icon-wrapper-lux">
                    <i className={`fas ${icon} input-lux-icon`}></i>
                    <input
                      type={type}
                      id={id}
                      className={`form-control-lux ${!isEditing ? 'input-readonly' : ''}`}
                      value={customer[id]}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
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

export default CustomerProfile;
