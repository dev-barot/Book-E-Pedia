// import React, { useState, useRef, useEffect } from "react";
// import "./AudioBook.css";
// import p1 from './p1.jpeg';
// import audioFile from './jonasonfarminwinter_01_abbott_64kb.mp3'; // Adjust the path accordingly

// const AudioBook = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const audio = audioRef.current;
//     const updateProgress = () => {
//       setCurrentTime(audio.currentTime);
//     };

//     const handleLoadedMetadata = () => {
//       setDuration(audio.duration);
//     };

//     audio.addEventListener("timeupdate", updateProgress);
//     audio.addEventListener("loadedmetadata", handleLoadedMetadata);

//     return () => {
//       audio.removeEventListener("timeupdate", updateProgress);
//       audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
//     };
//   }, []);

//   const togglePlay = () => {
//     const audio = audioRef.current;
//     if (isPlaying) {
//       audio.pause();
//     } else {
//       audio.play().catch(error => {
//         console.error("Error playing audio:", error);
//       });
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const skipTime = (seconds) => {
//     const audio = audioRef.current;
//     audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration);
//   };

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   };

//   return (
//     <div className="audiobook-container">
//       <div className="cover">
//         <img src={p1} alt="Audiobook Cover" />
//       </div>
//       <h2>Careful What You Wish For</h2>
//       <p>By Shari Lapena</p>
//       <div className="progress-bar">
//         <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
//       </div>
//       <div className="controls">
//         <button onClick={() => skipTime(-10)}><i className="fas fa-fast-backward"></i></button>
//         <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
//         <button onClick={() => skipTime(10)}><i className="fas fa-fast-forward"></i></button>
//       </div>
//       <div className="time-controls">
//         <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
//       </div>
//       <audio ref={audioRef} src={audioFile}></audio>
//     </div>
//   );
// };

// export default AudioBook;
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AudioBook.css";
import p1 from './p1.jpeg';

const AudioBook = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const location = useLocation();
  const { state } = location;
  const baseUrl = "http://127.0.0.1:8000";
  const audioFileUrl = state?.audioFileUrl ? (state.audioFileUrl.startsWith('http') ? state.audioFileUrl : `${baseUrl}${state.audioFileUrl}`) : null;
  const productDetails = state?.productDetails || {};

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioFileUrl) return;

    console.log("Audio file URL set:", audioFileUrl);

    audio.src = audioFileUrl;
    audio.load();

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleError = () => console.error("Audio error:", audio.error);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    if (isPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    }

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [audioFileUrl, isPlaying]);

  useEffect(() => {
    console.log("Render - Duration:", duration, "Current Time:", currentTime);
  }, [duration, currentTime]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(error => console.error("Error playing audio:", error));
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || 0);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="audiobook-container">
      <div className="audiobook-cover">
        <img 
          src={productDetails.Cover_Photo ? `${baseUrl}${productDetails.Cover_Photo}` : p1} 
          alt="Book Cover" 
          className="audiobook-cover-img"
          onError={(e) => { e.target.src = p1; }}
        />
        <div className="audiobook-cover-overlay"></div>
      </div>
      <div className="audiobook-content">
        <h1 className="audiobook-title">{productDetails.Product_Name || "Unknown Book"}</h1>
        <p className="audiobook-author">By {productDetails.Author || "Unknown Author"}</p>
        <div className="audiobook-progress">
          <div className="audiobook-progress-bar">
            <div className="audiobook-progress-fill" style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
          </div>
          <div className="audiobook-time">
            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="audiobook-controls">
          <button className="audiobook-control-btn" onClick={() => skipTime(-10)}>
            <i className="fas fa-fast-backward"></i>
          </button>
          <button className="audiobook-control-btn audiobook-play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="audiobook-control-btn" onClick={() => skipTime(10)}>
            <i className="fas fa-fast-forward"></i>
          </button>
        </div>
      </div>
      {audioFileUrl ? (
        <audio ref={audioRef} controls className="audiobook-audio">
          <source src={audioFileUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p className="audiobook-error">No audio file available.</p>
      )}
    </div>
  );
};

export default AudioBook;