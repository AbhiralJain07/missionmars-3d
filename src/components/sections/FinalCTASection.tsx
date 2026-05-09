"use client";

import { motion } from "framer-motion";

export default function FinalCTASection() {
  return (
    <section className="relative w-full h-[100vh] flex flex-col items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent z-0" />
      
      <div className="text-center z-10 flex flex-col items-center pointer-events-auto">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-display text-5xl md:text-8xl font-bold tracking-tighter text-glow mb-8"
        >
          JOIN THE FUTURE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-text-secondary max-w-xl mx-auto mb-12 text-lg"
        >
          The next chapter of human history is being written. Secure your place among the stars.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative px-12 py-4 bg-mars-orange text-white font-bold tracking-widest uppercase rounded-full hover:scale-105 transition-transform group overflow-hidden mars-glow"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">Apply for Mission</span>
        </motion.button>
      </div>
    </section>
  );
}
