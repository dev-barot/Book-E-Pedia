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
  });

  const inputHandler = (event) => {
    setRegisterFormData({
      ...registerFormData,
      [event.target.name]: event.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};
    const { fname, lname, email, number, pwd, pwd_confirm, gen, date } =
      registerFormData;

    if (!/^[a-zA-Z]{1,20}$/.test(fname)) {
      newErrors.fname = "First name must be 1-20 alphabets long.";
    }

    if (!/^[a-zA-Z]{1,25}$/.test(lname)) {
      newErrors.lname = "Last name must be 1-25 alphabets long.";
    }

    if (!/^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com)$/.test(email)) {
      newErrors.email = "Invalid email. Use @gmail.com or @yahoo.com.";
    }

    if (!/^\d{10}$/.test(number)) {
      newErrors.number = "Phone number must be exactly 10 digits.";
    }

    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/.test(pwd)
    ) {
      newErrors.pwd =
        "Must be 8-15 chars, include uppercase, digit, special char.";
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

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 18) {
        newErrors.date = "You must be at least 18 years old.";
      }
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerFormData),
    });

    const data = await response.json();

    if (data.bool) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setErrorMsg({});

      setRegisterFormData({
        fname: "",
        lname: "",
        email: "",
        number: "",
        pwd: "",
        pwd_confirm: "",
        gen: "",
        date: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setErrorMsg({ general: data.msg });
    }
  } catch (error) {
    setErrorMsg({ general: "Server error. Try again." });
  }
};

  return (
    <div className="reg-body">
      <div className="reg-container">
        <div className="reg-title">Registration</div>

        <div className="reg-content">
          {successMsg && (
            <p
              className="text-success"
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                color: "green",
              }}
            >
              {successMsg}
            </p>
          )}

          <form onSubmit={submitHandler}>
            <div className="reg-user-details">

              {[
                { label: "First Name", name: "fname", type: "text" },
                { label: "Last Name", name: "lname", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "number", type: "number" },
                { label: "Password", name: "pwd", type: "password" },
                { label: "Confirm Password", name: "pwd_confirm", type: "password" },
              ].map((field) => (
                <div className="reg-input-box" key={field.name}>
                  <span className="reg-details">{field.label}</span>
                  <input
                    type={field.type}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    name={field.name}
                    value={registerFormData[field.name]}
                    onChange={inputHandler}
                  />
                  {errorMsg[field.name] && (
                    <span className="error-message">
                      {errorMsg[field.name]}
                    </span>
                  )}
                </div>
              ))}

              <div className="gender-date-wrapper">
                <div className="reg-input-box">
                  <span className="reg-details">Gender</span>
                  <select
                    name="gen"
                    value={registerFormData.gen}
                    onChange={inputHandler}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {errorMsg.gen && (
                    <span className="error-message">{errorMsg.gen}</span>
                  )}
                </div>

                <div className="reg-input-box">
                  <span className="reg-details">Date of Birth</span>
                  <input
                    type="date"
                    name="date"
                    value={registerFormData.date}
                    onChange={inputHandler}
                  />
                  {errorMsg.date && (
                    <span className="error-message">{errorMsg.date}</span>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="reg-button">
              Submit
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegisteration;