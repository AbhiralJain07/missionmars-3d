"use client";

import { motion } from "framer-motion";

const timelineEvents = [
  { year: "2028", title: "Unmanned Setup", desc: "Autonomous robots establish power grid and initial hab modules." },
  { year: "2031", title: "First Landing", desc: "A crew of four touches down in the Jezero Crater region." },
  { year: "2035", title: "Colony Alpha", desc: "Permanent habitation established with sustainable resource extraction." },
  { year: "2042", title: "Terraform Init", desc: "Atmospheric processors begin the century-long warming process." },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="relative w-full min-h-[100vh] py-32 flex flex-col justify-center pointer-events-none">
      <div className="container mx-auto px-6 md:px-12 pointer-events-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="font-display text-4xl md:text-5xl font-bold mb-16 text-center text-white"
        >
          Mission <span className="text-mars-orange">Timeline</span>
        </motion.h2>

        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -translate-y-1/2 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group"
              >
                {/* Node on line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-space-black border-2 border-mars-orange z-10 hidden md:block group-hover:bg-mars-orange transition-colors mars-glow" />
                
                <div className="glass-panel p-6 rounded-2xl md:mt-16 group-hover:-translate-y-2 transition-transform duration-300">
                  <h3 className="text-3xl font-display font-bold text-mars-orange mb-2">{event.year}</h3>
                  <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                  <p className="text-sm text-text-secondary">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
