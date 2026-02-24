import React, { useState, useRef, useEffect } from "react";
import "./AudioBook.css";
import p1 from './p1.jpeg';
import audioFile from './jonasonfarminwinter_01_abbott_64kb.mp3';

const AudioBook = () => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error(error));
    }

    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      duration
    );
  };

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="audiobook-container">

      <div className="audiobook-cover">
        <img
          src={p1}
          alt="Book Cover"
          className="audiobook-cover-img"
        />
      </div>

      <div className="audiobook-content">
        <h1 className="audiobook-title">
          Careful What You Wish For
        </h1>
        <p className="audiobook-author">
          By Shari Lapena
        </p>

        <div className="audiobook-progress">
          <div className="audiobook-progress-bar">
            <div
              className="audiobook-progress-fill"
              style={{
                width: duration
                  ? `${(currentTime / duration) * 100}%`
                  : "0%"
              }}
            ></div>
          </div>

          <div className="audiobook-time">
            <span>{formatTime(currentTime)}</span> /
            <span> {formatTime(duration)}</span>
          </div>
        </div>

        <div className="audiobook-controls">
          <button
            className="audiobook-control-btn"
            onClick={() => skipTime(-10)}
          >
            ⏪
          </button>

          <button
            className="audiobook-control-btn audiobook-play-btn"
            onClick={togglePlay}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            className="audiobook-control-btn"
            onClick={() => skipTime(10)}
          >
            ⏩
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioFile}
        className="audiobook-audio"
      >
        Your browser does not support the audio element.
      </audio>

    </div>
  );
};

export default AudioBook;
