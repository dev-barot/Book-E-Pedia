// import React, { useContext, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './Payment.css';
// import card from './card.png';
// import { CartContext } from '../../Context';

// function Payment() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const orderIdFromLocation = location.state?.orderId ;
//   if (!orderIdFromLocation) {
//     alert("Invalid order. Please try again.");
//     navigate("/cart");
//     return null;
//   }
//   const { cartData } = useContext(CartContext);

//   const [ConfirmOrder, setConfirmOrder] = useState(false);
//   const [orderId] = useState(orderIdFromLocation);
//   const [PayMethod, setPayMethod] = useState('');
//   const [totalAmount, setTotalAmount] = useState(0);

//   // Calculate total
//   useEffect(() => {
//     if (cartData && cartData.length > 0) {
//       const total = cartData.reduce(
//         (sum, item) => sum + (item.price * item.quantity),
//         0
//       );
//       setTotalAmount(total.toFixed(2));
//     } else {
//       setTotalAmount("0.00");
//     }
//   }, [cartData]);

//   function changePaymentMethod(payMethod) {
//     setPayMethod(payMethod);
//     setConfirmOrder(true);
//   }

//   function PayNowButton() {
//     if (!PayMethod) {
//       alert('Select Payment Method!!!');
//       return;
//     }

//     async function PayNowButton() {
//       if (!PayMethod) {
//         alert('Select Payment Method!!!');
//         return;
//       }

//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/payment/create/", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ order_id: orderId }),
//         });

//         const data = await res.json();

//         if (!data.bool) {
//           alert("Payment failed");
//           return;
//         }

//         alert("Payment Successful! 🎉");

//         // Clear cart (backend already cleared, this is UI cleanup)
//         localStorage.removeItem("cart");

//         navigate('/invoice', { state: { orderId } });

//       } catch (err) {
//         console.error(err);
//         alert("Something went wrong");
//       }
//     }
//   }

//   return (
//     <div>
//       <div className="payment-container">
//         <div className="payment-card-section">
//           <h2>Payment</h2>

//           <div className="payment-card">
//             <img src={card} alt="Card" className="payment-card-image" />

//             <div className='card py-3 text-center'>
//               <h3>Choose a Payment Method</h3>
//               <h5>ORDER ID: {orderId}</h5>
//               <h4>Total: ₹ {totalAmount}</h4>
//             </div>

//             <div className='card p-3 mt-4'>
//               <form>
//                 <div className='form-group'>
//                   <label>
//                     <input
//                       type='radio'
//                       onChange={() => changePaymentMethod('razorpay')}
//                       name='payMethod'
//                     /> Razorpay
//                   </label>
//                 </div>

//                 <div className='form-group'>
//                   <label>
//                     <input
//                       type='radio'
//                       onChange={() => changePaymentMethod('card')}
//                       name='payMethod'
//                     /> Credit / Debit Card
//                   </label>
//                 </div>

//                 <button
//                   type='button'
//                   onClick={PayNowButton}
//                   className='btn btn-sm btn-success mt-3'
//                 >
//                   Pay Now
//                 </button>
//               </form>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Payment;
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';
import card from './card.png';

function Payment() {
const location = useLocation();
const navigate = useNavigate();

const orderId = location.state?.orderId;
const totalAmount = location.state?.total || "0.00";

const [PayMethod, setPayMethod] = useState('');

useEffect(() => {
if (!orderId) {
alert("Invalid order. Please try again.");
navigate('/cart');
}
}, [orderId, navigate]);

function changePaymentMethod(method) {
setPayMethod(method);
}
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
async function PayNowButton() {
  if (!PayMethod) {
    alert("Select Payment Method!!!");
    return;
  }

  const res = await loadRazorpay();

  if (!res) {
    alert("Razorpay SDK failed to load");
    return;
  }

  try {
    // 1️⃣ Create Razorpay order (backend)
    // const orderRes = await fetch("http://127.0.0.1:8000/api/payment/create/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ order_id: orderId }),
    // });

    // const orderData = await orderRes.json();

    // if (!orderData.bool) {
    //   alert("Failed to initiate payment");
    //   return;
    // }

    const options = {
      key: "rzp_test_SdnTwk4YH73sBq",
      amount: parseFloat(totalAmount) * 100,
      currency: "INR",
      name: "Book-E-Pedia",
      description: `Order #${orderId}`,

      handler: async function (response) {
        // 2️⃣ Verify payment
          await fetch("http://127.0.0.1:8000/api/payment/create/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id: orderId }),
          });

          alert("Payment Successful 🎉");
          navigate("/customer/dashboard");
        },

      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
}

return ( <div className="payment-container"> <div className="payment-card-section"> <h2>Payment</h2>

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

);
}

export default Payment;
