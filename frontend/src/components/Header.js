import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import './HeaderFooter.css'; // Import your CSS file for styling
import { CartContext, UserContext } from '../Context';

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { cartData, setCartData } = useContext(CartContext);

  const cartItems = cartData ? cartData.length : 0;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('customer_login');
    localStorage.removeItem('customer_username');
    localStorage.removeItem('customer_id');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_login');
    setUser({ login: false }); // Reset UserContext
    navigate('/login');
  };

  // Check if user is logged in (customer or admin)
  const isLoggedIn = localStorage.getItem('customer_login') === 'true' || localStorage.getItem('admin_login') === 'true';

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Optionally clear the search input after searching
    }
  };

  return (
    <header className='main-top-bar'>
      <div className="home-top-bar">
        <div className="home-container">
          <div className="home-contact-info">
            <br></br>
            <ul>
              <li><i className="fas fa-phone"> </i> +91-9924184931</li>
              <li><i className="fas fa-envelope"> </i> bookepedia.business@gmail.com</li>
              <li><i className="fas fa-map-marker-alt"> </i> Ahmedabad</li>
            </ul>
          </div>
          <div className="link-right">
            <ul>
              {!isLoggedIn ? (
                <li>
                  <Nav.Link as={Link} to="/login" style={{ textDecoration: 'none', color: 'rgb(255, 255, 255)' }}>
                    <i className="fas fa-user-plus"> </i>Log/Sign Up
                  </Nav.Link>
                </li>
              ) : (
                <li>
                  <Nav.Link as={Link} to="#" onClick={handleLogout} style={{ textDecoration: 'none', color: 'rgb(255, 255, 255)' }}>
                    <i className="fas fa-sign-out-alt"> </i>Logout
                  </Nav.Link>
                </li>
              )}
              <li>
                <Nav.Link as={Link} to="/cart" style={{ textDecoration: 'none', color: 'white' }}>
                  <i className="fas fa-shopping-cart"> </i>Cart{cartItems > 0 && ` (${cartItems})`}
                </Nav.Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Navbar (Link for pages) */}
      <div className="header">
        <nav className="navbar">
          <div className="logo">Book-E-Pedia</div>
          <ul className="nav-links">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-home"></i> Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/categories" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa-solid fa-icons"></i> Category
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/products" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa-solid fa-basket-shopping"></i> Shop
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/aboutus" 
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-info-circle"></i> About Us
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={isLoggedIn ? (localStorage.getItem('admin_login') === 'true' ? '/admin/dashboard' : '/customer/dashboard') : '/login'}
                className={({ isActive }) => (isActive ? "active-link" : "")}>
                <i className="fa fa-user"></i> Account
              </NavLink>
            </li>
          </ul>
        
          <form className="search-top-bar" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="What do you want to read?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Header;