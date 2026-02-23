import React, { useState } from "react";
import "./Category.css";
import { Link } from "react-router-dom";

function Category() {

  // Demo Category Data (Frontend Only)
  const allCategories = [
    {
      Category_ID: 1,
      Category_Name: "Technology",
      Category_Description: "Explore modern tech books and innovations.",
      Category_Photo: "https://via.placeholder.com/250x180?text=Technology",
      IsActive: "1"
    },
    {
      Category_ID: 2,
      Category_Name: "Fiction",
      Category_Description: "Dive into amazing fictional worlds.",
      Category_Photo: "https://via.placeholder.com/250x180?text=Fiction",
      IsActive: "1"
    },
    {
      Category_ID: 3,
      Category_Name: "Science",
      Category_Description: "Scientific discoveries and research.",
      Category_Photo: "https://via.placeholder.com/250x180?text=Science",
      IsActive: "1"
    },
    {
      Category_ID: 4,
      Category_Name: "History",
      Category_Description: "Learn from the past.",
      Category_Photo: "https://via.placeholder.com/250x180?text=History",
      IsActive: "0" // Inactive category (will not show)
    }
  ];

  const limit = 2; // How many categories per page
  const [currentPage, setCurrentPage] = useState(1);

  const activeCategories = allCategories.filter(
    (category) => category.IsActive === "1"
  );

  const totalResult = activeCategories.length;
  const totalPages = Math.ceil(totalResult / limit);

  const startIndex = (currentPage - 1) * limit;
  const currentCategories = activeCategories.slice(
    startIndex,
    startIndex + limit
  );

  return (
    <div className="category-page">
      <h1>Browse Our Book Categories</h1>

      <div className="category-grid">
        {currentCategories.length > 0 ? (
          currentCategories.map((category) => (
            <div className="category-card" key={category.Category_ID}>
              <Link to={`/category/${category.Category_Name}/${category.Category_ID}`}>
                <div className="card-inner">
                  <div className="cat-card-front">
                    <img
                      src={category.Category_Photo}
                      alt={category.Category_Name}
                    />
                    <h3>{category.Category_Name}</h3>
                  </div>
                  <div className="cat-card-back">
                    <p>{category.Category_Description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No categories available.</p>
        )}
      </div>

      {/* Frontend Pagination */}
      <ul className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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
    </div>
  );
}

export default Category;
