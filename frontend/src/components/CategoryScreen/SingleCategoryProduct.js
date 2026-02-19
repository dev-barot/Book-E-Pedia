import React from 'react'
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import './SingleCategoryProduct.css';

function SingleCategoryProduct(props) {
    const {categoryProducts} = props
  return (
    <div>
      <div>
      <Nav.Link as={Link} to={`/product/${categoryProducts.Product_Name}/${categoryProducts.Product_ID}`} key={categoryProducts.Product_ID}>
        <div className="cat-product">
          <img
            src={categoryProducts.Cover_Photo}
            alt={categoryProducts.Product_Name}
            className="cat-product-image"
          />
          <div className="cat-product-name">{categoryProducts.Product_Name}</div>
          <div className="cat-author-name">By {categoryProducts.Author}</div>
          <div className="cat-product-price">Rs. {categoryProducts.Product_Price}</div>
          <div className="cat-product-description">
            {categoryProducts.Product_Description}
          </div>
          <Nav.Link as={Link} to="/cart">
            <button className="cat-add-to-cart">Add to Cart</button>
          </Nav.Link>
        </div>
      </Nav.Link>
    </div>
    </div>
  )
}

export default SingleCategoryProduct
