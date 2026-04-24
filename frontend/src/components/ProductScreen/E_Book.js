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
            width: "95%", 
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#1a1a1a",
            boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
            border: "1px solid #333",
            height: "900px"
          }}
        >
          {/* SECURE TOP MASK: Covers the browser's PDF toolbar (Download/Print icons) */}
          <div 
            style={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "60px", 
              background: "#1a1a1a", // Matches the viewer theme
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: 500,
              borderBottom: "1px solid #333"
            }} 
          >
            <i className="fa-solid fa-shield-halved me-2 text-primary"></i>
            Protected Reading Mode — {product.Product_Name}
          </div>

          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            title="E-Book Viewer"
            width="100%"
            height="100%"
            style={{ 
              border: "none",
              marginTop: "10px" // Pushes the PDF content slightly down
            }}
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