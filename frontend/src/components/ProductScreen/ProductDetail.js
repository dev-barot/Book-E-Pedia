import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProductDetail.css";
import { Nav } from "react-bootstrap";

import bookImg from "./p1.jpeg";

function ProductDetail() {

  // ✅ Dummy Product Data
  const productData = {
    Product_ID: 1,
    Product_Name: "The Untold Journey",
    Author: "John Doe",
    Publisher: "Book-E-Pedia",
    Language: "English",
    Number_of_Pages: 320,
    Time_Duration: "5h 20m",
    Product_Description:
      "An exciting journey into mystery and adventure that keeps you hooked till the last page.",
    Product_Price: 399,
    Cover_Photo: bookImg,
    Back_Photo: bookImg,
  };

  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // ✅ Load feedback from localStorage
  useEffect(() => {
    const storedFeedback =
      JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(storedFeedback);
  }, []);

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) {
      alert("Please enter a review.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      Description: newFeedback,
      customer_name: "Demo User",
      Feedback_DateTime: new Date().toISOString(),
    };

    const updatedFeedback = [newEntry, ...feedbacks];

    localStorage.setItem(
      "feedbacks",
      JSON.stringify(updatedFeedback)
    );

    setFeedbacks(updatedFeedback);
    setNewFeedback("");
    setShowForm(false);
  };

  const cartAddButtonHandler = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) => item.id === productData.Product_ID
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        id: productData.Product_ID,
        name: productData.Product_Name,
        price: productData.Product_Price,
        image: productData.Cover_Photo,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert("Added to cart successfully 🛒");
  };

  const productImgs = [
    { image: productData.Cover_Photo, key: "cover" },
    { image: productData.Back_Photo, key: "back" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % productImgs.length);

  const prevImage = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + productImgs.length) % productImgs.length
    );

  const availability = {
    ebook: true,
    physical: true,
    audiobook: true,
    videobook: false,
  };

  const displayedFeedback = showAll
    ? feedbacks
    : feedbacks.slice(0, 3);

  return (
    <div className="product-detail-body">

      <div className="product-detail-card">
        <div className="product-detail-container">

          <div className="product-detail-carousel">
            <div className="product-detail-carousel-images">
              <img
                src={productImgs[currentIndex].image}
                alt="Product"
                className="product-detail-image"
              />

              {productImgs.length > 1 && (
                <div className="product-detail-carousel-controls">
                  <button onClick={prevImage}>❮</button>
                  <button onClick={nextImage}>❯</button>
                </div>
              )}
            </div>
          </div>

          <div className="product-details">
            <h2>{productData.Product_Name}</h2>

            <div className="product-detail-info">
              <div><b>Author:</b> {productData.Author}</div>
              <div><b>Publisher:</b> {productData.Publisher}</div>
              <div><b>Language:</b> {productData.Language}</div>
              <div><b>Pages:</b> {productData.Number_of_Pages}</div>
              <div><b>Duration:</b> {productData.Time_Duration}</div>
            </div>

            <div className="product-detail-description">
              {productData.Product_Description}
            </div>

            <div className="product-detail-price">
              Price: Rs. {productData.Product_Price}
            </div>

            <Nav.Link as={Link} to="/cart">
              <button
                onClick={cartAddButtonHandler}
                className="product-detail-add-to-cart"
              >
                Add to Cart
              </button>
            </Nav.Link>
          </div>
        </div>

        <div className="product-availability">
          <h3>Available Formats</h3>
          <div className="availability-buttons">
            {Object.entries(availability).map(([key, value]) => (
              <button
                key={key}
                className={`availability-button ${
                  value ? "available" : "unavailable"
                }`}
                disabled={!value}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-feedback-card">
        <h3>Customer Reviews</h3>

        {displayedFeedback.length > 0 ? (
          displayedFeedback.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <p>{feedback.Description}</p>
              <small>
                By {feedback.customer_name} on{" "}
                {new Date(
                  feedback.Feedback_DateTime
                ).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {feedbacks.length > 3 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="feedback-action-button"
          >
            Show All Reviews
          </button>
        )}

        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="feedback-action-button"
          >
            Show Less
          </button>
        )}

        <button
          onClick={() => setShowForm(true)}
          className="feedback-action-button"
        >
          Add New Review
        </button>

        {showForm && (
          <div className="feedback-form">
            <textarea
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Write your review..."
              maxLength={250}
            />
            <div className="feedback-form-buttons">
              <button onClick={handleAddFeedback}>
                Submit Review
              </button>
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default ProductDetail;
