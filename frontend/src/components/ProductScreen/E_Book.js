import React from "react";
import { useLocation } from "react-router-dom";
import { getMediaUrl } from "../../utils/mediaHelper";
import "./E_Book.css";

function E_Book() {
  const { state } = useLocation();

  const fileUrl = getMediaUrl(state?.eBookFileUrl);
  console.log("DEBUG: E-Book Component v1.0.5-https");
  console.log("EBOOK URL:", fileUrl);

  const product = state?.productDetails || {};

  return (
    <div className="ebook-container" onContextMenu={(e) => e.preventDefault()}>
      <center>
      <h1>{product.Product_Name || "E-Book"}</h1>
        
      {fileUrl ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          title="E-Book Viewer"
          width="80%"
          height="800px"
          style={{ border: "none", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        />
      ) : (
        <p>No e-book available</p>
      )}
      </center>
    </div>
  );
}

export default E_Book;