import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Category.css";

// Importing the actual transparent icons available in the directory for a premium look
import technologyIcon from "./technology-book-icon-removebg-preview.png";
import fictionIcon from "./fiction-book-icon-removebg-preview.png";
import scienceIcon from "./science-book-icon-removebg-preview.png";
import historyIcon from "./history-book-icon-removebg-preview.png";
import adventureIcon from "./adventure-book-icon-removebg-preview.png";
import comicIcon from "./comic-book-icon-removebg-preview.png";
import horrorIcon from "./horror-book-icon-removebg-preview.png";
import sportsIcon from "./sports-book-icon-removebg-preview.png";

function Category() {

  // Upgraded Category Data using Real Icons
  const allCategories = [
    {
      Category_ID: 1,
      Category_Name: "Technology",
      Category_Description: "Explore modern tech books, artificial intelligence, and cutting-edge innovations.",
      Category_Photo: technologyIcon,
      IsActive: "1"
    },
    {
      Category_ID: 2,
      Category_Name: "Fiction",
      Category_Description: "Immerse yourself in breathtaking, imaginative fictional worlds and stories.",
      Category_Photo: fictionIcon,
      IsActive: "1"
    },
    {
      Category_ID: 3,
      Category_Name: "Science",
      Category_Description: "Uncover the secrets of the universe through profound scientific discoveries.",
      Category_Photo: scienceIcon,
      IsActive: "1"
    },
    {
      Category_ID: 4,
      Category_Name: "Adventure",
      Category_Description: "Thrilling journeys, expeditions, and unforgettable escapades.",
      Category_Photo: adventureIcon,
      IsActive: "1"
    },
    {
      Category_ID: 5,
      Category_Name: "Comics",
      Category_Description: "Vibrant graphic novels, superheroes, and visual storytelling.",
      Category_Photo: comicIcon,
      IsActive: "1"
    },
    {
      Category_ID: 6,
      Category_Name: "Horror",
      Category_Description: "Spine-chilling thrillers and terrifying ghostly encounters.",
      Category_Photo: horrorIcon,
      IsActive: "1"
    },
    {
      Category_ID: 7,
      Category_Name: "Sports",
      Category_Description: "Biographies, techniques, and the history of global athletics.",
      Category_Photo: sportsIcon,
      IsActive: "1"
    },
    {
      Category_ID: 8,
      Category_Name: "History",
      Category_Description: "Learn from the past.",
      Category_Photo: historyIcon,
      IsActive: "0" // Inactive category
    }
  ];

  const limit = 8; // Beautiful fluid grid up to 8 per page
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
    <div className="category-lux-page">
      <div className="container-fluid px-4 px-lg-5 py-5">
        
        <div className="text-center mb-5">
          <span className="badge-lux mb-3">Expansive Horizons</span>
          <h1 className="category-title">
            Browse Our <span className="text-gradient">Categories</span>
          </h1>
          <p className="category-subtitle mx-auto">
            Select a genre to discover our curated collection of premium audiobooks, e-books, and masterfully bound physical editions.
          </p>
        </div>

        <div className="category-lux-grid">
          {currentCategories.length > 0 ? (
            currentCategories.map((category) => (
              <div className="category-lux-card" key={category.Category_ID}>
                <Link to={`/category/${category.Category_Name}/${category.Category_ID}`} style={{ textDecoration: 'none' }}>
                  <div className="card-lux-inner">
                    {/* Front of the 3D Glass Card */}
                    <div className="cat-card-front">
                      <div className="icon-glow-backdrop"></div>
                      <img
                        src={category.Category_Photo}
                        alt={category.Category_Name}
                        className="floating-category-icon"
                      />
                      <h3>{category.Category_Name}</h3>
                    </div>
                    {/* Back of the 3D Glass Card */}
                    <div className="cat-card-back">
                      <h3>Explore {category.Category_Name}</h3>
                      <p>{category.Category_Description}</p>
                      <button className="btn-explore-category mt-3">View Books <i className="fa-solid fa-arrow-right ms-2"></i></button>
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

        {/* Elegant Luxury Pagination */}
        {totalPages > 1 && (
          <ul className="pagination-lux mt-5">
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
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
