import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import card from './card.png';
import { CartContext, UserContext } from '../../Context';
import axios from 'axios';

const baseUrl = "http://127.0.0.1:8000/api";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

function Payment() {
  const location = useLocation();
  const orderIdFromLocation = location.state?.orderId;
  const [ConfirmOrder, setConfirmOrder] = useState(false);
  const [orderId, setOrderId] = useState(orderIdFromLocation || '');
  const [PayMethod, setPayMethod] = useState('');
  const userContext = useContext(UserContext);
  const { cartData } = useContext(CartContext);
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const total = cartData.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    setTotalAmount(total.toFixed(2));

    // Fetch CSRF token on mount
    axios.get(`${baseUrl}/get-csrf-token/`)
      .then(response => {
        console.log("CSRF token fetched on mount:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        console.error("Error fetching CSRF token on mount:", error);
      });
  }, [cartData]);

  useEffect(() => {
    if (!userContext.user?.login) {
      const customerId = localStorage.getItem('customer_id');
      if (customerId) {
        axios.get(`${baseUrl}/customer/${customerId}/`)
          .then(response => {
            userContext.setUser({ ...response.data, login: true });
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching user:', error);
            window.location.href = '/login';
          });
      } else {
        window.location.href = '/login';
      }
    } else {
      setLoading(false);
    }
  }, [userContext]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  function changePaymentMethod(payMethod) {
    setPayMethod(payMethod);
    if (!orderId) {
      alert("Order ID not found. Please go back and try again.");
    } else {
      setConfirmOrder(true);
    }
  }

  function savePaymentDetails(transactionId, paymentMode) {
    const paymentData = {
      MasterOrder_ID: orderId,
      Payment_Mode: paymentMode,
      Payment_Status: '1',
      Payment_Date: new Date().toISOString().split('T')[0]
    };

    axios.post(baseUrl + '/payments/', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken || getCookie('csrftoken'),
      },
      withCredentials: true,
    })
    .then(response => {
      console.log('Payment details saved successfully:', response.data);
      navigate('/customer/dashboard');
    })
    .catch(error => {
      console.error('Error saving payment details:', error);
      alert('Payment was successful but we encountered an issue saving the details. Please contact support.');
    });
  }

  const handleRazorpayPayment = async () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => initiateRazorpayPayment();
    script.onerror = () => alert('Failed to load Razorpay SDK');
    document.body.appendChild(script);
  };

  const initiateRazorpayPayment = async () => {
    try {
      const response = await axios.post(`${baseUrl}/create-razorpay-order/`, {
        amount: totalAmount * 100,
        currency: 'INR',
        order_id: orderId,
      });
      const { razorpay_order_id } = response.data;

      const options = {
        key: 'rzp_test_3FTFIDQklQHOrK',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Book-E-Pedia',
        description: `Payment for Order #${orderId}`,
        order_id: razorpay_order_id,
        handler: function (response) {
          const { razorpay_payment_id } = response;
          savePaymentDetails(razorpay_payment_id, 'razorpay');
        },
        prefill: {
          name: userContext.user?.Fname || 'Customer',
          email: userContext.user?.Email || '',
          contact: userContext.user?.Phone_Number || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating Razorpay payment:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  function PayNowButton() {
    if (PayMethod === 'razorpay') {
      if (!ConfirmOrder) {
        changePaymentMethod('razorpay');
      }
      handleRazorpayPayment();
    } else {
      alert('Select Payment Method!!!');
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="payment-container">
        <div className="payment-card-section">
          <h2>Payment</h2>
          <div className="payment-card">
            <img src={card} alt="Card" className="payment-card-image" />
            <div className='card py-3 text-center'>
              <h3> Choose a Payment Method</h3>
              <h5>ORDER ID: {orderId}</h5>
            </div>
            <div className='card p-3 mt-4'>
              <form>
                <div className='form-group'>
                  <label>
                    <input type='radio' onChange={() => changePaymentMethod('razorpay')} name='payMethod' /> Razorpay
                  </label>
                </div>
                <button type='button' onClick={PayNowButton} className='btn btn-sm btn-success mt-3'>Next</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;