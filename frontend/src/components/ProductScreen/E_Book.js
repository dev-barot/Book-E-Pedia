import React from "react";
import { useLocation } from "react-router-dom";
import { getMediaUrl } from "../../utils/mediaHelper";
import "./E_Book.css";

function E_Book() {
  const { state } = useLocation();

  const fileUrl = getMediaUrl(state?.eBookFileUrl);
  console.log("EBOOK URL:", fileUrl);

  const product = state?.productDetails || {};

  return (
    <div className="ebook-container" onContextMenu={(e) => e.preventDefault()}>
      <center>
      <h1>{product.Product_Name || "E-Book"}</h1>
        
      {fileUrl ? (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          title="E-Book Viewer"
          width="80%"
          height="500px"
          style={{ border: "none" }}
        />
      ) : (
        <p>No e-book available</p>
      )}
      </center>
    </div>
  );
}

export default E_Book;