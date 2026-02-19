import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerProfile.css";

function CustomerProfile() {
  const customerId = localStorage.getItem("customer_id");

  const [customer, setCustomer] = useState({
    Fname: "",
    Lname: "",
    Email: "",
    Phone_Number: "",
    DOB: "",
    Gender: "",
    Country: "",
    Street: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [originalCustomer, setOriginalCustomer] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]); // Re-fetch data when customerId changes

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customer/${customerId}/`);
      const data = await response.json();
      console.log("Fetched customer data:", data); // Debugging
      if (response.ok) {
        setCustomer(data);
        setOriginalCustomer(data);
      } else {
        console.error("Error fetching customer:", data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

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

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/customer/${customerId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );
      const data = await response.json(); // Parse response
      if (response.ok) {
        setIsEditing(false);
        setOriginalCustomer(customer);
        setMessage("Profile updated successfully! ");
      } else {
        console.error("Error updating profile:", data);
        setMessage(`Error updating profile: ${data.error || "Unknown error"} `);
      }
    } catch (error) {
      console.error("Error updating customer details:", error);
      setMessage("Network error. Please try again. ");
    }
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
                  JSON.stringify(customer) === JSON.stringify(originalCustomer)
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

// import React from 'react'
// import CustomerSidebar from '../CustomerSidebar/CustomerSidebar';
// import './CustomerProfile.css'
// import creditCard from './cc.jpg'
// import debitCard from './dc.webp'

// function CustomerProfile() {
//   return (
//     <div className="cust-profile-body">
//       <CustomerSidebar />

//       <div className="cust-profile-container">

//         <div className="welcome-message">
//           <h1>Welcome, Sara!</h1>

//         <form className="cust-profile-form-container">

//           <div className="cust-profile-form-group">
//             <label for="first-name">First Name</label>
//             <input type="text" id="first-name" placeholder="First Name" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="last-name">Last Name</label>
//             <input type="text" id="last-name" placeholder="Last Name" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="email">Email</label>
//             <input type="email" id="email" placeholder="example@example.com" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="phone">Phone</label>
//             <input type="tel" id="phone" placeholder="123-456-7890" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="dob">Date of Birth</label>
//             <input type="date" id="dob" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="gender">Gender</label>
//             <select id="gender">
//               <option value="select">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//             </select>
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="address">Address</label>
//             <input type="text" id="address" placeholder="123 Main St" />
//           </div>

//           <div className="cust-profile-form-group">
//             <label for="nation">Nation</label>
//             <input type="text" id="nation" placeholder="Country" />
//           </div>
//         </form>

//         <div className="cust-profile-payment-methods">
//           <h3>Payment Methods</h3>
//           <img src={creditCard} alt="DebitCard" />
//           <img src={debitCard} alt="CreditCard" />
//         </div>

//         <div className="cust-profile-header">

//           <button className="cust-profile-save-btn">Save</button>
//         </div>

//       </div>
//     </div>
//     </div>
//   )
// }

// export default CustomerProfile
