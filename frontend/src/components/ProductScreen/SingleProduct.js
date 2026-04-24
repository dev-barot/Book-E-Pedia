import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SingleProduct.css";
import { BASE_URL } from "../../utils/config";

function SingleProduct({ product }) {

  const navigate = useNavigate();


  const cartAddButtonHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const custId = localStorage.getItem("customer_id");
    if (!custId) {
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
          cust_id: custId,
          product_id: product.id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (data.bool) {
        navigate("/cart");
      } else {
        alert("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="product">

    <Link 
      to={`/product/${product.name}/${product.id}`} 
      className="product-bar-link"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product-bar-lux">

        {/* Left: Image */}
        <div className="product-bar-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Right: Content */}
        <div className="product-bar-content">

          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h3 className="product-bar-title">{product.name}</h3>
              <p className="product-bar-author">By {product.author}</p>
            </div>
          </div>

          <p className="product-bar-desc">
            {product.description
              ? product.description.substring(0, 150) + "..."
              : "No description available"}
          </p>

          <div className="product-bar-footer">
            <span className="product-bar-price">
              Rs. {product.price}
            </span>

            <button
              className="btn-add-cart-bar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cartAddButtonHandler(e);
              }}
            >
              Add to Cart
            </button>
          </div>

        </div>
      </div>
    </Link>
  </div>

  );
}

export default SingleProduct;