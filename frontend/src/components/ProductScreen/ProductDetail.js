import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import { Nav } from "react-bootstrap";
import { CartContext, UserContext } from "../../Context";
import axiosInstance from "../../utils/axios";

function ProductDetail() {
  const [productData, setProductData] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { product_slug, Product_ID } = useParams();
  const { cartData = [], setCartData } = useContext(CartContext);
  const { user } = useContext(UserContext) || { id: 1 };

  // Fetch product data
  useEffect(() => {
    setLoadingProduct(true);
    console.log(`Fetching product data for Product_ID: ${Product_ID}, slug: ${product_slug}`);
    axiosInstance
      .get(`/products/${Product_ID}/`)
      .then((response) => {
        console.log("Product API Response:", response.data);
        if (response.data && response.data.Product_ID) {
          setProductData(response.data);
        } else {
          console.error("Product not found", response.data);
          setProductData({});
        }
      })
      .catch((error) => {
        console.error("Error fetching product", error);
        setProductData({});
      })
      .finally(() => setLoadingProduct(false));
  }, [Product_ID, product_slug]);

  // Fetch feedback data
  useEffect(() => {
    if (!productData.Product_ID) return; // Ensure Product_ID is available before fetching feedback

    setLoadingFeedback(true);
    console.log(`Fetching feedback for product_id: ${productData.Product_ID}`);
    axiosInstance
      .get(`/feedbacks/?product_id=${productData.Product_ID}`)
      .then((response) => {
        console.log("Feedback API Response:", JSON.stringify(response.data, null, 2));
        const feedbackData = response.data.data || [];
        console.log("Raw Feedback Data:", feedbackData);
        const filteredFeedbacks = feedbackData
          .filter((feedback) => feedback.Product_ID === Number(productData.Product_ID))
          .sort((a, b) => new Date(b.Feedback_DateTime) - new Date(a.Feedback_DateTime));
        console.log("Filtered Feedbacks:", filteredFeedbacks);
        setFeedbacks(filteredFeedbacks);
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        setErrorMessage("Failed to load reviews. Please try again later.");
      })
      .finally(() => setLoadingFeedback(false));
  }, [productData.Product_ID]);

  const handleShowAll = () => {
    if (!productData.Product_ID) {
      console.error("Product data not loaded");
      return;
    }
    console.log(`Showing all feedback for product_id: ${productData.Product_ID}`);
    setLoadingFeedback(true);
    axiosInstance
      .get(`/feedbacks/?product_id=${productData.Product_ID}&all=true`)
      .then((response) => {
        console.log("All Feedback API Response:", JSON.stringify(response.data, null, 2));
        const feedbackData = response.data.data || [];
        const filteredFeedbacks = feedbackData
          .filter((feedback) => feedback.Product_ID === Number(productData.Product_ID))
          .sort((a, b) => new Date(b.Feedback_DateTime) - new Date(a.Feedback_DateTime));
        console.log("Filtered Feedbacks (Show All):", filteredFeedbacks);
        setFeedbacks(filteredFeedbacks);
        setShowAll(true);
      })
      .catch((error) => {
        console.error("Error fetching all feedback", error);
        setErrorMessage("Failed to load all reviews. Please try again later.");
      })
      .finally(() => setLoadingFeedback(false));
  };

  const handleShowLess = () => {
    if (!productData.Product_ID) {
      console.error("Product data not loaded");
      return;
    }
    console.log(`Showing less feedback for product_id: ${productData.Product_ID}`);
    setLoadingFeedback(true);
    axiosInstance
      .get(`/feedbacks/?product_id=${productData.Product_ID}`)
      .then((response) => {
        console.log("Feedback API Response (Show Less):", JSON.stringify(response.data, null, 2));
        const feedbackData = response.data.data || [];
        const filteredFeedbacks = feedbackData
          .filter((feedback) => feedback.Product_ID === Number(productData.Product_ID))
          .sort((a, b) => new Date(b.Feedback_DateTime) - new Date(a.Feedback_DateTime));
        console.log("Filtered Feedbacks (Show Less):", filteredFeedbacks);
        setFeedbacks(filteredFeedbacks);
        setShowAll(false);
      })
      .catch((error) => {
        console.error("Error fetching feedback (show less)", error);
        setErrorMessage("Failed to load reviews. Please try again later.");
      })
      .finally(() => setLoadingFeedback(false));
  };

  const handleAddFeedback = () => {
    if (!newFeedback.trim()) {
      alert("Please enter a review.");
      return;
    }
    if (!productData || !productData.Product_ID) {
      console.error("Product data is not loaded. Cannot add feedback.");
      alert("Product data is not available. Please try again later.");
      return;
    }
    console.log("User Context:", user);
    const custId = user?.id || 1;
    console.log(`Adding feedback for Product_ID: ${productData.Product_ID}, Cust_ID: ${custId}`);
    const payload = {
      Product_ID: Number(productData.Product_ID),
      Cust_ID: custId,
      Description: newFeedback,
      IsActive: "1",
    };
    console.log("POST Payload:", JSON.stringify(payload, null, 2));
    console.log("Cookies before POST:", document.cookie);

    setLoadingFeedback(true);
    console.log("Loading feedback set to true");

    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));

    Promise.all([axiosInstance.post("/feedbacks/", payload), minLoadingTime])
      .then(([response]) => {
        console.log("Raw POST Response:", JSON.stringify(response.data, null, 2));
        console.log("Response Status:", response.status);
        if (response.status === 201 && response.data && response.data.Feedback_ID) {
          console.log("New Feedback Object:", response.data);
          return axiosInstance
            .get(`/feedbacks/?product_id=${productData.Product_ID}&all=true`)
            .then((response) => {
              console.log("Feedback API Response after POST:", JSON.stringify(response.data, null, 2));
              const feedbackData = response.data.data || [];
              const filteredFeedbacks = feedbackData
                .filter((feedback) => feedback.Product_ID === Number(productData.Product_ID))
                .sort((a, b) => new Date(b.Feedback_DateTime) - new Date(a.Feedback_DateTime));
              console.log("Filtered Feedbacks after POST:", filteredFeedbacks);
              setFeedbacks(filteredFeedbacks);
              setShowAll(true);
            });
        } else {
          console.error("Unexpected response format:", response.data);
          throw new Error("Failed to add review. Unexpected response from server.");
        }
      })
      .catch((error) => {
        console.error("Error adding feedback:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        const errorMsg = error.response?.data?.Description?.[0] || error.response?.data?.error || error.message;
        setErrorMessage("Failed to add review: " + errorMsg);
      })
      .finally(() => {
        setLoadingFeedback(false);
        console.log("Loading feedback set to false");
        setNewFeedback("");
        setShowForm(false);
      });
  };

  const cartAddButtonHandler = () => {
    if (!productData || !productData.Product_ID) {
      console.error("Product data is not loaded. Cannot add to cart.");
      alert("Product data is not available. Please try again later.");
      return;
    }
    let previousCart = localStorage.getItem("cartData");
    let cartJson = JSON.parse(previousCart) || [];

    const cartData = {
      product: {
        id: productData.Product_ID,
        prod_name: productData.Product_Name,
        price: productData.Product_Price,
        image: productData.Cover_Photo,
      },
      user: { id: user?.id || 1 },
      quantity: 1,
    };

    const existingItemIndex = cartJson.findIndex((item) => item.product.id === productData.Product_ID);
    if (existingItemIndex !== -1) {
      cartJson[existingItemIndex].quantity += 1;
    } else {
      cartJson.push(cartData);
    }

    localStorage.setItem("cartData", JSON.stringify(cartJson));
    setCartData(cartJson);
  };

  const productImgs = [
    { image: productData.Cover_Photo, key: "cover" },
    { image: productData.Back_Photo, key: "back" },
  ].filter((img) => img.image);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % productImgs.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + productImgs.length) % productImgs.length);

  // Mock availability data (replace with actual data from your API if available)
  const availability = {
    ebook: true,
    physical: true,
    audiobook: false,
    videobook: false,
  };

  return (
    <div className="product-detail-body">
      <div className="product-detail-card">
        <div className="product-detail-container">
          <div className="product-detail-carousel">
            {loadingProduct ? (
              <p>Loading product...</p>
            ) : productImgs.length > 0 ? (
              <div className="product-detail-carousel-images">
                <img
                  src={`http://127.0.0.1:8000${productImgs[currentIndex].image}`}
                  alt={`Slide ${currentIndex}`}
                  className="product-detail-image"
                  onError={() => console.log(`Failed to load image: http://127.0.0.1:8000${productImgs[currentIndex].image}`)}
                />
                {productImgs.length > 1 && (
                  <div className="product-detail-carousel-controls">
                    <button onClick={prevImage}>❮</button>
                    <button onClick={nextImage}>❯</button>
                  </div>
                )}
              </div>
            ) : (
              <p>No images available.</p>
            )}
          </div>

          <div className="product-details">
            <h2>{loadingProduct ? "Loading..." : productData.Product_Name || "Product Not Found"}</h2>
            {loadingProduct ? (
              <p>Loading product details...</p>
            ) : (
              <>
                <div className="product-detail-info">
                  <div>
                    <span className="product-detail-label">Author:</span> {productData.Author || "N/A"}
                  </div>
                  <div>
                    <span className="product-detail-label">Publisher:</span> {productData.Publisher || "N/A"}
                  </div>
                  <div>
                    <span className="product-detail-label">Language:</span> {productData.Language || "N/A"}
                  </div>
                  <div>
                    <span className="product-detail-label">Pages:</span> {productData.Number_of_Pages || "N/A"}
                  </div>
                  <div>
                    <span className="product-detail-label">Duration:</span> {productData.Time_Duration || "N/A"}
                  </div>
                </div>
                <div className="product-detail-description">
                  {productData.Product_Description || "No description available."}
                </div>
                <div className="product-detail-price">Price: Rs. {productData.Product_Price || "N/A"}</div>

                <Nav.Link as={Link} to="/cart">
                  <button
                    type="button"
                    onClick={cartAddButtonHandler}
                    className="product-detail-add-to-cart"
                    disabled={!productData.Product_ID}
                  >
                    Add to Cart
                  </button>
                </Nav.Link>
              </>
            )}
          </div>
        </div>

        <div className="product-availability">
          <h3>Available Formats</h3>
          <div className="availability-buttons">
            <button
              className={`availability-button ${availability.ebook ? "available" : "unavailable"}`}
              disabled={!availability.ebook}
            >
              E-Book
            </button>
            <button
              className={`availability-button ${availability.physical ? "available" : "unavailable"}`}
              disabled={!availability.physical}
            >
              Physical Book
            </button>
            <button
              className={`availability-button ${availability.audiobook ? "available" : "unavailable"}`}
              disabled={!availability.audiobook}
            >
              Audio book
            </button>
            <button
              className={`availability-button ${availability.videobook ? "available" : "unavailable"}`}
              disabled={!availability.videobook}
            >
              Video Book
            </button>
          </div>
        </div>
      </div>

      <div className="product-feedback-card">
        <h3>Customer Reviews</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loadingFeedback ? (
          <p>Loading reviews...</p>
        ) : feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div key={feedback.Feedback_ID} className="feedback-item">
              <p className="feedback-description">{feedback.Description}</p>
              <p className="feedback-meta">
                By {feedback.customer_name || "Unknown"} on{" "}
                {new Date(feedback.Feedback_DateTime).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
        {!showAll && feedbacks.length >= 3 && (
          <button onClick={handleShowAll} className="feedback-action-button">
            Show All Reviews
          </button>
        )}
        {showAll && (
          <button onClick={handleShowLess} className="feedback-action-button">
            Show Less
          </button>
        )}
        <button
          onClick={() => setShowForm(true)}
          className="feedback-action-button"
          disabled={!productData.Product_ID}
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
              <button onClick={handleAddFeedback} disabled={!productData.Product_ID}>
                Submit Review
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;