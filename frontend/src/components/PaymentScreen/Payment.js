import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import card from './card.png';
import { CartContext } from '../../Context';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderIdFromLocation = location.state?.orderId || "ORD12345";
  const { cartData } = useContext(CartContext);

  const [ConfirmOrder, setConfirmOrder] = useState(false);
  const [orderId] = useState(orderIdFromLocation);
  const [PayMethod, setPayMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total
  useEffect(() => {
    if (cartData && cartData.length > 0) {
      const total = cartData.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      setTotalAmount(total.toFixed(2));
    } else {
      setTotalAmount("0.00");
    }
  }, [cartData]);

  function changePaymentMethod(payMethod) {
    setPayMethod(payMethod);
    setConfirmOrder(true);
  }

  function PayNowButton() {
    if (!PayMethod) {
      alert('Select Payment Method!!!');
      return;
    }

    // Simulate payment delay
    setTimeout(() => {
      alert("Payment Successful! 🎉");

      // Clear cart after payment
      localStorage.removeItem("cart");

      navigate('/customer/dashboard');
    }, 1000);
  }

  return (
    <div>
      <div className="payment-container">
        <div className="payment-card-section">
          <h2>Payment</h2>

          <div className="payment-card">
            <img src={card} alt="Card" className="payment-card-image" />

            <div className='card py-3 text-center'>
              <h3>Choose a Payment Method</h3>
              <h5>ORDER ID: {orderId}</h5>
              <h4>Total: ₹ {totalAmount}</h4>
            </div>

            <div className='card p-3 mt-4'>
              <form>
                <div className='form-group'>
                  <label>
                    <input
                      type='radio'
                      onChange={() => changePaymentMethod('razorpay')}
                      name='payMethod'
                    /> Razorpay
                  </label>
                </div>

                <div className='form-group'>
                  <label>
                    <input
                      type='radio'
                      onChange={() => changePaymentMethod('card')}
                      name='payMethod'
                    /> Credit / Debit Card
                  </label>
                </div>

                <button
                  type='button'
                  onClick={PayNowButton}
                  className='btn btn-sm btn-success mt-3'
                >
                  Pay Now
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
