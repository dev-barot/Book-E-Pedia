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
        <div 
          className="ebook-viewer-wrapper" 
          style={{ 
            position: "relative", 
            width: "90%", 
            margin: "0 auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
          }}
        >
          {/* Protective Overlay to prevent some interactions */}
          <div 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "60px", // Covers the top bar of some viewers
              zIndex: 10,
              cursor: "default"
            }} 
            onContextMenu={(e) => e.preventDefault()}
          />
          
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true&a=v&chrome=false`}
            title="E-Book Viewer"
            width="100%"
            height="850px"
            style={{ border: "none" }}
          />
        </div>
      ) : (
        <p>No e-book available</p>
      )}
      </center>
    </div>
  );
}

export default E_Book;