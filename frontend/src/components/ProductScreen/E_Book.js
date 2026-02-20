import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./E_Book.css";

function E_Book() {
  const location = useLocation();
  const { state } = location;
  const baseUrl = "http://127.0.0.1:8000";
  const eBookFileUrl = state?.eBookFileUrl ? (state.eBookFileUrl.startsWith('http') ? state.eBookFileUrl : `${baseUrl}${state.eBookFileUrl}`) : null;
  const productDetails = state?.productDetails || {};

  useEffect(() => {
    if (!eBookFileUrl) console.error("No e-book file URL available:", eBookFileUrl);
    else console.log("E-book file URL loaded:", eBookFileUrl);
  }, [eBookFileUrl]);

  return (
    <div className="ebook-container">
      <header className="ebook-header">
        <h1 className="ebook-title">{productDetails.Product_Name || "Unknown E-Book"}</h1>
        <p className="ebook-author">By {productDetails.Author || "Unknown Author"}</p>
      </header>
      <div className="ebook-content">
        {eBookFileUrl ? (
          <iframe
            src={eBookFileUrl}
            title="E-Book Viewer"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            className="ebook-iframe"
            scrolling="yes"
          />
        ) : (
          <p className="ebook-error">No e-book file available.</p>
        )}
      </div>
      <footer className="ebook-footer">
        <p>© 2025 E-Book Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default E_Book;