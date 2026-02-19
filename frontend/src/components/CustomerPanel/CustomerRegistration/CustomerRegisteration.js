import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerRegisteration.css";
import axios from "axios";

function CustomerRegisteration() {
  const navigate = useNavigate(); // Initialize navigation

  const baseUrl = "http://127.0.0.1:8000/api";
  const [formError,setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
      [event.target.name]: event.target.value
    });
  };

  const validate = () => {
    let newErrors = {};
    const { fname, lname, email, number, pwd, pwd_confirm, gen, date } = registerFormData;

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

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/.test(pwd)) {
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

  const submitHandler = (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!validate()) {
        return; // Stop submission if validation fails
    }

    const formData = new FormData();
    formData.append('fname', registerFormData.fname);
    formData.append('lname', registerFormData.lname);
    formData.append('email', registerFormData.email);
    formData.append('number', registerFormData.number);
    formData.append('pwd', registerFormData.pwd);
    formData.append('pwd_confirm', registerFormData.pwd_confirm);
    formData.append('gen', registerFormData.gen);
    formData.append('date', registerFormData.date);

    // Submit Data
    axios.post(baseUrl + '/register/', formData)
    .then(function (response) {
        console.log(response.data); // Log the full response
        if (response.data.bool === false) {  // when registration fails
            // Check if the error message is related to email or phone number
            if (response.data.msg.includes("Email already exists")) {
                setErrorMsg({ email: response.data.msg, number: '' }); // Set specific error message for email
            } else if (response.data.msg.includes("Phone number already exists")) {
                setErrorMsg({ number: response.data.msg, email: '' }); // Set specific error message for phone number
            } else {
                setErrorMsg({ email: response.data.msg, number: '' }); // Default to email error
            }
            setSuccessMsg(''); // Clear success message
        } else {    // when registration is successful
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
            setErrorMsg(''); // Clear error message
            setSuccessMsg(response.data.msg); // Set success message
        }
    })
    .catch(function (error) {
        console.log(error);
        setErrorMsg({ email: "An error occurred. Please try again.", number: '' }); // Handle unexpected errors
    });
};


//   const submitHandler = (event) => {
//     event.preventDefault(); // Prevent default form submission

//     if (!validate()) {
//         return; // Stop submission if validation fails
//     }

//     const formData = new FormData();
//     formData.append('fname', registerFormData.fname);
//     formData.append('lname', registerFormData.lname);
//     formData.append('email', registerFormData.email);
//     formData.append('number', registerFormData.number);
//     formData.append('pwd', registerFormData.pwd);
//     formData.append('pwd_confirm', registerFormData.pwd_confirm);
//     formData.append('gen', registerFormData.gen);
//     formData.append('date', registerFormData.date);

//     // Submit Data
//     axios.post(baseUrl + '/register/', formData)
//     .then(function (response) {
//         console.log(response.data); // Log the full response
//         if (response.data.bool === false) {  // when registration fails
//             setErrorMsg(response.data.msg);
//             setSuccessMsg(''); // Clear success message
//         } else {    // when registration is successful
//             setRegisterFormData({
//                 fname: "",
//                 lname: "",
//                 email: "",
//                 number: "",
//                 pwd: "",
//                 pwd_confirm: "",
//                 gen: "",
//                 date: "",
//             });
//             setErrorMsg(''); // Clear error message
//             setSuccessMsg(response.data.msg); // Set success message
//         }
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
// };

  return (
    <div className="reg-body">
      <div className="reg-container">
        <div className="reg-title">Registration</div>
        <div className="reg-content">
        {successMsg && <p className="text-success" 
    style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'green' }}>{successMsg}</p>}
          <form>
            <div className="reg-user-details">
              <div className="reg-input-box">
                <span className="reg-details">First Name</span>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  name="fname"
                  value={registerFormData.fname}
                  onChange={inputHandler}
                />
                {errorMsg.fname && <span className="error-message">{errorMsg.fname}</span>}
              </div>

              <div className="reg-input-box">
                <span className="reg-details">Last Name</span>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  name="lname"
                  value={registerFormData.lname}
                  onChange={inputHandler}
                />
                {errorMsg.lname && <span className="error-message">{errorMsg.lname}</span>}
              </div>

              <div className="reg-input-box">
                <span className="reg-details">Email</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={registerFormData.email}
                  onChange={inputHandler}
                />
                {errorMsg.email && <span className="error-message">{errorMsg.email}</span>}
              </div>

              <div className="reg-input-box">
    <span className="reg-details">Phone Number</span>
    <input
        type="number"
        placeholder="Enter your phone number"
        name="number"
        value={registerFormData.number}
        onChange={inputHandler}
    />
    {errorMsg.number && <span className="error-message">{errorMsg.number}</span>}
</div>

              <div className="reg-input-box">
                <span className="reg-details">Password</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  name="pwd"
                  value={registerFormData.pwd}
                  onChange={inputHandler}
                />
                {errorMsg.pwd && <span className="error-message">{errorMsg.pwd}</span>}
              </div>

              <div className="reg-input-box">
                <span className="reg-details">Confirm Password</span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  name="pwd_confirm"
                  value={registerFormData.pwd_confirm}
                  onChange={inputHandler}
                />
                {errorMsg.pwd_confirm && <span className="error-message">{errorMsg.pwd_confirm}</span>}
              </div>

              <div className="gender-date-wrapper">
                <div className="reg-input-box">
                  <span className="reg-details">Gender</span>
                  <select
                    name="gen"
                    value={registerFormData.gen}
                    onChange={inputHandler}
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {errorMsg.gen && <span className="error-message">{errorMsg.gen}</span>}
                </div>

                <div className="reg-input-box">
                  <span className="reg-details">Date of Birth</span>
                  <input
                    type="date"
                    name="date"
                    value={registerFormData.date}
                    onChange={inputHandler}
                  />
                  {errorMsg.date && <span className="error-message">{errorMsg.date}</span>}
                </div>
              </div>
            </div>

            <button type="button" onClick={submitHandler} className="reg-button">
                  Submit
              </button>

          
          </form>
          
           
        </div>
      </div>
    </div>
  );
}

export default CustomerRegisteration;
