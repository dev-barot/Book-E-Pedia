import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import { Nav } from "react-bootstrap";

import img1 from "./alchemist.jpeg";
import img2 from "./harry.jpeg";
import img3 from "./gatsby.jpeg";
import img4 from "./epic.jpeg";
import img5 from "./download(3).jpeg";
import img6 from "./download(1).jpeg";
import img7 from "./download (2).jpeg";
import img8 from "./4f971bfe-2ea6-4ff7-8c5a-7eba039fa15c.jpg";

function ProductDetail() {
  const { id } = useParams();

  const [productData, setProductData] = useState(null);

  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const fetchFeedbacks = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/feedbacks/?product_id=${id}`
        );
        const data = await res.json();

        setFeedbacks(data.data || []);
      } catch (err) {
        console.error("Feedback fetch error:", err);
      }
  };
  const [availability, setAvailability] = useState({
    "E-Book": false,
    "Physical Book": false,
    "Audio book": false,
    "Video Book": false,
  });

  useEffect(() => {
    const fetchProductAndFormats = async () => {
      try {
        const [resProducts, resBookTypes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/products/"),
          fetch("http://127.0.0.1:8000/api/book-types/")
        ]);

        const data = await resProducts.json();
        const btData = await resBookTypes.json();

        const found = data.data.find(p => p.id === parseInt(id));

        if (found) {
          setProductData({
            id: found.id,
            name: found.name,
            author: found.author,
            publisher: found.publisher,
            language: found.language,
            pages: found.pages,
            duration: found.duration,
            description: found.description,
            price: found.price,
            Cover_Photo: found.cover_photo
              ? `http://127.0.0.1:8000${found.cover_photo}`
              : null
          });

          // Match the format availability dynamically
          const foundBt = (btData.data || []).find(bt => bt.id === found.book_id);
          if (foundBt) {
            setAvailability({
              "E-Book": foundBt.ebook === "1" || foundBt.ebook === true,
              "Physical Book": foundBt.physical === "1" || foundBt.physical === true,
              "Audio book": foundBt.audio === "1" || foundBt.audio === true,
              "Video Book": foundBt.video === "1" || foundBt.video === true,
            });
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };

    fetchProductAndFormats();
    fetchFeedbacks();
  }, [id]);

  const handleAddFeedback = async () => {
    if (!newFeedback.trim()) return alert("Please enter a review.");


    const custId = localStorage.getItem("customer_id");


    if (!custId) {
      return alert("User not logged in");
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/feedback/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cust_id: custId,
          product_id: productData.id,
          description: newFeedback,
          rating: rating, // 👈 new
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Review submitted successfully");
        fetchFeedbacks();
        setNewFeedback("");
        setRating(0);
        setShowForm(false);
      } else {
        alert(data.error || "Failed to submit review");
      }

    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  const cartAddButtonHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cust_id: 1, // later replace with logged-in user
          product_id: productData.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (data.bool) {
        alert(data.msg);
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
    }
  };

  const displayedFeedback = showAll ? feedbacks : feedbacks.slice(0, 3);
  if (!productData) {
  return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
}

  return (
    <div className="product-detail-glass-bg">
      <div className="container-xxl py-5 d-flex justify-content-center flex-column align-items-center">
        
        {/* Main Glass Card exactly matching the user's screenshot */}
        <div className="glass-card-perfect">
          <div className="glass-card-top row w-100 m-0">
            
            {/* Left: Image Box */}
            <div className="col-md-5 p-0 d-flex justify-content-center align-items-start">
              <div className="glass-image-frame">
                {productData.Cover_Photo ? (
                  <img src={productData.Cover_Photo} alt={productData.name} />
                ) : (
                  <div className="no-image-placeholder">No images available.</div>
                )}
              </div>
            </div>

            {/* Right: Info Box */}
            <div className="col-md-7 p-0 ps-md-4 glass-info-area">
              <h1 className="glass-title">{productData.name.toUpperCase()}</h1>
              
              <ul className="glass-specs-list">
                <li><strong>Author:</strong> {productData.author}</li>
                <li><strong>Publisher:</strong> {productData.publisher}</li>
                <li><strong>Language:</strong> {productData.language}</li>
                <li><strong>Pages:</strong> {productData.pages}</li>
                <li><strong>Duration:</strong> {productData.duration}</li>
              </ul>

              <p className="glass-desc">{productData.description}</p>
              
              <h4 className="glass-price">Price: Rs. {Number(productData.price).toFixed(2)}</h4>

              <button className="glass-btn-cart" onClick={cartAddButtonHandler}>
                Add to Cart
              </button>
            </div>
          </div>

          <div className="glass-card-bottom mt-5">
            <h5 className="formats-title text-center mb-3">Available Formats</h5>
            <div className="formats-pill-container d-flex justify-content-center flex-wrap gap-2">
              {Object.entries(availability).map(([key, value]) => (
                <div key={key} className={`format-pill ${value ? "pill-available" : "pill-unavailable"}`}>
                  {key}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEEDBACK SECTION */}
        <div className="glass-feedback-card mt-5">
          <h3 className="text-center mb-4" style={{color: '#1A3B5C'}}>Customer Reviews</h3>
          <div className="text-center mb-4">
            <button onClick={() => setShowForm(!showForm)} className="glass-btn-secondary px-4">
              {showForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          </div>

          {showForm && (
            <div className="glass-form-box mb-4 p-4">
              <div className="rating-box mb-3 text-center">
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                      color: star <= rating ? "#ffc107" : "#ccc"
                    }}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                placeholder="Share your thoughts about this masterpiece..."
                maxLength={300}
                className="glass-textarea mb-3"
                rows="4"
              />
              <button onClick={handleAddFeedback} className="glass-btn-submit px-4">
                Submit Review
              </button>
            </div>
          )}

          <div className="reviews-list">
            {displayedFeedback.length > 0 ? (
              displayedFeedback.map((feedback) => (
                <div key={feedback.Feedback_ID} className="single-review mb-3">
                  <div className="review-text">
                    {"★".repeat(feedback.rating || 0)}
                    {"☆".repeat(5 - (feedback.rating || 0))}
                    <br />
                    "{feedback.Description}"
                  </div>
                  <small className="review-meta">
                    <strong>{feedback.customer_name}</strong> - {new Date(feedback.Feedback_DateTime).toLocaleDateString()}
                  </small>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No reviews yet. Be the first!</p>
            )}
          </div>

          {feedbacks.length > 3 && (
            <div className="text-center mt-4">
              <button onClick={() => setShowAll(!showAll)} className="glass-btn-text">
                {showAll ? "Show Less" : `Load All ${feedbacks.length} Reviews`}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductDetail;
