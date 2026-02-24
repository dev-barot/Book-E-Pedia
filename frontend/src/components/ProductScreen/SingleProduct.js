import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";

function SingleProduct(props) {
  const { product } = props;
  const navigate = useNavigate();

  const cartAddButtonHandler = () => {
    let existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

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
    <div className="product">

      <Nav.Link
        as={Link}
        to={`/product/${product.name}/${product.id}`}
        className="product-link"
      >
        <div className="product-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>
      </Nav.Link>

      <div className="product-details">

        <Nav.Link
          as={Link}
          to={`/product/${product.name}/${product.id}`}
          className="product-link"
        >
          <div className="product-header">
            <h2 className="product-name">{product.name}</h2>
            <p className="author-name">By {product.author}</p>
          </div>

          <p className="product-description">
            {product.description}
          </p>
        </Nav.Link>

        <div className="product-footer">
          <p className="product-price">
            Rs. {product.price}
          </p>

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
