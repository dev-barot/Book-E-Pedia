import React, { useContext, useEffect, useState } from "react";
import "./CustomerCart.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../Context";
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const CustomerCart = () => {
  const { cartData, setCartData } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    setCartData(storedCart);
    setCartItems(storedCart);

    // Fetch CSRF token on mount
    axios.get(`${baseUrl}/api/get-csrf-token/`)
      .then(response => {
        console.log("CSRF token fetched on mount:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch(error => {
        console.error("Error fetching CSRF token on mount:", error);
      });
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const updateQuantity = (productId, quantity) => {
    let updatedCart;

    if (quantity === 0) {
      updatedCart = cartItems.filter((item) => item.product.id !== productId);
    } else {
      updatedCart = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }

    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    setCartData(updatedCart);
    setCartItems(updatedCart);
  };

  const cartRemoveButtonHandler = (product_id) => {
    const updatedCart = cartData.filter((item) => item.product.id !== product_id);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
    setCartData(updatedCart);
    setCartItems(updatedCart);
  };

  const createOrder = async () => {
    console.log("Creating order...");

    const customerId = parseInt(localStorage.getItem("customer_id"), 10);
    const employeeId = 1;

    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ).toFixed(2);

    const orderData = {
      Cust_ID: customerId,
      Emp_ID: employeeId,
      Order_Status: "Pending",
      T_Quantity: totalQuantity,
      T_Amount: totalAmount,
      order_items: cartItems.map(item => ({
        Product_ID: item.product.id,
        Product_Quantity: item.quantity,
        Product_Price: item.product.price,
        T_amount: (item.product.price * item.quantity).toFixed(2),
      })),
    };

    try {
      const response = await axios.post(`${baseUrl}/api/create_order/`, orderData, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || getCookie('csrftoken'),
        },
        withCredentials: true,
      });
      console.log("Order created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error.response ? error.response.data : error.message);
      alert("Failed to create order. Please try again.");
      return null;
    }
  };

  const handleProceedToPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const order = await createOrder();
    console.log("Order response:", order);

    if (order && order.MasterOrder_ID) {
      console.log("Master Order ID received:", order.MasterOrder_ID);
      navigate("/payment", { state: { orderId: order.MasterOrder_ID } });
    } else {
      console.error("MasterOrder_ID not received.");
      alert("Order creation failed.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="cart-body">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="cart-products">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.product.id} className="cart-product">
                <div className="cart-product-details">
                  <img src={`http://127.0.0.1:8000${item.product.image}`} alt={item.product.prod_name} />
                  <span className="cart-product-name">
                    {item.product.prod_name} <br /> Rs. {item.product.price}
                  </span>
                </div>
                <div className="cart-quantity">
                  <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                    min="1"
                  />
                  <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <span className="cart-total-amount">
                  Rs. {(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => cartRemoveButtonHandler(item.product.id)}
                  className="cart-remove-button"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>No items in the cart.</p>
          )}
        </div>
        <div className="cart-total">
          Total: Rs.{" "}
          {cartItems
            .reduce((total, item) => total + item.product.price * item.quantity, 0)
            .toFixed(2)}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-make-payment">
            <button
              onClick={handleProceedToPayment}
              className="cart-confirm-payment-btn"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCart;