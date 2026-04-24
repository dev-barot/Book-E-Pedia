import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Payment.css';
import { BASE_URL } from "../../utils/config";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = location.state?.orderId;
  const totalAmount = location.state?.total || "0.00";

  const [payMethod, setPayMethod] = useState('razorpay'); // Default to razorpay
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!orderId) {
      alert("Invalid order. Please try again.");
      navigate('/cart');
    }
  }, [orderId, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handlePayment() {
    if (payMethod !== 'razorpay') {
      alert("Currently only Razorpay is supported.");
      return;
    }

    setIsProcessing(true);
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    try {
      const options = {
        key: "rzp_test_SdnTwk4YH73sBq",
        amount: Math.round(parseFloat(totalAmount) * 100),
        currency: "INR",
        name: "Book-E-Pedia",
        description: `Payment for Order #${orderId}`,
        image: "https://book-e-pedia.vercel.app/logo.png", // Replace with your actual logo if available
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch(`${BASE_URL}/api/payment/create/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                order_id: orderId,
                payment_id: response.razorpay_payment_id 
              }),
            });

            const verifyData = await verifyRes.json();
            
            if (verifyData.bool) {
                alert("Payment Successful! 🎉");
                navigate("/customer/dashboard");
            } else {
                alert("Payment verification failed. Please contact support.");
                setIsProcessing(false);
            }
          } catch (verifyErr) {
            console.error("Verification error:", verifyErr);
            alert("Payment successful, but verification failed. Redirecting to dashboard...");
            navigate("/customer/dashboard");
          }
        },
        prefill: {
          name: localStorage.getItem("customer_username") || "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response){
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
      });

    } catch (err) {
      console.error(err);
      alert("Payment failed to initialize");
      setIsProcessing(false);
    }
  }

  return (
    <div className="payment-lux-bg">
      <div className="payment-lux-container">
        
        {/* Left: Summary */}
        <div className="payment-summary-card">
          <div className="payment-summary-header">
            <h2>Complete Payment</h2>
            <p>Securely finalize your purchase and unlock your library.</p>
          </div>
          
          <div className="payment-order-id-pills">
            ORDER ID: #{orderId}
          </div>

          <div className="payment-total-section">
            <div className="payment-total-row">
              <span className="payment-total-label">Grand Total</span>
              <span className="payment-total-amount">Rs. {Number(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Right: Payment Methods */}
        <div className="payment-methods-card">
          <h3>Payment Methods</h3>
          
          <div className="payment-option-list">
            
            <div 
              className={`payment-option-item ${payMethod === 'razorpay' ? 'selected' : ''}`}
              onClick={() => setPayMethod('razorpay')}
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
              className={`payment-option-item ${payMethod === 'card' ? 'selected' : 'disabled'}`}
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <div className="payment-option-radio">
                <div className="payment-option-radio-inner"></div>
              </div>
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
                <i className="fas fa-spinner fa-spin"></i> Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-shield-halved"></i> Pay Rs. {totalAmount}
              </>
            )}
          </button>

          <div className="payment-secure-badge">
            <i className="fa-solid fa-lock"></i>
            <span>SSL Secured & Encrypted Payment</span>
          </div>

          <div className="mt-4 text-center">
             <Link to="/cart" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.9rem' }}>
                ‹ Back to Cart
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Payment;
