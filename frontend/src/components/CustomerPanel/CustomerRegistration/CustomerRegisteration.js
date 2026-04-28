import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerRegisteration.css";
import { BASE_URL } from "../../../utils/config";

function CustomerRegisteration() {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const [registerFormData, setRegisterFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    number: "",
    pwd: "",
    pwd_confirm: "",
    gen: "",
    date: "",
    building: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const [showAddress, setShowAddress] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const inputHandler = (event) => {
    setRegisterFormData({
      ...registerFormData,
      [event.target.name]: event.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};
    const { fname, lname, email, number, pwd, pwd_confirm, gen, date, building, street, city, state, country, pincode } =
      registerFormData;

    if (!/^[a-zA-Z]{1,20}$/.test(fname)) {
      newErrors.fname = "First name must be 1-20 alphabets only.";
    }

    if (!/^[a-zA-Z]{1,25}$/.test(lname)) {
      newErrors.lname = "Last name must be 1-25 alphabets only.";
    }

    if (!/^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com)$/.test(email)) {
      newErrors.email = "Invalid email. Use @gmail.com or @yahoo.com.";
    }

    if (!/^\d{10}$/.test(number)) {
      newErrors.number = "Phone number must be exactly 10 digits.";
    }

    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%-_^&*])[A-Za-z\d!@#-$%_^&*]{8,15}$/.test(pwd)
    ) {
      newErrors.pwd = "Must be 8-15 chars, include uppercase, digit, special char.";
    }

    if (pwd !== pwd_confirm || pwd_confirm === "") {
      newErrors.pwd_confirm = "Passwords do not match.";
    }

    if (!gen) {
      newErrors.gen = "Please select your gender.";
    }

    if (!date) {
      newErrors.date = "Please select your date of birth.";
    } else {
      const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
      if (age < 18) {
        newErrors.date = "You must be at least 18 years old.";
      }
    }

    if (showAddress) {
      if (!building || building.trim().length < 1) newErrors.building = "Building/Flat No is required.";
      if (!street || street.trim().length < 2) newErrors.street = "Street name is required (min 2 chars).";
      if (!city || city.trim().length < 2) newErrors.city = "City is required.";
      if (!state || state.trim().length < 2) newErrors.state = "State is required.";
      if (!country || country.trim().length < 2) newErrors.country = "Country is required.";
      if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    setErrorMsg(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerFormData),
      });

      const data = await response.json();

      if (data.bool) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setErrorMsg({});
        setRegisterFormData({
          fname: "", lname: "", email: "", number: "",
          pwd: "", pwd_confirm: "", gen: "", date: "",
          building: "", street: "", city: "", state: "", country: "", pincode: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg({ general: data.msg });
      }
    } catch (error) {
      setErrorMsg({ general: "Server error. Try again." });
    }
  };

  // Field configs
  const personalFields = [
    { label: "First Name", name: "fname", type: "text", maxLength: 20, hint: "Letters only, max 20 chars" },
    { label: "Last Name", name: "lname", type: "text", maxLength: 25, hint: "Letters only, max 25 chars" },
    { label: "Email Address", name: "email", type: "email", hint: "e.g. name@gmail.com" },
    { label: "Phone Number", name: "number", type: "number", hint: "10-digit mobile number" },
    { label: "Password", name: "pwd", type: "password", minLength: 8, maxLength: 15, hint: "8-15 chars, uppercase + digit + special char" },
    { label: "Confirm Password", name: "pwd_confirm", type: "password", hint: "Re-enter your password" },
  ];

  const addressFields = [
    { label: "Building / Flat No", name: "building", type: "text", maxLength: 50, hint: "e.g. Flat 4B, Sun Tower" },
    { label: "Street", name: "street", type: "text", maxLength: 150, hint: "e.g. MG Road" },
    { label: "City", name: "city", type: "text", maxLength: 30, hint: "e.g. Ahmedabad" },
    { label: "State", name: "state", type: "text", maxLength: 20, hint: "e.g. Gujarat" },
    { label: "Country", name: "country", type: "text", maxLength: 25, hint: "e.g. India" },
    { label: "Pincode", name: "pincode", type: "number", hint: "6-digit pincode" },
  ];

  // Max date to force 18+ DOB
  const maxDOB = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
    .toISOString().split("T")[0];

  const renderField = (field) => (
    <div className="reg-input-box" key={field.name} style={{ position: "relative" }}>
      <span className="reg-details">
        {field.label} <span style={{ color: "#e53e3e" }}>*</span>
      </span>
      <input
        type={field.type === "password" && showPwd ? "text" : field.type}
        placeholder={field.hint}
        name={field.name}
        value={registerFormData[field.name]}
        onChange={inputHandler}
        maxLength={field.maxLength || undefined}
        minLength={field.minLength || undefined}
        required={!addressFields.some(f => f.name === field.name)}
        style={field.type === "password" ? { paddingRight: "40px" } : {}}
      />
      {field.type === "password" && (
        <span
          onClick={() => setShowPwd(!showPwd)}
          style={{
            position: "absolute", right: "15px", top: "38px",
            cursor: "pointer", userSelect: "none", fontSize: "16px",
          }}
        >
          {showPwd ? "🙈" : "👁️"}
        </span>
      )}
      {errorMsg[field.name] && (
        <span className="error-message">{errorMsg[field.name]}</span>
      )}
    </div>
  );

  return (
    <div className="reg-body">
      <div className="reg-container">
        <div className="reg-title">Create Account</div>

        <div className="reg-content">
          {successMsg && (
            <p style={{ fontSize: "1.1em", fontWeight: "bold", color: "green", textAlign: "center", marginBottom: "12px" }}>
              ✅ {successMsg}
            </p>
          )}
          {errorMsg.general && (
            <p style={{ fontSize: "1em", fontWeight: "bold", color: "#c0392b", textAlign: "center", marginBottom: "12px" }}>
              ❌ {errorMsg.general}
            </p>
          )}

          <form onSubmit={submitHandler} noValidate>

            {/* ── Personal Info ── */}
            <div style={{ width: "100%", marginBottom: "8px" }}>
              <p style={{
                fontWeight: 700, color: "#1f4e79", fontSize: "0.95rem",
                borderBottom: "2px solid #2f6da3", paddingBottom: "6px",
                letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                👤 Personal Information
              </p>
            </div>

            <div className="reg-user-details">
              {personalFields.map(renderField)}

              {/* Gender & DOB */}
              <div className="gender-date-wrapper">
                <div className="reg-input-box">
                  <span className="reg-details">
                    Gender <span style={{ color: "#e53e3e" }}>*</span>
                  </span>
                  <select name="gen" value={registerFormData.gen} onChange={inputHandler} required>
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {errorMsg.gen && <span className="error-message">{errorMsg.gen}</span>}
                </div>

                <div className="reg-input-box">
                  <span className="reg-details">
                    Date of Birth <span style={{ color: "#e53e3e" }}>*</span>
                  </span>
                  <input
                    type="date"
                    name="date"
                    value={registerFormData.date}
                    onChange={inputHandler}
                    max={maxDOB}
                    required
                  />
                  {errorMsg.date && <span className="error-message">{errorMsg.date}</span>}
                </div>
              </div>
            </div>

            {/* ── Address ── */}
            <div
              className="address-toggle-header"
              onClick={() => setShowAddress(!showAddress)}
              style={{ cursor: "pointer", transition: "all 0.3s ease" }}
            >
              <p style={{
                fontWeight: 700, color: "#1f4e79", fontSize: "0.95rem",
                borderBottom: "2px solid #2f6da3", paddingBottom: "6px",
                letterSpacing: "0.5px", textTransform: "uppercase",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <span>📍 Address Details (Optional)</span>
                <span style={{ fontSize: "1.2rem" }}>{showAddress ? "−" : "+"}</span>
              </p>
            </div>

            <div className={`address-fields-container ${showAddress ? "expanded" : "collapsed"}`}>
              <div className="reg-user-details">
                {addressFields.map(renderField)}
              </div>
            </div>

            <button type="submit" className="reg-button">
              Create Account
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegisteration;