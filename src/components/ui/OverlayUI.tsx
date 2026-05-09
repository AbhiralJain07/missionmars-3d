"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { AudioEngine } from "../utils/AudioEngine";

export default function OverlayUI() {
  const [soundEnabled, setSoundEnabled] = useState(AudioEngine.isEnabled);

  // Sync state if it was enabled globally (e.g., in Preloader)
  useEffect(() => {
    const interval = setInterval(() => {
      if (soundEnabled !== AudioEngine.isEnabled) {
        setSoundEnabled(AudioEngine.isEnabled);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const toggleSound = () => {
    const isEnabled = AudioEngine.toggleSound();
    setSoundEnabled(isEnabled);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 md:p-10 pointer-events-auto"
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-neon-cyan cyan-glow animate-pulse" />
        <span className="font-display font-bold tracking-widest text-sm uppercase text-white">
          Ares<span className="text-mars-orange">I</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 glass-panel px-6 py-3 rounded-full">
        {["Mission", "Journey", "Timeline", "Data"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        onClick={toggleSound}
        className="glass-panel w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-105"
      >
        {soundEnabled ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        )}
      </button>
    </motion.header>
  );
}
