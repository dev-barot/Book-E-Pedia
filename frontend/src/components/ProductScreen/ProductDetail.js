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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products/");
        const data = await res.json();

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
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) return alert("Please enter a review.");
    const newEntry = {
      id: Date.now(),
      Description: newFeedback,
      customer_name: "Anonymous User",
      Feedback_DateTime: new Date().toISOString(),
    };
    const updatedFeedback = [newEntry, ...feedbacks];
    localStorage.setItem(`feedbacks_${productData.id}`, JSON.stringify(updatedFeedback));
    setFeedbacks(updatedFeedback);
    setNewFeedback("");
    setShowForm(false);
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

  const availability = {
    "E-Book": true,
    "Physical Book": true,
    "Audio book": false,
    "Video Book": false,
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
                  <img src={productData.Cover_Photo} alt={productData.Product_Name} />
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
                <li><strong>Publisher:</strong> {productData.Publisher}</li>
                <li><strong>Language:</strong> {productData.Language}</li>
                <li><strong>Pages:</strong> {productData.Number_of_Pages}</li>
                <li><strong>Duration:</strong> {productData.Time_Duration}</li>
              </ul>

              <p className="glass-desc">{productData.Product_Description}</p>
              
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
                <div key={feedback.id} className="single-review mb-3">
                  <p className="review-text">"{feedback.Description}"</p>
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
