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

  const refreshViewer = () => {
    window.location.reload();
  };

  return (
    <div className="ebook-container" onContextMenu={(e) => e.preventDefault()}>
      <center>
      <div className="ebook-header" style={{ marginBottom: "30px" }}>
        <h1 style={{ fontWeight: 800, color: "#0f172a" }}>{product.Product_Name || "E-Book"}</h1>
        <button 
          onClick={refreshViewer}
          className="btn btn-sm btn-outline-secondary"
          style={{ marginTop: "10px", borderRadius: "20px", fontSize: "0.8rem" }}
        >
          <i className="fa-solid fa-rotate-right me-1"></i> Refresh Viewer
        </button>
      </div>
        
      {fileUrl ? (
        <div 
          className="ebook-viewer-wrapper" 
          style={{ 
            position: "relative", 
            width: "90%", 
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
            border: "1px solid #e2e8f0"
          }}
        >
          {/* Top Shield Overlay to protect toolbar */}
          <div 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "56px", 
              background: "transparent",
              zIndex: 100,
              pointerEvents: "none"
            }} 
          />
          
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            title="E-Book Viewer"
            width="100%"
            height="850px"
            style={{ border: "none" }}
            loading="lazy"
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