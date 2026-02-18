import React from 'react';
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import './HeaderFooter.css'; // Import your CSS file for styling

const Footer = () => {
  return (
    <footer className='main-home-footer'>
      <div className="footer-content">
        <div className="top">
          <div className="logo-details">
            <i className="fab fa-slack"></i>
            <span className="logo_name">Book-E-Pedia</span>
          </div>
          {/* <div className="media-icons">
            <Nav.Link as={Link} to="/"><i className="fab fa-facebook-f"></i></Nav.Link>
            <Nav.Link as={Link} to="/"><i className="fab fa-twitter"></i></Nav.Link>
            <Nav.Link as={Link} to="/"><i className="fab fa-instagram"></i></Nav.Link>
            <Nav.Link as={Link} to="/"><i className="fab fa-linkedin-in"></i></Nav.Link>
            <Nav.Link as={Link} to="/"><i className="fab fa-youtube"></i></Nav.Link>
          </div> */}
        </div>
        <div className="link-boxes">
          <ul className="box">
            <li className="link_title-name">Company</li>
            <li><Nav.Link as={Link} to="/">Home</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Contact us</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">About us</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Get started</Nav.Link></li>
          </ul>
          <ul className="box">
            <li className="link_title-name">Services</li>
            <li><Nav.Link as={Link} to="/">Physical Books</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">E-Books</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Audio Books</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Videos</Nav.Link></li>
          </ul>
          <ul className="box">
            <li className="link_title-name">Account</li>
            <li><Nav.Link as={Link} to="/">Profile</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">My account</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Cart</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Purchase</Nav.Link></li>
          </ul>
          {/* <ul className="box">
            <li className="link_title-name">Resources</li>
            <li><Nav.Link as={Link} to="/">Blog</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Support</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Developer</Nav.Link></li>
            <li><Nav.Link as={Link} to="/">Library</Nav.Link></li>
          </ul>
          <ul className="box input-box">
            <li className="link_title-name">Subscribe</li>
            <li><input type="text" placeholder="Enter your email" /></li>
            <li><input type="button" value="Subscribe" /></li>
          </ul> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

