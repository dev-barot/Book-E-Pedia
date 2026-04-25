import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Category.css";
import { BASE_URL } from "../../utils/config";

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/category/`)
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


  return (
    <div className="category-lux-page">
      <div className="container-fluid px-4 px-lg-5 py-5">

        {/* Parallax Header Layer */}
        <div className="category-header-parallax text-center mb-5">
          <span className="badge-lux mb-3">Expansive Horizons</span>
          <h1 className="category-title">
            Browse Our <span className="text-gradient">Categories</span>
          </h1>
          <p className="category-subtitle mx-auto">
            Select a genre to discover our curated collection.
          </p>
        </div>

        <div className="category-lux-grid categories-content-layer">
          {categories.length > 0 ? (
            categories.map((category) => (
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
                        src={category.Category_Photo.startsWith('http') ? category.Category_Photo : `${BASE_URL}${category.Category_Photo}`}
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
      </div>
    </div>
  );
}

export default Category;