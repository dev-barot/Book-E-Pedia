import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context";

function CustomerLogout() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // Clear ALL stored data for Customer, Admin, and Employee
    localStorage.removeItem("customer_login");
    localStorage.removeItem("customer_username");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("admin_login");
    localStorage.removeItem("employee_login");
    localStorage.removeItem("employee_id");
    localStorage.removeItem("employee_name");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");

    // Sync UserContext so Header updates immediately
    if (setUser) {
      setUser({ login: false });
    }

    // Redirect to Home (or Login)
    setTimeout(() => {
      navigate("/");
    }, 800);
  }, [navigate, setUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging you out...</h2>
      <p>Please wait while we redirect you.</p>
    </div>
  );
}

export default CustomerLogout;
