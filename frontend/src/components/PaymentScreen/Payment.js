import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Payment.css";
import { BASE_URL } from "../../utils/config";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const customerId = localStorage.getItem("customer_id");

  useEffect(() => {
    // Redirect if not logged in
    if (!customerId) {
      navigate("/login");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/order/${orderId}/`);
        if (response.data.bool) {
          setOrderDetails(response.data);
        } else {
          setError("Order not found or access denied.");
        }
      } catch (err) {
        console.error("Fetch order error:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, customerId, navigate]);

  const handlePayment = async () => {
    if (paymentMethod !== "razorpay") {
      alert("Only Razorpay is supported right now.");
      return;
    }

    setIsProcessing(true);
    try {
      // Direct payment confirmation for test mode
      const response = await axios.post(`${BASE_URL}/api/payment/create/`, {
        order_id: orderId,
      });

      if (response.data.bool) {
        alert("Payment Successful! Your order is confirmed.");
        navigate("/customer/dashboard");
      } else {
        alert("Payment Failed: " + response.data.msg);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong during payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-lux-bg">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-lux-bg">
        <div className="payment-summary-card text-center">
          <h2 className="text-danger">Error</h2>
          <p>{error}</p>
          <Link to="/cart" className="btn btn-primary mt-3">Back to Cart</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-lux-bg">
      <div className="payment-lux-container">
        
        {/* LEFT PANEL: Order Summary */}
        <div className="payment-summary-card">
          <div className="payment-summary-header">
            <h2>Order Summary</h2>
            <p>Order ID: #{orderId}</p>
          </div>

          <div className="payment-product-list">
            {orderDetails?.items?.map((item, index) => (
              <div className="payment-product-item" key={index}>
                <img 
                  src={item.image ? (item.image.startsWith("http") ? item.image : `${BASE_URL}${item.image}`) : "https://via.placeholder.com/150"} 
                  alt={item.product_name} 
                  className="payment-item-img" 
                />
                <div className="payment-item-info">
                  <span className="payment-item-name">{item.product_name}</span>
                  <span className="payment-item-qty">Qty: {item.quantity}</span>
                </div>
                <div className="payment-item-price">
                  ₹{item.total}
                </div>
              </div>
            ))}
          </div>

          <div className="payment-total-section">
            <div className="payment-total-row">
              <span className="payment-total-label">Grand Total</span>
              <span className="payment-total-amount">₹{orderDetails?.total_amount}</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Payment Methods */}
        <div className="payment-methods-card">
          <h3>Payment Methods</h3>
          
          <div className="payment-option-list">
            <div 
              className={`payment-option-item ${paymentMethod === "razorpay" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("razorpay")}
            >
              <div className="payment-option-radio">
                <div className="payment-option-radio-inner"></div>
              </div>
              <div className="payment-option-info">
                <span className="payment-option-title">Razorpay</span>
                <span className="payment-option-desc">Cards, Netbanking, UPI, Wallet</span>
              </div>
              <i className="fa-solid fa-credit-card payment-option-icon"></i>
            </div>

            <div 
              className="payment-option-item disabled" 
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              <div className="payment-option-radio"></div>
              <div className="payment-option-info">
                <span className="payment-option-title">Direct Card (Coming Soon)</span>
                <span className="payment-option-desc">Pay directly with Visa/Mastercard</span>
              </div>
              <i className="fa-solid fa-building-columns payment-option-icon"></i>
            </div>
          </div>

          <button 
            className="payment-pay-btn" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-halved"></i>
                Pay ₹{orderDetails?.total_amount}
              </>
            )}
          </button>

          <div className="payment-secure-badge">
            <i className="fa-solid fa-lock"></i>
            SSL Secured & Encrypted Payment
          </div>

          <div className="mt-4 text-center">
            <Link to="/cart">
              <i className="fa-solid fa-chevron-left me-2"></i>
              Back to Cart
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
