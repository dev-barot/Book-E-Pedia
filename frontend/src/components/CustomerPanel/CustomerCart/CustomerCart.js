import React, { useEffect, useState } from "react";
import "./CustomerCart.css";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../../../utils/config";
import { getMediaUrl } from "../../../utils/mediaHelper";

const CustomerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      const customerId = localStorage.getItem("customer_id");
      
      try {
        const [cartRes, productsRes] = await Promise.all([
          customerId ? fetch(`${BASE_URL}/api/cart/${customerId}/`) : Promise.resolve({ ok: true, json: () => Promise.resolve({ bool: false }) }),
          fetch(`${BASE_URL}/api/products/`)
        ]);
        
        const cartData = await cartRes.json();
        const productsData = await productsRes.json();

        const fetchedProducts = productsData.data || [];

        let formattedCart = [];
        if (cartData.bool) {
          formattedCart = cartData.data.map((item) => ({
            id: item.cart_id,
            product_id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
            total: parseFloat(item.total),
            image: getMediaUrl(item.image),
            stock: item.stock
          }));
          setCartItems(formattedCart);
        }

        // Calculate similar books
        const cartProductIds = formattedCart.map(item => item.product_id);
        const cartCategories = new Set();
        const cartBookIds = new Set();

        fetchedProducts.forEach(p => {
          if (cartProductIds.includes(p.id)) {
            if (p.category_id) cartCategories.add(p.category_id);
            if (p.book_id) cartBookIds.add(p.book_id);
          }
        });

        // Exclude books already in cart, and must be active
        let recommended = fetchedProducts.filter(p => 
          !cartProductIds.includes(p.id) && (p.is_active === true || p.is_active === "1")
        );

        if (cartProductIds.length > 0) {
          recommended = recommended.filter(p => 
            cartCategories.has(p.category_id) || cartBookIds.has(p.book_id)
          );
        }

        if (recommended.length === 0) {
           recommended = fetchedProducts.filter(p => 
             !cartProductIds.includes(p.id) && (p.is_active === true || p.is_active === "1")
           );
        }

        const formattedSimilar = recommended.slice(0, 4).map(p => ({
          id: p.id,
          name: p.name,
          author: p.author,
          price: p.price,
          image: getMediaUrl(p.cover_photo),
        }));

        setSimilarBooks(formattedSimilar);

      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    fetchCartAndProducts();
  }, []);

  // Update Quantity
    const updateQuantity = async (cartId, quantity) => {
      if (quantity < 1) return;

      try {
        const res = await fetch(`${BASE_URL}/api/cart/update/${cartId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        });

        const data = await res.json();
        if (!data.bool) {
          alert(data.msg); // 👈 this is your popup
          return;
        }
        if (data.bool) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === cartId
                ? { ...item, quantity: data.quantity, total: parseFloat(data.total) }
                : item
            )
          );
          window.dispatchEvent(new Event('cartUpdated'));
        }
      } catch (err) {
        console.error(err);
      }
    };

  // Remove Item
  const cartRemoveButtonHandler = async (cartId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/cart/remove/${cartId}/`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.bool) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartId));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add similar book to cart
  const addToCart = async (book) => {
    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cust_id: customerId,
          product_id: book.id,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (data.bool) {
        window.dispatchEvent(new Event('cartUpdated'));
        window.location.reload();
      } else {
        alert(data.msg || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.12;
  const totalAmount = subtotal + tax;

  // Checkout
  const handleProceedToPayment = async () => {
    const customerId = localStorage.getItem("customer_id");
    if (!customerId) {
      alert("Please login to proceed");
      navigate("/login");
      return;
    }
    setIsProcessing(true);
    try {
      // 1. Check if customer has full address
      const profileRes = await fetch(`${BASE_URL}/api/customer/${customerId}/`);
      const profileData = await profileRes.json();

      const requiredFields = ["Building", "Street", "City", "State", "Country", "Pincode"];
      const missingFields = requiredFields.filter(field => !profileData[field] || profileData[field].toString().trim() === "");

      if (missingFields.length > 0) {
        alert("Please complete your address details in your profile before proceeding to checkout.");
        navigate("/customer/profile");
        setIsProcessing(false);
        return;
      }

      // 2. Proceed with order creation
      const res = await fetch(`${BASE_URL}/api/order/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cust_id: customerId }),
      });

      const data = await res.json();

      if (!data.bool) {
        alert(data.msg || "Order creation failed");
        setIsProcessing(false);
        return;
      }

      const orderId = data.order_id;

      // ✅ NAVIGATE WITH BOTH URL PARAM AND STATE FOR MAXIMUM RELIABILITY
      navigate(`/payment/${orderId}`, {
        state: {
          orderId: orderId,
          total: totalAmount,
        },
      });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setIsProcessing(false);
    }
  };

    

  return (
    <div className="cart-page">
      <div className="cart-inner">

      {/* Page Header */}

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
                    <button disabled={item.quantity >= item.stock} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
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
          <div className="summary-row">
            <span>Tax (12%)</span>
            <span>Rs. {tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>Rs. {totalAmount.toFixed(2)}</span>
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

      {/* Bottom row: Similar Books + Quote */}
      <div className="cart-bottom-row">

        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <div className="similar-books-section">
            <h2 className="similar-books-title">
              <i className="fa-solid fa-layer-group text-gradient me-2"></i>
              You Might Also Like
            </h2>
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

        {/* Quote box */}
        <div className="cart-quote-box">
          <span className="cart-quote-mark">"</span>
          <p className="cart-quote-text">
            A reader lives a thousand lives before he dies.<br />
            The man who never reads lives only one.
          </p>
          <p className="cart-quote-author">— George R.R. Martin</p>
        </div>

      </div>

      </div>
    </div>
  );
};

export default CustomerCart;
