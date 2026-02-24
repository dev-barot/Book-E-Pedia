import React, { useState, useRef } from "react";
import "./VideoBook.css";
import sampleVideo from "./chapter1.mp4"; // Add a video file in this folder

const VideoBook = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) =>
        console.error("Error playing video:", error)
      );
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="video-book-container">

      <header className="video-book-header">
        <h1 className="video-book-title">
          The Untold Journey (Video Edition)
        </h1>
        <p className="video-book-chapter-title">
          By John Doe
        </p>
      </header>

      <section className="video-book-video-container">
        <video
          ref={videoRef}
          controls
          className="video-book-video"
        >
          <source src={sampleVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <button onClick={togglePlay}>
          {isPlaying ? "Pause ⏸" : "Play ▶"}
        </button>
      </div>

      <footer className="video-book-footer">
        <p>© 2025 Book-E-Pedia. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default VideoBook;
