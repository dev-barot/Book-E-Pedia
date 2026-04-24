import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryProducts.css";
import SingleProduct from "../ProductScreen/SingleProduct";

function CategoryProducts() {

  const { Category_ID } = useParams();

  // Demo Product Data (Frontend Only)
  const allProducts = [
    {
      Product_ID: 1,
      Product_Name: "React Mastery",
      Category_ID: "1",
      Product_Price: 500,
      IsActive: "1",
      Product_Description: "Learn React step by step."
    },
    {
      Product_ID: 2,
      Product_Name: "JavaScript Pro",
      Category_ID: "1",
      Product_Price: 400,
      IsActive: "1",
      Product_Description: "Advanced JavaScript concepts."
    },
    {
      Product_ID: 3,
      Product_Name: "Fictional World",
      Category_ID: "2",
      Product_Price: 300,
      IsActive: "1",
      Product_Description: "Amazing fictional journey."
    },
    {
      Product_ID: 4,
      Product_Name: "History of India",
      Category_ID: "3",
      Product_Price: 350,
      IsActive: "0", // Inactive product
      Product_Description: "Deep dive into history."
    }
  ];

  // Filter active products of selected category
  const filteredProducts = allProducts.filter(
    (product) =>
      product.Category_ID === Category_ID &&
      product.IsActive === "1"
  );

  // Frontend Pagination
  const limit = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + limit
  );

  return (
    <div className="product-container">
      <h1>Shop Our Book Collection</h1>

      <div className="product-list">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <SingleProduct key={product.Product_ID} product={product} />
          ))
        ) : (
          <p>No active products available.</p>
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

export default CategoryProducts;
