import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerDashboard.css";
import p1 from "./p1.jpeg";

import { BASE_URL } from "../../../utils/config";
import { getMediaUrl } from "../../../utils/mediaHelper";

function CustomerDashboard() {
  const customerId = localStorage.getItem("customer_id");

  const [customerName, setCustomerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Helper for boolean flags
  const isTrue = (val) => val === true || val === "1";

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/${customerId}/orders`
      );
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        setOrderItems(data.data);
        setTotalOrders(data.data.length);
      } else {
        setOrderItems([]);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error(err);
    }
  }, [customerId]);

  const fetchCustomerDetails = React.useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/customer/${customerId}`
      );
      const data = await res.json();
      setCustomerName(data.Fname || "User");
    } catch (err) {
      console.error(err);
    }
  }, [customerId]);

  useEffect(() => {
    if (!customerId) {
      navigate("/login");
      return;
    }

    const init = async () => {
      try {
        await fetchCustomerDetails();
        await fetchOrders();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [customerId, fetchCustomerDetails, fetchOrders]);


  // Remove duplicate books
  const uniqueBooks = Array.from(
    new Map(
      orderItems.map((item) => [
        item.product_details?.Product_ID,
        item,
      ])
    ).values()
  );

  const handleAudioClick = (item) => {
    const audio =
      item.product_details?.Book_Type_Details?.Audio_File;

    if (!audio) {
      alert("No audio available");
      return;
    }

    navigate("/audio-book", {
      state: {
        audioFileUrl: audio,
        productDetails: item.product_details,
      },
    });
  };

  const handleVideoClick = (item) => {
    const video =
      item.product_details?.Book_Type_Details?.Video_File;

    if (!video) {
      alert("No video available");
      return;
    }

    navigate("/video-book", {
      state: {
        videoFileUrl: video,
        productDetails: item.product_details,
      },
    });
  };

  const handleEBookClick = (item) => {
    const ebook =
      item.product_details?.Book_Type_Details?.E_Book_File;

    if (!ebook) {
      alert("No e-book available");
      return;
    }

    navigate("/e-book", {
      state: {
        eBookFileUrl: ebook,
        productDetails: item.product_details,
      },
    });
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  }

  return (
    <div className="cust-lux-body">
      <CustomerSidebar />

      <div className="cust-lux-main">
        {/* Profile */}
        <div className="cust-profile-glass mb-5">
          <div className="cust-profile-details">
            <h1 className="cust-profile-title">
              Welcome, {customerName}
            </h1>

            <p className="cust-profile-stat">
              Total Orders:
              <span className="fw-bold text-dark">
                {" "}
                {totalOrders}
              </span>
            </p>

            <Link to="/profile/edit" className="btn-cust-lux mt-3">
              Edit Profile
            </Link>
          </div>

          <div className="cust-profile-avatar-lux">
            <img src={p1} alt="Profile Avatar" />
          </div>
        </div>

        {/* Library */}
        <div className="library-lux-container">
          <h2 className="library-lux-title mb-4">
            My Library
          </h2>

          {uniqueBooks.length > 0 ? (
            <div className="cust-library-grid">
              {uniqueBooks.map((item) => {
                const product = item.product_details;
                const bookType = product?.Book_Type_Details;

                const hasAudio = isTrue(bookType?.Audio_Book);
                const hasVideo = isTrue(bookType?.Video_Book);
                const hasEBook = isTrue(bookType?.E_Book);

                return (
                  <div
                    key={product?.Product_ID}
                    className="cust-book-glass-card"
                  >
                    {/* Image */}
                    <div className="cust-book-img-box">
                      <Link
                        to={`/product/${product?.Product_Name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}/${product?.Product_ID}`}
                      >
                        <img
                          src={
                            getMediaUrl(product?.Cover_Photo) || p1
                          }
                          alt="Book"
                          onError={(e) => {
                            e.target.src = p1;
                          }}
                        />
                      </Link>
                    </div>

                    {/* Details */}
                    <div className="cust-book-lux-details">
                      <h3 className="cust-book-lux-name">
                        {product?.Product_Name}
                      </h3>

                      <div className="cust-book-lux-formats">
                        {hasAudio && (
                          <NavLink
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAudioClick(item);
                            }}
                          >
                            <i className="fa fa-headphones"></i>
                          </NavLink>
                        )}

                        {hasVideo && (
                          <NavLink
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleVideoClick(item);
                            }}
                          >
                            <i className="fa-solid fa-file-video"></i>
                          </NavLink>
                        )}

                        {hasEBook && (
                          <NavLink
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEBookClick(item);
                            }}
                          >
                            <i className="fa fa-book-reader"></i>
                          </NavLink>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cust-empty-glass text-center">
              <i className="fa-solid fa-book-open-reader empty-icon-lux mb-3"></i>
              <p>
                Your library is empty. Start exploring books now!
              </p>

              <Link
                to="/products"
                className="btn-cust-lux mt-2"
              >
                Browse the Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;