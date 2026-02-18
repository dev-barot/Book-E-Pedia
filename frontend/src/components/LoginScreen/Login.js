import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginimg from "./istockphoto-1218656325-612x612.png";
import { FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import { UserContext } from "../../Context";

function Login() {
  const baseUrl = "http://127.0.0.1:8000/api";
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

    if (
      loginFormData.email === adminEmail &&
      loginFormData.password === adminPassword
    ) {
      localStorage.setItem("admin_login", true);
      navigate("/admin/dashboard");
    } else {
      axios
        .post(
          `${baseUrl}/login/`,
          {
            email: loginFormData.email,
            password: loginFormData.password,
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          if (response.data.bool === false) {
            setFormError(true);
            setErrorMsg(response.data.msg);
          } else {
            const userData = {
              Cust_ID: response.data.user_id,
              Email: loginFormData.email,
              Fname: response.data.user,
              login: true,
            };
            localStorage.setItem("customer_login", "true");
            localStorage.setItem("customer_username", response.data.user);
            localStorage.setItem("customer_id", response.data.user_id);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            navigate("/customer/dashboard");
          }
        })
        .catch(() => {
          setFormError(true);
          setErrorMsg("An error occurred. Please try again.");
        });
    }
  };

  const buttonEnable =
    loginFormData.email !== "" && loginFormData.password !== "";

  const togglePasswordVisibility = () =>
    setShowPassword(!showPassword);

  return (
    <div className="login-page">
      <div className="login-card">

      

        {/* RIGHT SIDE FORM */}
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
