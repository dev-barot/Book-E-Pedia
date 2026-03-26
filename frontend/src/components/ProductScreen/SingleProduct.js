import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SingleProduct.css";

function SingleProduct(props) {
  const { product } = props;
  const navigate = useNavigate();

  const cartAddButtonHandler = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = existingCart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    navigate("/cart");
  };

  return (
    <Link to={`/product/${product.name}/${product.id}`} className="product-bar-link">
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
            {product.description && product.description.substring(0, 150)}...
          </p>
          
          <div className="product-bar-footer">
            <span className="product-bar-price">Rs. {product.price}</span>
            <button className="btn-add-cart-bar" onClick={cartAddButtonHandler}>
              Add to Cart
            </button>
          </div>

        </div>

      </div>
    </Link>
  );
}

export default SingleProduct;
