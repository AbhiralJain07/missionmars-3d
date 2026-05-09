"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Distance", value: "300M", unit: "Miles" },
  { label: "Travel Time", value: "7", unit: "Months" },
  { label: "Crew Capacity", value: "12", unit: "Members" },
  { label: "Payload", value: "100", unit: "Tons" },
];

export default function StatisticsSection() {
  return (
    <section id="data" className="relative w-full min-h-[100vh] py-32 flex flex-col justify-center pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 pointer-events-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
              className="glass-panel aspect-square flex flex-col items-center justify-center rounded-full border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h4 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 relative z-10">{stat.value}</h4>
              <p className="text-neon-cyan font-bold tracking-widest text-xs uppercase relative z-10">{stat.unit}</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest mt-4 relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
