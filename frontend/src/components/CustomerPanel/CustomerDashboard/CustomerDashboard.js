import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerDashboard.css";
import p1 from "./p1.jpeg";

function CustomerDashboard() {
  const [customerName, setCustomerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Dummy Data (Frontend Only)
  useEffect(() => {
    setCustomerName("Mit Sheth");

    const dummyBooks = [
      {
        id: 1,
        name: "The Alchemist",
        image: p1,
        formats: ["Audio Book", "E-book"],
      },
      {
        id: 2,
        name: "Harry Potter",
        image: p1,
        formats: ["Video Book", "Physical Book"],
      },
      {
        id: 3,
        name: "SAGE The Power",
        image: p1,
        formats: ["Audio Book", "Video Book", "E-book"],
      },
    ];

    setOrderItems(dummyBooks);
    setTotalOrders(dummyBooks.length);
  }, []);

  const handleAudioClick = (book) => {
    alert(`Opening Audio Book: ${book.name}`);
  };

  const handleVideoClick = (book) => {
    alert(`Opening Video Book: ${book.name}`);
  };

  const handleEBookClick = (book) => {
    alert(`Opening E-Book: ${book.name}`);
  };

  return (
    <div className="cust-lux-body">
      <CustomerSidebar />

      <div className="cust-lux-main">

        {/* Profile Summary Card */}
        <div className="cust-profile-glass mb-5">
          <div className="cust-profile-details">
            <h1 className="cust-profile-title">Welcome, {customerName}</h1>
            <p className="cust-profile-stat">Total Orders: <span className="fw-bold text-dark">{totalOrders}</span></p>
            <Link to="/profile/edit" className="btn-cust-lux mt-3">
              Edit Profile
            </Link>
          </div>

          <div className="cust-profile-avatar-lux">
            <img src={p1} alt="Profile Avatar" />
          </div>
        </div>

        {/* Library Section */}
        <div className="library-lux-container">
          <h2 className="library-lux-title mb-4">My Library</h2>

          {orderItems.length > 0 ? (
            <div className="cust-library-grid">
              {orderItems.map((book) => (
                <div key={book.id} className="cust-book-glass-card">

                  <div className="cust-book-img-box">
                    <Link to={`/product-detail/${book.id}`}>
                      <img
                        src={book.image}
                        alt="Book Cover"
                      />
                    </Link>
                  </div>

                  <div className="cust-book-lux-details">
                    <h3 className="cust-book-lux-name">{book.name}</h3>

                    <div className="cust-book-lux-formats">
                      {book.formats.includes("Audio Book") && (
                        <NavLink
                          to="#"
                          title="Audio Book"
                          className="format-icon-lux"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAudioClick(book);
                          }}
                        >
                          <i className="fa fa-headphones"></i>
                        </NavLink>
                      )}

                      {book.formats.includes("Video Book") && (
                        <NavLink
                          to="#"
                          title="Video Book"
                          className="format-icon-lux"
                          onClick={(e) => {
                            e.preventDefault();
                            handleVideoClick(book);
                          }}
                        >
                          <i className="fa-solid fa-file-video"></i>
                        </NavLink>
                      )}

                      {book.formats.includes("E-book") && (
                        <NavLink
                          to="#"
                          title="E-Book"
                          className="format-icon-lux"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEBookClick(book);
                          }}
                        >
                          <i className="fa fa-book-reader"></i>
                        </NavLink>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="cust-empty-glass text-center">
              <i className="fa-solid fa-book-open-reader empty-icon-lux mb-3"></i>
              <p>Your library is empty. Start exploring books now!</p>
              <Link to="/products" className="btn-cust-lux mt-2">Browse the Shop</Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;
