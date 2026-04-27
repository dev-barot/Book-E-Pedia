import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { UserContext } from "../../Context";
import { BASE_URL } from "../../utils/config";

function Login() {
  const [formError, setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const inputHandler = (event) => {
    setLoginFormData({
      ...loginFormData,
      [event.target.name]: event.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const adminEmail = "bookepedia.business@gmail.com";
    const adminPassword = "admin123";

    // Admin login stays local
    if (
      loginFormData.email === adminEmail &&
      loginFormData.password === adminPassword
    ) {
      localStorage.setItem("admin_login", "true");
      navigate("/admin/dashboard");
      return;
    }

    try {
      // Try employee login first
      const empResponse = await fetch(`${BASE_URL}/api/employee-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const empData = await empResponse.json();

      if (empData.bool) {
        localStorage.setItem("employee_login", "true");
        localStorage.setItem("employee_id", empData.emp_id);
        localStorage.setItem("employee_name", empData.emp_name);
        localStorage.setItem("employee_type", empData.emp_type);
        navigate("/employee/dashboard");
        return;
      }

      // Try customer login
      const response = await fetch(`${BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const data = await response.json();

      if (data.bool) {
        const userData = {
          Cust_ID: data.user_id,
          Email: loginFormData.email,
          Fname: data.user,
          login: true,
        };

        localStorage.setItem("customer_login", "true");
        localStorage.setItem("customer_username", data.user);
        localStorage.setItem("customer_id", data.user_id);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        navigate("/customer/dashboard");
      } else {
        setFormError(true);
        setErrorMsg("Invalid email or password");
      }
    } catch (error) {
      setFormError(true);
      setErrorMsg("Server error. Try again.");
    }
  };


  const buttonEnable =
    loginFormData.email !== "" && loginFormData.password !== "";

  const togglePasswordVisibility = () =>
    setShowPassword(!showPassword);

  return (
    <div className="login-lux-page">
      <div className="container-xxl py-5 d-flex justify-content-center align-items-center min-vh-100">

        <div className="login-glass-card p-4 p-md-5 w-100">
          <div className="row align-items-center h-100">

            {/* Left Header Box */}
            <div className="col-md-5 text-center text-md-start mb-5 mb-md-0 position-relative">
              <span className="badge-lux mb-4 d-inline-block">Book-E-Pedia</span>
              <h1 className="login-lux-title">Welcome Back</h1>
              <p className="login-lux-subtitle pe-md-4">
                Login to continue your reading journey and discover your next great book. We're excited to see you again!
              </p>
              {/* Subtle glass divider on desktop */}
              <div className="login-divider d-none d-md-block"></div>
            </div>

            {/* Right Form Box */}
            <div className="col-md-7 ps-md-5">
              <form onSubmit={submitHandler} className="login-lux-form">

                <div className="mb-4">
                  <label className="login-lux-label">Email Address</label>
                  <div className="input-icon-wrapper">
                    <i className="fa-solid fa-envelope input-lux-icon"></i>
                    <input
                      name="email"
                      type="text"
                      className="form-control-lux-auth"
                      placeholder="Enter your email"
                      value={loginFormData.email}
                      onChange={inputHandler}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="login-lux-label">Password</label>
                  <div className="input-icon-wrapper position-relative">
                    <i className="fa-solid fa-lock input-lux-icon"></i>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control-lux-auth"
                      placeholder="Enter your password"
                      value={loginFormData.password}
                      onChange={inputHandler}
                      required
                    />
                    <span
                      className="password-toggle-lux"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </span>
                  </div>
                </div>

                {formError && (
                  <div className="login-error-lux mb-3">
                    <i className="fa-solid fa-circle-exclamation me-2"></i> {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!buttonEnable}
                  className="btn-login-lux w-100 mt-3"
                >
                  Sign In
                </button>

                <div className="login-lux-links mt-4 pt-4 d-flex justify-content-between align-items-center border-top">
                  <span onClick={() => navigate("/customer/forget-password")} className="text-muted-lux cursor-pointer hover-lux">
                    Forgot Password?
                  </span>
                  <span onClick={() => navigate("/register")} className="text-primary-lux fw-bold cursor-pointer hover-lux">
                    Create Account
                  </span>
                </div>

              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;