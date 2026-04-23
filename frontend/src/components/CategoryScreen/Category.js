import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 8;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/category/")
      .then((res) => res.json())
      .then((data) => {
        const activeCategories = (data.data || []).filter(
          (category) => category.IsActive === "1"
        );

        setCategories(activeCategories);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const totalResult = categories.length;
  const totalPages = Math.ceil(totalResult / limit);

  const startIndex = (currentPage - 1) * limit;
  const currentCategories = categories.slice(
    startIndex,
    startIndex + limit
  );

  return (
    <div className="category-lux-page">
      <div className="container-fluid px-4 px-lg-5 py-5">

        <div className="text-center mb-5">
          <span className="badge-lux mb-3">Expansive Horizons</span>
          <h1 className="category-title">
            Browse Our <span className="text-gradient">Categories</span>
          </h1>
          <p className="category-subtitle mx-auto">
            Select a genre to discover our curated collection.
          </p>
        </div>

        <div className="category-lux-grid">
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <div
                className="category-lux-card"
                key={category.Category_ID}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.Category_Name)}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card-lux-inner">
                    <div className="cat-card-front">
                      <div className="icon-glow-backdrop"></div>

                      <img
                        src={`http://127.0.0.1:8000${category.Category_Photo}`}
                        alt={category.Category_Name}
                      />

                      <h3>{category.Category_Name}</h3>
                    </div>

                    <div className="cat-card-back">
                      <h3>Explore {category.Category_Name}</h3>
                      <p>{category.Category_Description}</p>

                      <button className="btn-explore-category mt-3">
                        View Books
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">
              <h4>No categories available right now.</h4>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <ul className="pagination-lux mt-5">
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Category;