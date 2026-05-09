"use client";

import { motion } from "framer-motion";

export default function JourneySection() {
  return (
    <section id="journey" className="relative w-full min-h-[150vh] flex items-center pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="flex flex-col justify-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border-r-4 border-r-neon-cyan backdrop-blur-xl"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              02. The <span className="text-neon-cyan">Journey</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              A 300 million mile odyssey through the cold void. Powered by next-generation ion thrusters, 
              our vessel cruises at unprecedented speeds while maintaining artificial gravity and advanced shielding against solar radiation.
            </p>
            
            <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-neon-cyan transition-colors">
              <span className="w-8 h-[1px] bg-neon-cyan"></span>
              View Ship Specs
            </button>
          </motion.div>
        </div>

        {/* Empty col for 3D spaceship */}
        <div className="hidden md:block"></div>
      </div>
    </section>
  );
}
