"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField, ChromaticAberration } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Mars from "./models/Mars";
import Spaceship from "./models/Spaceship";
import { AudioEngine } from "../utils/AudioEngine";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Particle Starfield ────────────────────────────────────────────────────
function Starfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2500;

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      // very slow drift
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        color="#ffffff"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Main Experience ───────────────────────────────────────────────────────
function Experience({ isEntered }: { isEntered?: boolean }) {
  const marsGroupRef  = useRef<THREE.Group>(null);
  const shipGroupRef  = useRef<THREE.Group>(null);
  const lightRef      = useRef<THREE.PointLight>(null);

  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  // ── CINEMATIC ENTRY: camera zooms from z=50 → z=7 while Mars is already spinning
  useEffect(() => {
    if (!isEntered) {
      camera.position.set(0, 0, 50);
      return;
    }

    // Reset positions before entry tween
    if (marsGroupRef.current)  marsGroupRef.current.position.set(0, 0, 0);
    if (marsGroupRef.current)  marsGroupRef.current.scale.set(1, 1, 1);
    if (shipGroupRef.current)  shipGroupRef.current.position.set(0, 0, -60);  // far behind
    if (shipGroupRef.current)  shipGroupRef.current.visible = false;

    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 7,
      duration: 2.8,
      ease: "power3.out",
    });
  }, [isEntered, camera]);

  // ── SCROLL-LINKED TIMELINE ─────────────────────────────────────────────
  useEffect(() => {
    if (!marsGroupRef.current || !shipGroupRef.current || !isEntered) return;

    // Kill any existing ScrollTriggers before creating new ones
    ScrollTrigger.getAll().forEach(t => t.kill());

    const mars  = marsGroupRef.current;
    const ship  = shipGroupRef.current;

    /**
     * Page scroll sections (approximate % of total scroll height):
     * 0%   – Hero         (Mars revolves, camera slowly pulls in)
     * 15%  – Exploration  (camera tilts right, Mars to right side)
     * 35%  – Journey      (Mars exits left, Ship enters from right, stays)
     * 60%  – Timeline     (Ship banks slightly, stays visible)
     * 75%  – Statistics   (Ship still visible, camera backs out a touch)
     * 90%  – Final CTA    (Ship exits, Mars returns giant in background)
     */

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end:   "bottom bottom",
        scrub: 2,
      },
    });

    // 0 → 0.15 — Hero: Mars centered, camera gently drifts closer
    tl.to(camera.position, { z: 5.5, ease: "none" },               "0");
    tl.to(mars.rotation,   { y: Math.PI * 1.5, ease: "none" },    "0");   // keeps spinning

    // 0.15 → 0.35 — Exploration: Mars drifts to the right side of screen
    tl.to(camera.position, {
      x: isMobile ? 0 : -1.5,
      z: 5,
      ease: "power1.inOut",
    }, "0.15");
    tl.to(mars.position, {
      x: isMobile ? 0 : 2,
      ease: "power1.inOut",
    }, "0.15");

    // 0.35 → 0.55 — Journey: Mars exits far left, Ship enters
    tl.to(mars.position, {
      x: -18,
      z: -5,
      ease: "power2.in",
      onStart: () => AudioEngine.playWoosh(),
    }, "0.35");
    tl.to(camera.position, { x: 0, z: 6, ease: "power1.inOut" }, "0.35");

    // Ship warps in from behind camera
    tl.set(ship, { visible: true },                                "0.38");
    tl.fromTo(ship.position,
      { x: isMobile ? 0 : 3, y: 0, z: -30 },
      { x: isMobile ? 0 : 2, y: 0, z:  0, ease: "power3.out",
        onStart: () => AudioEngine.playThruster() },
      "0.40"
    );

    // 0.55 → 0.75 — Timeline: Ship slowly flies forward/rotates
    tl.to(ship.position, {
      x: isMobile ? 0 : 1.5,
      y:  0.3,
      z:  1.5,
      ease: "power1.inOut",
    }, "0.55");
    tl.to(ship.rotation, { y: -0.3, ease: "power1.inOut" },       "0.55");

    // 0.75 → 0.88 — Statistics: Ship still visible, backing out
    tl.to(camera.position, { z: 8, ease: "power1.inOut" },        "0.75");
    tl.to(ship.position,   { z: 2, ease: "none" },                "0.75");

    // 0.88 → 1.0 — Final CTA: Ship exits forward, Mars comes back giant
    tl.to(ship.position, {
      z: 30,
      ease: "power3.in",
      onStart: () => AudioEngine.playWoosh(),
    }, "0.88");
    tl.to(ship.rotation, { y: 0.6, ease: "power2.in" },           "0.88");

    tl.to(mars.position, { x: 0, y: -4, z: -8, ease: "power3.out" },  "0.90");
    tl.to(mars.scale,    { x: 4, y: 4, z: 4, ease: "power2.inOut" }, "0.90");
    tl.to(camera.position, { x: 0, y: 0, z: 10, ease: "power1.inOut" }, "0.90");
    tl.to(mars.rotation, { y: Math.PI * 3, ease: "none" }, "0.90");

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isEntered, isMobile]);

  // ── CONTINUOUS ANIMATIONS (useFrame) ──────────────────────────────────
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Subtle mouse parallax on whole scene
    if (sceneRef.current) {
      sceneRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneRef.current.rotation.x, mouse.current.y * 0.04, 0.04
      );
      sceneRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneRef.current.rotation.y, mouse.current.x * 0.04, 0.04
      );
    }

    // Dynamic rim light that pulses slowly
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      {/* Main sunlight from top-right */}
      <directionalLight position={[12, 10, 5]} intensity={2.5} color="#ffedcc" castShadow />
      {/* Cyan rim/fill light */}
      <pointLight ref={lightRef} position={[-8, 2, 6]} intensity={1.5} color="#00f0ff" />
      {/* Warm back fill */}
      <pointLight position={[5, -5, -10]} intensity={0.8} color="#ff4500" />

      <group ref={sceneRef}>
        <Starfield />

        <group ref={marsGroupRef} position={[0, 0, 0]}>
          <Mars />
        </group>

        <group ref={shipGroupRef} position={[0, 0, -60]} visible={false}>
          <Spaceship />
        </group>
      </group>
    </>
  );
}

// ─── Canvas Wrapper ────────────────────────────────────────────────────────
export default function CanvasScene({ isEntered }: { isEntered?: boolean }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1 }}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 50] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.6 }}
      >
        <Suspense fallback={null}>
          <Experience isEntered={isEntered} />
          <EffectComposer>
            <Bloom luminanceThreshold={0.15} mipmapBlur intensity={2.0} />
            <Noise opacity={0.02} />
            <Vignette offset={0.12} darkness={1.2} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
