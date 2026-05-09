"use client";

import { motion } from "framer-motion";

export default function ExplorationSection() {
  return (
    <section id="exploration" className="relative w-full min-h-[150vh] flex items-center pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Empty col for 3D model space */}
        <div className="hidden md:block"></div>
        
        <div className="flex flex-col justify-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-20%" }}
            transition={{ duration: 1 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border-l-4 border-l-mars-red"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              01. The <span className="text-mars-orange">Terrain</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Navigate the treacherous Valles Marineris. Our advanced rovers survey the landscape, searching for subterranean ice and preparing the groundwork for the first human habitats. 
              The red dust hides ancient secrets waiting to be unearthed.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-neon-cyan text-xs uppercase tracking-widest mb-1">Atmosphere</p>
                <p className="text-white text-xl font-bold">95% CO₂</p>
              </div>
              <div>
                <p className="text-neon-cyan text-xs uppercase tracking-widest mb-1">Gravity</p>
                <p className="text-white text-xl font-bold">3.721 m/s²</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
