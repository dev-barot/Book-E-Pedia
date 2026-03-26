import React from 'react';
import { Link } from "react-router-dom";
import './HeaderFooter.css'; 

const Footer = () => {
  return (
    <footer className="footer-lux pb-4">
      <div className="container-xxl">
        <div className="row pt-5 pb-4 border-bottom border-light-subtle">
          
          {/* Brand & Socials */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="footer-brand-lux mb-4">
              <i className="fa-solid fa-book-open-reader me-2"></i>
              <span>Book-E-Pedia</span>
            </div>
            <p className="footer-text-lux pe-lg-4">
              Your ultimate luxurious destination for immersive reading. Explore our endless collection of e-books, physical books, and audiobooks.
            </p>
            <div className="footer-social-lux mt-4">
              <Link to="#" className="social-icon-lux"><i className="fab fa-facebook-f"></i></Link>
              <Link to="#" className="social-icon-lux"><i className="fab fa-twitter"></i></Link>
              <Link to="#" className="social-icon-lux"><i className="fab fa-instagram"></i></Link>
              <Link to="#" className="social-icon-lux"><i className="fab fa-linkedin-in"></i></Link>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-lg-0 ps-lg-5">
            <h5 className="footer-title-lux">Company</h5>
            <ul className="footer-links-lux">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/contactus">Contact Us</Link></li>
              <li><Link to="/products">Shop</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-title-lux">Services</h5>
            <ul className="footer-links-lux">
              <li><Link to="/products/physical">Physical Books</Link></li>
              <li><Link to="/e-book">E-Books</Link></li>
              <li><Link to="/audio-book">Audio Books</Link></li>
              <li><Link to="/video-book">Video Books</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="footer-title-lux">Account</h5>
            <ul className="footer-links-lux">
              <li><Link to="/login">Login / Register</Link></li>
              <li><Link to="/customer/profile">My Profile</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/customer/orders">Purchase History</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="row mt-4">
          <div className="col-md-6 text-center text-md-start">
            <p className="footer-copyright-lux mb-0">
              &copy; {new Date().getFullYear()} Book-E-Pedia. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <p className="footer-copyright-lux mb-0">
              Designed with <i className="fa-solid fa-heart text-danger mx-1"></i> for Readers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
