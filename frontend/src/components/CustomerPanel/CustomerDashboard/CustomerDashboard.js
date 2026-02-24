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
    <div className="cust-body">
      <CustomerSidebar />

      <div className="cust-main-content">

        {/* Profile Summary Card */}
        <div className="cust-profile-card">
          <div className="cust-profile-details">
            <h1>Welcome, {customerName}</h1>
            <p>Total Orders: {totalOrders}</p>
            <Link to="/profile/edit" className="cust-profile-edit-btn">
              Edit Profile
            </Link>
          </div>

          <div className="cust-profile-avatar">
            <img src={p1} alt="Profile Avatar" />
          </div>
        </div>

        {/* Library Section */}
        <div className="library-container">
          <h2>My Library</h2>

          {orderItems.length > 0 ? (
            <div className="cust-library">
              {orderItems.map((book) => (
                <div key={book.id} className="cust-book-card">

                  <Link to={`/product-detail/${book.id}`}>
                    <img
                      src={book.image}
                      alt="Book Cover"
                      className="cust-book-image"
                    />
                  </Link>

                  <div className="cust-book-details">
                    <h3>{book.name}</h3>

                    <div className="cust-book-formats">

                      {book.formats.includes("Audio Book") && (
                        <NavLink
                          to="#"
                          title="Audio Book"
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
            <p className="cust-empty-library">
              Your library is empty. Start exploring books now!
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;
