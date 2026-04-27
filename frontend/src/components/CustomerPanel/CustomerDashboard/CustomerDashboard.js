import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [missingAddress, setMissingAddress] = useState(false);

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
      // Check if address is incomplete
      const hasAddress = data.Building && data.Street && data.City && data.State && data.Country && data.Pincode;
      setMissingAddress(!hasAddress);
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
  }, [customerId, fetchCustomerDetails, fetchOrders, navigate]);


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
        {/* ── Missing Address Banner ── */}
        {missingAddress && (
          <div style={{
            background: "linear-gradient(135deg, #fff3cd, #ffeaa0)",
            border: "1px solid #f0ad4e",
            borderRadius: "12px",
            padding: "14px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 15px rgba(240,173,78,0.2)"
          }}>
            <span style={{ fontSize: "1.6rem" }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <strong style={{ color: "#856404", fontSize: "0.95rem" }}>Your delivery address is incomplete!</strong>
              <p style={{ margin: 0, color: "#856404", fontSize: "0.85rem" }}>
                Please add your address to place physical book orders.
              </p>
            </div>
            <Link
              to="/customer/profile"
              style={{
                background: "#1A4B84", color: "white",
                padding: "8px 18px", borderRadius: "30px",
                textDecoration: "none", fontWeight: 600, fontSize: "0.85rem",
                whiteSpace: "nowrap"
              }}
            >
              Update Profile
            </Link>
          </div>
        )}
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

            <Link to="/customer/profile" className="btn-cust-lux mt-3">
              Edit Profile
            </Link>
          </div>

          <div className="cust-profile-avatar-lux">
            <i className="fa-solid fa-circle-user"></i>
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
                          <button
                            className="format-badge audio"
                            onClick={() => handleAudioClick(item)}
                            title="Play Audio Book"
                          >
                            <i className="fa fa-headphones"></i>
                            <span>Audio</span>
                          </button>
                        )}

                        {hasVideo && (
                          <button
                            className="format-badge video"
                            onClick={() => handleVideoClick(item)}
                            title="Watch Video Book"
                          >
                            <i className="fa-solid fa-file-video"></i>
                            <span>Video</span>
                          </button>
                        )}

                        {hasEBook && (
                          <button
                            className="format-badge ebook"
                            onClick={() => handleEBookClick(item)}
                            title="Read E-Book"
                          >
                            <i className="fa-solid fa-book-open"></i>
                            <span>E-Book</span>
                          </button>
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