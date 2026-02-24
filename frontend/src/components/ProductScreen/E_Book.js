import React from "react";
import "./E_Book.css";
import samplePdf from "./adventures_of_tom.pdf"; // Add a PDF file in this folder

function E_Book() {

  return (
    <div className="ebook-container">

      <header className="ebook-header">
        <h1 className="ebook-title">
          The Untold Journey
        </h1>
        <p className="ebook-author">
          By John Doe
        </p>
      </header>

      <div className="ebook-content">
        <iframe
          src={samplePdf}
          title="E-Book Viewer"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          className="ebook-iframe"
          scrolling="yes"
        />
      </div>

      <footer className="ebook-footer">
        <p>© 2025 Book-E-Pedia. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default E_Book;
