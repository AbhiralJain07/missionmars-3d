"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import ExplorationSection from "@/components/sections/ExplorationSection";
import JourneySection from "@/components/sections/JourneySection";
import TimelineSection from "@/components/sections/TimelineSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import OverlayUI from "@/components/ui/OverlayUI";
import Preloader from "@/components/ui/Preloader";

const CanvasScene = dynamic(() => import("@/components/canvas/CanvasScene"), { ssr: false });

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <main className="relative w-full bg-transparent">
      <Preloader onEnter={() => setIsEntered(true)} />

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <CanvasScene isEntered={isEntered} />
      </div>

      {/* HTML Content Overlay */}
      <div className={`relative z-10 w-full flex flex-col transition-opacity duration-1000 ${isEntered ? 'opacity-100' : 'opacity-0'}`}>
        <OverlayUI />
        <HeroSection />
        <ExplorationSection />
        <JourneySection />
        <TimelineSection />
        <StatisticsSection />
        <FinalCTASection />
      </div>
    </main>
  );
}
