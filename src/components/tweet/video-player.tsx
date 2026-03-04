"use client"

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  className?: string;
}

export const VideoPlayer = ({ src, thumbnail, className = '' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      container.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    const bar = progressRef.current;
    if (!video || !bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    video.currentTime = ratio * video.duration;
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (isPlaying) {
      hideTimeout.current = setTimeout(() => setShowControls(false), 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('progress', onProgress);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-border bg-black group cursor-pointer ${className}`}
      onClick={togglePlay}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video object-contain bg-black"
        muted={isMuted}
        playsInline
        preload="metadata"
        poster={thumbnail}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Thumbnail overlay / Big play button */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={togglePlay}
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 shadow-lg backdrop-blur-sm">
              <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause icon flash */}
      <AnimatePresence>
        {hasStarted && !isPlaying && showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <Play className="h-8 w-8 fill-white text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls bar */}
      <AnimatePresence>
        {hasStarted && showControls && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-3 pb-2 pt-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              className="group/progress relative mb-2 h-1 cursor-pointer rounded-full bg-white/20 transition-all hover:h-1.5"
              onClick={handleProgressClick}
            >
              {/* Buffered */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                style={{ width: `${buffered}%` }}
              />
              {/* Progress */}
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
              {/* Scrubber dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
                </button>

                <span className="text-xs text-white/80 font-medium tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute badge (always visible, top-right, like X) */}
      {hasStarted && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(e); }}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-opacity hover:bg-black/90"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
};
