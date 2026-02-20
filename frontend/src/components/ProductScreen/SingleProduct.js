import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { CartContext } from "../../Context";

function SingleProduct(props) {
  const { product } = props;
  const { cartData = [], setCartData } = useContext(CartContext);
  const navigate = useNavigate();
  const baseUrl = "http://127.0.0.1:8000"; // Add the backend base URL

  const cartAddButtonHandler = () => {
    let previousCart = localStorage.getItem("cartData");
    let cartJson = JSON.parse(previousCart) || []; // Ensure it's an array

    // Check if the product already exists in the cart
    const existingProduct = cartJson.find(
      (item) => item.product.id === product.Product_ID
    );

    if (existingProduct) {
      // If the product already exists, redirect to the cart
      navigate("/cart");
    } else {
      // If the product does not exist, add it to the cart
      const cartData = {
        product: {
          id: product.Product_ID,
          prod_name: product.Product_Name,
          price: product.Product_Price,
          image: product.Cover_Photo,
        },
        user: {
          id: 1,
        },
        quantity: 1,
      };

      cartJson.push(cartData);
      localStorage.setItem("cartData", JSON.stringify(cartJson));
      setCartData(cartJson);
      navigate("/cart"); // Redirect to cart after adding
    }
  };

  return (
    <div className="product">
      <Nav.Link
        as={Link}
        to={`/product/${product.Product_Name}/${product.Product_ID}`}
        className="product-link"
      >
        <div className="product-image">
          <img
            src={`${baseUrl}${product.Cover_Photo}`} // Prepend the backend base URL
            alt={product.Product_Name}
            onError={() => console.log(`Failed to load image: ${baseUrl}${product.Cover_Photo}`)} // Add error logging
          />
        </div>
      </Nav.Link>
      <div className="product-details">
        <Nav.Link
          as={Link}
          to={`/product/${product.Product_Name}/${product.Product_ID}`}
          className="product-link"
        >
          <div className="product-header">
            <h2 className="product-name">{product.Product_Name}</h2>
            <p className="author-name">By {product.Author}</p>
          </div>
          <p className="product-description">{product.Product_Description}</p>
        </Nav.Link>
        <div className="product-footer">
          <p className="product-price">Rs. {product.Product_Price}</p>
          <button
            type="button"
            onClick={cartAddButtonHandler}
            className="add-to-cart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;