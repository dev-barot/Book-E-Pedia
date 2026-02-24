import React, { useState } from "react";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerProfile.css";

function CustomerProfile() {

  // ✅ Dummy Customer Data (Frontend Only)
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
    <div className="cust-profile-body">
      <CustomerSidebar />

      <div className="cust-profile-container">
        <div className="welcome-message">
          <h1>Welcome, {customer.Fname}!</h1>

          <form className="cust-profile-form-container">
            {[
              { label: "First Name", id: "Fname", type: "text" },
              { label: "Last Name", id: "Lname", type: "text" },
              { label: "Email", id: "Email", type: "email" },
              { label: "Phone", id: "Phone_Number", type: "tel" },
              { label: "Date of Birth", id: "DOB", type: "date" },
              { label: "Gender", id: "Gender", type: "text" },
              { label: "Address", id: "Street", type: "text" },
              { label: "Nation", id: "Country", type: "text" },
            ].map(({ label, id, type }) => (
              <div className="cust-profile-form-group" key={id}>
                <label htmlFor={id}>{label}</label>
                <input
                  type={type}
                  id={id}
                  value={customer[id]}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            ))}
          </form>

          <div className="cust-profile-header">
            {message && <p className="message">{message}</p>}

            {isEditing ? (
              <button
                className="cust-profile-save-btn"
                onClick={handleSaveClick}
                disabled={
                  JSON.stringify(customer) ===
                  JSON.stringify(originalCustomer)
                }
              >
                Save
              </button>
            ) : (
              <button
                className="cust-profile-save-btn"
                onClick={handleEditClick}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
