import React, { useState, useEffect } from "react";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerProfile.css";
import { BASE_URL } from "../../../utils/config";

function CustomerProfile() {
  const [customer, setCustomer] = useState({
    Fname: "",
    Lname: "",
    Email: "",
    Phone_Number: "",
    DOB: "",
    Gender: "",
    Building: "",
    Country: "",
    Street: "",
    City: "",
    State: "",
    Pincode: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [originalCustomer, setOriginalCustomer] = useState(customer);
  const [message, setMessage] = useState("");

  const customerId = localStorage.getItem("customer_id");

  useEffect(() => {
    if (customerId) {
      fetch(`${BASE_URL}/api/customer/${customerId}/`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Cust_ID) {
            setCustomer((prev) => ({ ...prev, ...data }));
            setOriginalCustomer((prev) => ({ ...prev, ...data }));
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
  }, [customerId]);

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
    fetch(`${BASE_URL}/api/customer/${customerId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(customer)
    })
    .then(res => res.json())
    .then(data => {
      if (data.bool) {
        setIsEditing(false);
        setOriginalCustomer(customer);
        setMessage("Profile updated successfully! 🎉");
      } else {
        setMessage("Failed to update profile: " + data.msg);
      }
    })
    .catch(err => {
      console.error(err);
      setMessage("An error occurred");
    });
  };

  if (isLoading) {
    return (
      <div className="cust-lux-body">
        <CustomerSidebar />
        <div className="cust-lux-main">
          <h2 style={{color: '#1A3B5C', textAlign: 'center', marginTop: '50px'}}>Loading Profile...</h2>
        </div>
      </div>
    );
  }

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
              { label: "First Name", id: "Fname", type: "text", icon: "fa-user", constant: false },
              { label: "Last Name", id: "Lname", type: "text", icon: "fa-user", constant: false },
              { label: "Email Address", id: "Email", type: "email", icon: "fa-envelope", constant: true },
              { label: "Phone Number", id: "Phone_Number", type: "tel", icon: "fa-phone", constant: true },
              { label: "Date of Birth", id: "DOB", type: "text", icon: "fa-calendar", constant: true },
              { label: "Gender (M/F)", id: "Gender", type: "text", icon: "fa-venus-mars", constant: false },
              { label: "Building / Flat No", id: "Building", type: "text", icon: "fa-building", constant: false },
              { label: "Street Address", id: "Street", type: "text", icon: "fa-map-marker-alt", constant: false },
              { label: "City", id: "City", type: "text", icon: "fa-city", constant: false },
              { label: "State", id: "State", type: "text", icon: "fa-map", constant: false },
              { label: "Pincode", id: "Pincode", type: "text", icon: "fa-map-pin", constant: false },
              { label: "Country", id: "Country", type: "text", icon: "fa-globe", constant: false },
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
                      value={customer[id] || ''}
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

export default CustomerProfile;
