import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FormGroup, Label, Input } from "reactstrap";
import { UserContext } from "../../Context";

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

  const submitHandler = (event) => {
    event.preventDefault();

    const adminEmail = "admin";
    const adminPassword = "admin123";

    const dummyUserEmail = "user@gmail.com";
    const dummyUserPassword = "User@123";

    // ✅ Admin Login
    if (
      loginFormData.email === adminEmail &&
      loginFormData.password === adminPassword
    ) {
      localStorage.setItem("admin_login", "true");
      navigate("/admin/dashboard");
      return;
    }

    // ✅ Dummy Customer Login
    if (
      loginFormData.email === dummyUserEmail &&
      loginFormData.password === dummyUserPassword
    ) {
      const userData = {
        Cust_ID: 1,
        Email: dummyUserEmail,
        Fname: "Mit",
        login: true,
      };

      localStorage.setItem("customer_login", "true");
      localStorage.setItem("customer_username", "Mit");
      localStorage.setItem("customer_id", "1");
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      navigate("/customer/dashboard");
      return;
    }

    // ❌ Invalid Login
    setFormError(true);
    setErrorMsg("Invalid email or password.");
  };

  const buttonEnable =
    loginFormData.email !== "" && loginFormData.password !== "";

  const togglePasswordVisibility = () =>
    setShowPassword(!showPassword);

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-right">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">
            Login to continue your reading journey.
          </p>

          <form onSubmit={submitHandler}>
            <FormGroup>
              <Label>Email</Label>
              <Input
                name="email"
                type="text"
                placeholder="Enter your email"
                value={loginFormData.email}
                onChange={inputHandler}
                required
              />

              <Label>Password</Label>

              <div className="password-wrapper">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginFormData.password}
                  onChange={inputHandler}
                  required
                />
                <span
                  className="toggle-text"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              {formError && (
                <div className="error-message">{errorMsg}</div>
              )}

              <button
                type="submit"
                disabled={!buttonEnable}
                className="login-btn"
              >
                Login
              </button>

              <div className="login-links">
                <span onClick={() => navigate("/customer/forget-password")}>
                  Forgot Password?
                </span>
                <span onClick={() => navigate("/register")}>
                  Create Account
                </span>
              </div>
            </FormGroup>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
