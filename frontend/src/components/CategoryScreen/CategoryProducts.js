import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Nav } from "react-bootstrap";
// import SingleCategoryProduct from "./SingleCategoryProduct";
import './CategoryProducts.css';
import SingleProduct from "../ProductScreen/SingleProduct";

function CategoryProducts() {
  //Using useState concept
  const [categoryProducts, setcategoryProducts] = useState([]);
  const baseUrl = "http://127.0.0.1:8000/api";
  const [totalResult, setTotalResults] = useState(0); //Pagination

  const {category_slug,Category_ID} = useParams();

  //Using useEffect concept
  useEffect(() => {
    fetchData(baseUrl + "/products/?category="+Category_ID);
  }, [Category_ID]);

  function fetchData(baseurl) {
    fetch(baseurl)
      .then((response) => response.json())
      .then((data) => {
        const activeProducts = data.data.filter(
          (product) => product.IsActive === "1"
        );
        setcategoryProducts(activeProducts);
        setTotalResults(activeProducts.length);
      });
  }

  function changeUrl(baseurl) {
    // setbaseurl(baseurl);
    fetchData(baseurl);
  }

  var links = []; //creting links for pagination
  var limit = 1; //how many data to show on the pages
  var totalLinks = totalResult / limit;

  for (let i = 1; i <= totalLinks; i++) {
    links.push(
      <li class="page-item">
        <Link
          onClick={() => changeUrl(baseUrl + `/products/?category=${Category_ID}&page=${i}`)}
          to={`/category/${category_slug}/${Category_ID}/?page=${i}`}
          class="page-link"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div className="product-container">
      <h1>Shop Our Book Collection</h1>
      <div className="product-list">
      {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <SingleProduct product={product} />
          ))
        ) : (
          <p>No active products available.</p>
        )}
      </div>
      <ul className="pagination">{links}</ul>
    </div>
  )
}

export default CategoryProducts
