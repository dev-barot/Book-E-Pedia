import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SingleCategoryProduct.css";

function SingleCategoryProduct({ categoryProducts }) {

  const navigate = useNavigate();

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = existingCart.findIndex(
      (item) => item.Product_ID === categoryProducts.Product_ID
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({ ...categoryProducts, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    navigate("/cart");
  };

  return (
    <div className="cat-product">

      <Link
        to={`/product/${categoryProducts.Product_Name}/${categoryProducts.Product_ID}`}
      >
        <img
          src={categoryProducts.Cover_Photo}
          alt={categoryProducts.Product_Name}
          className="cat-product-image"
        />
        <div className="cat-product-name">
          {categoryProducts.Product_Name}
        </div>
        <div className="cat-author-name">
          By {categoryProducts.Author}
        </div>
        <div className="cat-product-price">
          Rs. {categoryProducts.Product_Price}
        </div>
        <div className="cat-product-description">
          {categoryProducts.Product_Description}
        </div>
      </Link>

      <button className="cat-add-to-cart" onClick={addToCart}>
        Add to Cart
      </button>

    </div>
  );
}

export default SingleCategoryProduct;
