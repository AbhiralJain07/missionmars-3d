"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="mission" className="relative w-full h-[100vh] flex flex-col items-center justify-center pointer-events-none">
      <div className="text-center z-10 flex flex-col items-center pointer-events-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-mars-orange uppercase tracking-[0.5em] text-sm md:text-base font-semibold mb-6"
        >
          Humanity's Next Giant Leap
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-glow"
        >
          MISSION<br/>MARS
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12"
        >
          <button className="glass-panel px-8 py-4 rounded-full font-sans uppercase tracking-widest text-sm hover:bg-white/10 transition-colors border border-white/20 hover:border-mars-orange hover:text-mars-orange">
            Initiate Sequence
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}
