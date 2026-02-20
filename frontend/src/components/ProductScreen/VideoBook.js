import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./VideoBook.css";

const VideoBook = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const baseUrl = "http://127.0.0.1:8000";
  const videoFileUrl = state?.videoFileUrl ? (state.videoFileUrl.startsWith('http') ? state.videoFileUrl : `${baseUrl}${state.videoFileUrl}`) : null;
  const productDetails = state?.productDetails || {};

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoFileUrl) {
      video.load();
      if (isPlaying) {
        video.play().catch(error => console.error("Error playing video:", error));
      }
    }
  }, [videoFileUrl, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) video.pause();
      else video.play().catch(error => console.error("Error playing video:", error));
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="video-book-container">
      <header className="video-book-header">
        <h1 className="video-book-title">{productDetails.Product_Name || "Unknown Video Book"}</h1>
        <p className="video-book-chapter-title">By {productDetails.Author || "Unknown Author"}</p>
      </header>

      <section className="video-book-video-container">
        {videoFileUrl ? (
          <video ref={videoRef} controls className="video-book-video">
            <source src={videoFileUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="video-book-error">No video file available.</p>
        )}
      </section>

      <footer className="video-book-footer">
        <p>© 2025 Video Book Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default VideoBook;