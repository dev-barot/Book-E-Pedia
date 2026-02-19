import React from 'react'
import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap';
import './CustomerSidebar.css';


function CustomerSidebar() {
  const customerId = localStorage.getItem('customer_id');
  return (
        <div className="cust-sidebar">
        <h2><b>Dashboard</b></h2>
        <ul>
          <li><Nav.Link as={Link} to="/customer/dashboard"><b><i class="fas fa-tachometer-alt"></i> Dashboard</b></Nav.Link></li>
          <li><Nav.Link as={Link} to="/customer/orders"><b><i class="fa fa-book"></i> Ordered Books</b></Nav.Link></li>
          {/* <li><Nav.Link as={Link} to="/customer/profile"><b><i className="fa fa-cog" style={{ color: "grey" }}></i> Profile Settings</b></Nav.Link></li> */}
          <li>
            <Nav.Link as={Link} to={`/customer/profile/${customerId}`}>
    <b><i className="fa fa-cog"></i> Profile Settings</b>
  </Nav.Link></li>
          <li><Nav.Link as={Link} to="/customer/help-support"><b><i className="fa fa-question-circle"></i> Help & Support</b></Nav.Link></li>
          <li><Nav.Link as={Link} to="/customer/logout"><b><i className='fa fa-sign-out-alt' style={{ color: "crimson" }}></i> Logout</b></Nav.Link></li>
        </ul>
        </div>
  )
}

export default CustomerSidebar
