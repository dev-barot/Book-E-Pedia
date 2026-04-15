import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import CustomerSidebar from "../CustomerSidebar/CustomerSidebar";
import "./CustomerDashboard.css";
import p1 from "./p1.jpeg";

function CustomerDashboard() {
const baseUrl = "http://127.0.0.1:8000";
const customerId = localStorage.getItem("customer_id");

const [customerName, setCustomerName] = useState("");
const [orderItems, setOrderItems] = useState([]);
const [totalOrders, setTotalOrders] = useState(0);

const navigate = useNavigate();

useEffect(() => {
if (customerId) {
fetchOrders();
fetchCustomerDetails();
}
}, [customerId]);

// 🔥 Fetch Orders
function fetchOrders() {
fetch(`${baseUrl}/api/customer/${customerId}/orders`)
.then((res) => res.json())
.then((data) => {
if (data && Array.isArray(data.data)) {
setOrderItems(data.data);
setTotalOrders(data.data.length);
} else {
setOrderItems([]);
setTotalOrders(0);
}
})
.catch((err) => console.error(err));
}

// 🔥 Fetch Customer
function fetchCustomerDetails() {
fetch(`${baseUrl}/api/customer/${customerId}`)
.then((res) => res.json())
.then((data) => {
setCustomerName(data.Fname || "User");
})
.catch((err) => console.error(err));
}

// 🔥 Unique Books (avoid duplicates)
const uniqueBooks = Array.from(
new Map(
orderItems.map((item) => [
item.product_details?.Product_ID,
item,
])
).values()
);

// 🔥 Format Handling
const handleAudioClick = (item) => {
const audio = item.product_details?.Book_Type_Details?.Audio_File;
if (audio) {
navigate("/audio-book", {
state: { audioFileUrl: audio, productDetails: item.product_details },
});
} else {
alert("No audio available");
}
};

const handleVideoClick = (item) => {
const video = item.product_details?.Book_Type_Details?.Video_File;
if (video) {
navigate("/video-book", {
state: { videoFileUrl: video, productDetails: item.product_details },
});
} else {
alert("No video available");
}
};

const handleEBookClick = (item) => {
const ebook = item.product_details?.Book_Type_Details?.E_Book_File;
if (ebook) {
navigate("/e-book", {
state: { eBookFileUrl: ebook, productDetails: item.product_details },
});
} else {
alert("No e-book available");
}
};

return ( <div className="cust-lux-body"> <CustomerSidebar />


  <div className="cust-lux-main">

    {/* Profile */}
    <div className="cust-profile-glass mb-5">
      <div className="cust-profile-details">
        <h1 className="cust-profile-title">Welcome, {customerName}</h1>
        <p className="cust-profile-stat">
          Total Orders: <span className="fw-bold text-dark">{totalOrders}</span>
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
      <h2 className="library-lux-title mb-4">My Library</h2>

      {uniqueBooks.length > 0 ? (
        <div className="cust-library-grid">

          {uniqueBooks.map((item) => {
            const product = item.product_details;
            const bookType = product?.Book_Type_Details;

            const hasAudio = bookType?.Audio_Book === "1" || bookType?.Audio_Book === true;
            const hasVideo = bookType?.Video_Book === "1" || bookType?.Video_Book === true;
            const hasEBook = bookType?.E_Book === "1" || bookType?.E_Book === true;

            return (
              <div key={item.Order_ID} className="cust-book-glass-card">

                {/* Image */}
                <div className="cust-book-img-box">
                  <Link to={`/product/${product?.Product_Name.replace(/\s+/g, '-').toLowerCase()}/${product?.Product_ID}`}>
                    <img
                      src={
                        product?.Cover_Photo
                          ? `${baseUrl}${product.Cover_Photo}`
                          : p1
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
          <p>Your library is empty. Start exploring books now!</p>
          <Link to="/products" className="btn-cust-lux mt-2">
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
