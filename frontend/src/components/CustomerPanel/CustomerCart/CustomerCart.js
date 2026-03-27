import React, { useEffect, useState } from "react";
import "./CustomerCart.css";
import { useNavigate, Link } from "react-router-dom";
import { books } from "../../ProductScreen/books";

const CustomerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Similar books = books NOT already in the cart (max 4)
  const similarBooks = books
    .filter((book) => !cartItems.some((item) => item.id === book.id))
    .slice(0, 4);

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
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Add similar book to cart
  const addToCart = (book) => {
    const existing = cartItems.find((item) => item.id === book.id);
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...book, quantity: 1 }];
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Checkout
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
    <div className="cart-page">

      {/* Page Header */}
      <div className="cart-page-header">
        <h1 className="cart-page-title">Cart</h1>
        <nav className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>Cart</span>
        </nav>
      </div>

      {/* Main Two-Column Layout */}
      <div className="cart-layout">

        {/* LEFT — Cart Items */}
        <div className="cart-items-panel">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`cart-item-row ${index < cartItems.length - 1 ? "cart-item-divider" : ""}`}
              >
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-author">{item.author}</p>
                  <p className="cart-item-price">Rs. {item.price}.00</p>
                </div>
                <div className="cart-item-controls">
                  <div className="cart-qty-box">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button
                    className="cart-delete-btn"
                    onClick={() => cartRemoveButtonHandler(item.id)}
                    title="Remove"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="cart-empty">
              <p>Your cart is empty.</p>
              <Link to="/products" className="browse-link-btn">Browse Books</Link>
            </div>
          )}

          {/* Continue Shopping */}
          {cartItems.length > 0 && (
            <div className="cart-continue">
              <Link to="/products">‹ Continue Shopping</Link>
            </div>
          )}
        </div>

        {/* RIGHT — Order Summary */}
        <div className="cart-summary-panel">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {subtotal.toFixed(2)}</span>
          </div>
          <button
            className="summary-checkout-btn"
            onClick={handleProceedToPayment}
            disabled={isProcessing || cartItems.length === 0}
          >
            {isProcessing ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <div className="similar-books-section">
          <h2 className="similar-books-title">📚 You Might Also Like</h2>
          <div className="similar-books-grid">
            {similarBooks.map((book) => (
              <div
                key={book.id}
                className="similar-book-card"
                onClick={() => navigate(`/product/${book.id}/${book.id}`)}
              >
                <img src={book.image} alt={book.name} className="similar-book-img" />
                <div className="similar-book-info">
                  <p className="similar-book-name">{book.name}</p>
                  <p className="similar-book-author">{book.author}</p>
                  <p className="similar-book-price">Rs. {book.price}</p>
                  <button
                    className="similar-add-btn"
                    onClick={(e) => { e.stopPropagation(); addToCart(book); }}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerCart;
