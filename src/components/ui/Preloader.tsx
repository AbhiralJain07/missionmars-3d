"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioEngine } from "./../utils/AudioEngine";

interface PreloaderProps {
  onEnter: () => void;
}

export default function Preloader({ onEnter }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("Initializing systems...");
  const [isReady, setIsReady] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 5;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(Math.floor(currentProgress));

      if (currentProgress > 20 && currentProgress < 50) {
        setPhase("Calibrating thrusters...");
      } else if (currentProgress >= 50 && currentProgress < 80) {
        setPhase("Mapping terrain...");
      } else if (currentProgress >= 80 && currentProgress < 100) {
        setPhase("Pressurizing cabin...");
      } else if (currentProgress >= 100) {
        setPhase("All systems nominal.");
        setIsReady(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    setIsClicked(true);
    // Play transition sound (only if user enabled sound beforehand, though usually they can't until overlay is visible)
    // Wait, if they haven't enabled sound, it won't play. We can auto-enable sound on click!
    if (!AudioEngine.isEnabled) {
      // It's a user interaction, perfect time to initialize audio context
      AudioEngine.toggleSound(); 
    }
    AudioEngine.playWoosh();
    
    // Let the zoom animation run, then unlock scroll
    setTimeout(() => {
      document.body.style.overflow = "auto";
      onEnter();
    }, 2000); // 2 second cinematic zoom duration
  };

  return (
    <AnimatePresence>
      {!isClicked && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-space-black pointer-events-auto"
        >
          {/* Futuristic Radar/Scanner Graphic */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-12">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-white/10 border-t-mars-orange"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-white/5 border-b-neon-cyan"
            />
            
            <div className="text-center">
              <h2 className="font-display text-5xl font-bold text-white mb-2">{progress}%</h2>
              <p className="text-neon-cyan text-[10px] tracking-widest uppercase">{phase}</p>
            </div>
          </div>

          {/* Enter Button */}
          <div className="h-16 flex items-center justify-center">
            {isReady ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnter}
                className="px-8 py-3 bg-white text-space-black font-bold uppercase tracking-[0.2em] rounded-full text-sm hover:bg-neon-cyan transition-colors cyan-glow"
              >
                Enter Mission
              </motion.button>
            ) : (
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-mars-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
