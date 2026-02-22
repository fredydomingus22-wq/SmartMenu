"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideoClientProps {
  poster: string;
  videoSrc: string;
}

export function HeroVideoClient({ poster, videoSrc }: HeroVideoClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && videoRef.current) {
      // Force play and ensure muted is set programmatically
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn("Autoplay was prevented or failed:", err);
      });
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60" 
        style={{ backgroundImage: `url(${poster})` }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={poster}
      className="absolute inset-0 w-full h-full object-cover opacity-100"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
