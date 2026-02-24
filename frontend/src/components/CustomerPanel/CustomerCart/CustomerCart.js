import React, { useEffect, useState } from "react";
import "./CustomerCart.css";
import { useNavigate } from "react-router-dom";

const CustomerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Update Quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Remove Item
  const cartRemoveButtonHandler = (productId) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== productId
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Simulated Checkout
  const handleProceedToPayment = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    setTimeout(() => {
      alert("Order placed successfully! 🎉");

      localStorage.removeItem("cart");
      setCartItems([]);

      navigate("/");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="cart-body">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        <div className="cart-products">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="cart-product">

                <div className="cart-product-details">
                  <img src={item.image} alt={item.name} />
                  <span className="cart-product-name">
                    {item.name} <br /> Rs. {item.price}
                  </span>
                </div>

                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    min="1"
                  />

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <span className="cart-total-amount">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => cartRemoveButtonHandler(item.id)}
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
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-make-payment">
            <button
              onClick={handleProceedToPayment}
              className="cart-confirm-payment-btn"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerCart;
