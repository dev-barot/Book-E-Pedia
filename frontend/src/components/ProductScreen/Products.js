import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import SingleProduct from "./SingleProduct";

import img1 from "./alchemist.jpeg";
import img2 from "./harry.jpeg";
import img3 from "./gatsby.jpeg";
import img4 from "./epic.jpeg";
import img5 from "./download(3).jpeg";
import img6 from "./download(1).jpeg";
import img7 from "./download (2).jpeg";
import img8 from "./4f971bfe-2ea6-4ff7-8c5a-7eba039fa15c.jpg";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalResult, setTotalResults] = useState(8);

  const dummyProducts = [
    { id: 1, name: "The Alchemist", author: "Paulo Coelho", price: 399, image: img1, description: "A magical story of Santiago's journey and fulfilling his personal legend." },
    { id: 2, name: "Harry Potter", author: "J.K. Rowling", price: 499, image: img2, description: "The boy who lived. A spectacular journey into the wizarding world." },
    { id: 3, name: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 299, image: img3, description: "A story of the Jazz Age, extravagance, and the American dream." },
    { id: 4, name: "Epic Journey", author: "Alan Walker", price: 199, image: img4, description: "An epic tale of adventure across forgotten realms." },
    { id: 5, name: "The Untold Mystery", author: "Jane Doe", price: 599, image: img5, description: "Tales from the mystic mountains filled with secrets." },
    { id: 6, name: "Shadows of the Past", author: "John Smith", price: 450, image: img6, description: "Stories and legends that were never meant to be told." },
    { id: 7, name: "Nightfall", author: "Bruce Wayne", price: 899, image: img7, description: "A thrilling noir detective story set in a dystopian city." },
    { id: 8, name: "Wandering Soul", author: "Oliver Twist", price: 349, image: img8, description: "Finding the path of enlightenment in the depth of shadows." }
  ];

  useEffect(() => {
    // Injecting static data since backend is offline
    setProducts(dummyProducts);
  }, []);

  function changeUrl(dummyString) {
    // Pagination placeholder
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  var links = [];
  var limit = 8; // Beautiful layout holds 8 per page
  var totalLinks = Math.ceil(totalResult / limit);

  for (let i = 1; i <= totalLinks; i++) {
    links.push(
      <li className="page-item" key={i}>
        <Link
          onClick={() => changeUrl()}
          to={`/products/?page=${i}`}
          className="page-link"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div className="shop-lux-page">
      <div className="container-fluid px-4 px-lg-5 py-5">
        
        <div className="text-center mb-5">
          <span className="badge-lux mb-3">Premium Collection</span>
          <h1 className="shop-title">
            Shop Our <span className="text-gradient">Library</span>
          </h1>
          <p className="shop-subtitle mx-auto">
            Discover a vast curated selection of premium books. From timeless classics to modern discoveries, find your next great read.
          </p>
        </div>

        <div className="shop-lux-list">
          {products.length > 0 ? (
            products.map((product, index) => (
              <SingleProduct key={index} product={product} />
            ))
          ) : (
            <div className="text-center w-100">
              <h4 className="text-muted">Loading masterpiece collection...</h4>
            </div>
          )}
        </div>

        {totalLinks > 1 && (
          <ul className="pagination-lux mt-5">
            {links}
          </ul>
        )}

      </div>
    </div>
  );
};

export default Products;
