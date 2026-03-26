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

  const dummyProducts = [
    { id: 1, name: "The Alchemist", author: "Paulo Coelho", price: 399, image: img1, description: "A magical story of Santiago's journey and fulfilling his personal legend." },
    { id: 2, name: "Harry Potter", author: "J.K. Rowling", price: 499, image: img2, description: "The boy who lived. A spectacular journey into the wizarding world." },
    { id: 3, name: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 299, image: img3, description: "A story of the Jazz Age, extravagance, and the American dream." },
    { id: 4, name: "Epic Journey", author: "Alan Walker", price: 199, image: img4, description: "An epic tale of adventure across forgotten realms." },
    { id: 5, name: "The Untold Mystery", author: "Jane Doe", price: 599, image: img5, description: "Tales from the mystic mountains filled with secrets." },
    { id: 6, name: "Shadows of the Past", author: "John Smith", price: 450, image: img6, description: "Stories and legends that were never meant to be told." },
    { id: 7, name: "Nightfall", author: "Bruce Wayne", price: 899, image: img7, description: "A thrilling noir detective story set in a dystopian city." },
    { id: 8, name: "Wandering Soul", author: "Oliver Twist", price: 349, image: img8, description: "Finding the path of enlightenment in the depth of shadows." }
  ];

  const foundProduct = dummyProducts.find(p => p.id === parseInt(id)) || dummyProducts[0];

  const productData = {
    Product_ID: foundProduct.id,
    Product_Name: foundProduct.name,
    Author: foundProduct.author,
    Publisher: "Book-E-Pedia Limited",
    Language: "English",
    Number_of_Pages: 320,
    Time_Duration: "N/A",
    Product_Description: foundProduct.description,
    Product_Price: foundProduct.price,
    Cover_Photo: foundProduct.image,
  };

  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const storedFeedback = JSON.parse(localStorage.getItem(`feedbacks_${productData.Product_ID}`)) || [];
    setFeedbacks(storedFeedback);
  }, [productData.Product_ID]);

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) return alert("Please enter a review.");
    const newEntry = {
      id: Date.now(),
      Description: newFeedback,
      customer_name: "Anonymous User",
      Feedback_DateTime: new Date().toISOString(),
    };
    const updatedFeedback = [newEntry, ...feedbacks];
    localStorage.setItem(`feedbacks_${productData.Product_ID}`, JSON.stringify(updatedFeedback));
    setFeedbacks(updatedFeedback);
    setNewFeedback("");
    setShowForm(false);
  };

  const cartAddButtonHandler = (e) => {
    e.preventDefault();
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = existingCart.findIndex((item) => item.id == productData.Product_ID);

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
    alert(`${productData.Product_Name} added to your cart! 🛒`);
  };

  const availability = {
    "E-Book": true,
    "Physical Book": true,
    "Audio book": false,
    "Video Book": false,
  };

  const displayedFeedback = showAll ? feedbacks : feedbacks.slice(0, 3);

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
              <h1 className="glass-title">{productData.Product_Name.toUpperCase()}</h1>
              
              <ul className="glass-specs-list">
                <li><strong>Author:</strong> {productData.Author}</li>
                <li><strong>Publisher:</strong> {productData.Publisher}</li>
                <li><strong>Language:</strong> {productData.Language}</li>
                <li><strong>Pages:</strong> {productData.Number_of_Pages}</li>
                <li><strong>Duration:</strong> {productData.Time_Duration}</li>
              </ul>

              <p className="glass-desc">{productData.Product_Description}</p>
              
              <h4 className="glass-price">Price: Rs. {productData.Product_Price.toFixed(2)}</h4>

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
