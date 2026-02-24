import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CustomerLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored data
    localStorage.removeItem("customer_login");
    localStorage.removeItem("customer_username");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("cart");

    // Simulate small delay for better UX
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging you out...</h2>
      <p>Please wait while we redirect you.</p>
    </div>
  );
}

export default CustomerLogout;
