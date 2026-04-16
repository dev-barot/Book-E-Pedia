import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMediaUrl } from "../../utils/mediaHelper";
import "./VideoBook.css";

const VideoBook = () => {
  const { state } = useLocation();

  const rawVideoUrl = getMediaUrl(state?.videoFileUrl);
  const product = state?.productDetails || {};
  
  // Create a persistent cache buster string that DOES NOT change on every re-render
  const [sessionBuster] = useState(() => new Date().getTime());
  const cacheBusterUrl = rawVideoUrl ? (rawVideoUrl.includes('?') 
      ? `${rawVideoUrl}&cb=${sessionBuster}`
      : `${rawVideoUrl}?cb=${sessionBuster}`) : null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const speedOptions = [1, 1.25, 1.5, 2];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cacheBusterUrl) return;

    video.src = cacheBusterUrl;
    video.load();

    const update = () => {
      setCurrentTime(video.currentTime);
      // Save progress
      if (video.currentTime > 0 && product?.Product_ID) {
        localStorage.setItem(`video-progress-${product.Product_ID}`, video.currentTime);
      }
    };
    
    const loaded = () => {
      setDuration(video.duration);
      // Resume from last paused
      if (product?.Product_ID) {
        const savedTime = localStorage.getItem(`video-progress-${product.Product_ID}`);
        if (savedTime && parseFloat(savedTime) < video.duration - 2) {
          video.currentTime = parseFloat(savedTime);
        }
      }
    };
    
    const ended = () => setIsPlaying(false);

    video.addEventListener("timeupdate", update);
    video.addEventListener("loadedmetadata", loaded);
    video.addEventListener("ended", ended);

    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("loadedmetadata", loaded);
      video.removeEventListener("ended", ended);
      video.pause();
    };
  }, [cacheBusterUrl, product?.Product_ID]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // user exited fullscreen
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.error("Video play error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.min(Math.max(video.currentTime + seconds, 0), duration || 0);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const newTime = (e.target.value / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const cycleSpeed = () => {
    const currentIndex = speedOptions.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setPlaybackRate(speedOptions[nextIndex]);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="vb-lux-body" onContextMenu={(e) => e.preventDefault()}>
      {cacheBusterUrl ? (
        <div className="vb-lux-main">
          <div className="vb-glass-card">
            
            <div className="vb-header">
              <h1 className="vb-title">
                {product.Product_Name || "Video Title"}
              </h1>
            </div>

            {/* Custom Video Player Container */}
            <div className="vb-player-wrapper" ref={containerRef}>
              <video 
                ref={videoRef} 
                className="vb-video-element"
                onClick={togglePlay}
                controlsList="nodownload"
              >
                <source src={cacheBusterUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>

              <div className="vb-controls-bar">
                <div className="vb-progress-section">
                  <input
                    type="range"
                    className="vb-progress-slider"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleProgressChange}
                  />
                  <div className="vb-time">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="vb-actions">
                  <div className="vb-btn-group">
                    {/* Play/Pause */}
                    <button className="vb-play-btn" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                      {isPlaying ? (
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </button>

                    {/* Skip Back 10s */}
                    <button className="vb-icon-btn" onClick={() => skipTime(-10)} title="Skip backward 10s">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12.5 3C17.15 3 21 6.85 21 11.5C21 16.15 17.15 20 12.5 20C9.69 20 7.21 18.61 5.67 16.5L7.09 15.09C8.32 16.71 10.28 17.85 12.5 17.85C16.01 17.85 18.85 15.01 18.85 11.5C18.85 7.99 16.01 5.15 12.5 5.15C12.44 5.15 12.38 5.15 12.32 5.15L14.39 7.22L12.98 8.64L8.74 4.39L12.98 0.15L14.39 1.56L12.33 3.63C12.39 3.63 12.44 3.63 12.5 3.63ZM10.25 10.36L9.67 10.55L9.36 9.61L11 9H11.83V14.5H10.63V10.36H10.25ZM13.06 9H16.29V10L14.47 10.21C14.85 10.32 15.19 10.51 15.48 10.78C15.93 11.23 16.15 11.82 16.15 12.45C16.15 13.1 15.91 13.67 15.48 14.12C15.01 14.6 14.38 14.85 13.68 14.85C12.9 14.85 12.23 14.59 11.75 14.07C11.37 13.65 11.16 13.1 11.12 12.43H12.38C12.42 12.78 12.55 13.06 12.77 13.27C12.98 13.48 13.29 13.58 13.68 13.58C14.09 13.58 14.42 13.46 14.65 13.23C14.88 13 15 12.69 15 12.34C15 12 14.88 11.72 14.65 11.51C14.43 11.29 14.12 11.18 13.72 11.18H13.06V9Z" />
                      </svg>
                      <span style={{ fontSize: '0.7rem', marginLeft: '2px', fontWeight: 'bold' }}>10s</span>
                    </button>

                    {/* Skip Forward 10s */}
                    <button className="vb-icon-btn" onClick={() => skipTime(10)} title="Skip forward 10s">
                      <span style={{ fontSize: '0.7rem', marginRight: '2px', fontWeight: 'bold' }}>10s</span>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M11.5 3C6.85 3 3 6.85 3 11.5C3 16.15 6.85 20 11.5 20C14.31 20 16.79 18.61 18.33 16.5L16.91 15.09C15.68 16.71 13.72 17.85 11.5 17.85C7.99 17.85 5.15 15.01 5.15 11.5C5.15 7.99 7.99 5.15 11.5 5.15C11.56 5.15 11.62 5.15 11.68 5.15L9.61 7.22L11.02 8.64L15.26 4.39L11.02 0.15L9.61 1.56L11.67 3.63C11.61 3.63 11.56 3.63 11.5 3.63ZM11.47 10.21C11.1 10.32 10.75 10.51 10.46 10.78C10.01 11.23 9.79 11.82 9.79 12.45C9.79 13.1 10.03 13.67 10.46 14.12C10.93 14.6 11.56 14.85 12.26 14.85C13.04 14.85 13.71 14.59 14.19 14.07C14.57 13.65 14.78 13.1 14.82 12.43H13.56C13.52 12.78 13.39 13.06 13.17 13.27C12.96 13.48 12.65 13.58 12.26 13.58C11.85 13.58 11.52 13.46 11.29 13.23C11.06 13 10.94 12.69 10.94 12.34C10.94 12 11.06 11.72 11.29 11.51C11.51 11.29 11.82 11.18 12.22 11.18H12.88V9H9.65V10H11.47V10.21ZM16.31 9L15.73 9.2L15.5 10.36H15.12V14.5H13.92V9H16.31Z" />
                      </svg>
                    </button>

                    {/* Volume Control */}
                    <div 
                      className="vb-volume-container" 
                      onMouseEnter={() => setShowVolume(true)} 
                      onMouseLeave={() => setShowVolume(false)}
                    >
                      <button className="vb-icon-btn" title="Volume">
                        {volume > 0.5 ? "🔊" : volume > 0 ? "🔉" : "🔇"}
                      </button>
                      {showVolume && (
                        <div className="vb-volume-slider-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="vb-volume-slider"
                            title="Adjust Volume"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="vb-btn-group">
                    {/* Speed */}
                    <button className="vb-text-btn" onClick={cycleSpeed} title="Playback Speed">
                      {playbackRate}x
                    </button>

                    {/* Fullscreen */}
                    <button className="vb-icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        <div className="vb-lux-main" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="vb-glass-card" style={{ padding: '60px' }}>
            <h2 style={{ color: '#1A3B5C' }}>No Video Available</h2>
            <p style={{ color: '#556877', marginTop: '10px' }}>We couldn't load the video file for this product.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBook;