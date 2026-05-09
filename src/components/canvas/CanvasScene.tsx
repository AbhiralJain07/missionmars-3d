"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise, DepthOfField, ChromaticAberration } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Mars from "./models/Mars";
import Spaceship from "./models/Spaceship";
import { AudioEngine } from "../utils/AudioEngine";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Experience({ isEntered }: { isEntered?: boolean }) {
  const marsGroupRef = useRef<THREE.Group>(null);
  const shipGroupRef = useRef<THREE.Group>(null);
  const sceneGroupRef = useRef<THREE.Group>(null);

  const { camera, size } = useThree();

  // Cinematic entry
  useEffect(() => {
    if (!isEntered) {
      camera.position.set(0, 0, 50); // Start far away
      return;
    }

    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 8,
      duration: 2.5,
      ease: "power3.out",
    });
  }, [isEntered, camera]);

  // Scroll animations
  useEffect(() => {
    if (!marsGroupRef.current || !shipGroupRef.current || !isEntered) return;

    // Initial setups for scroll objects
    marsGroupRef.current.position.set(0, 0, 0);
    shipGroupRef.current.position.set(10, 0, -20); // Hidden initially

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      },
    });

    // Section 1: Hero to Exploration
    tl.to(camera.position, {
      x: size.width < 768 ? 0 : -3, 
      y: 0,
      z: 4,
      ease: "power1.inOut",
    }, 0);
    
    tl.to(marsGroupRef.current.rotation, {
      y: Math.PI / 2,
      ease: "none",
    }, 0);

    // Section 2: Exploration to Journey
    tl.to(marsGroupRef.current.position, {
      x: 10,
      z: -10,
      ease: "power2.inOut",
      onStart: () => AudioEngine.playWoosh(),
    }, 0.3);

    tl.to(shipGroupRef.current.position, {
      x: size.width < 768 ? 0 : 3,
      y: 0,
      z: 0,
      ease: "power2.out",
      onStart: () => AudioEngine.playThruster(),
    }, 0.3);

    tl.to(camera.position, {
      x: 0,
      z: 6,
      ease: "power1.inOut",
    }, 0.3);

    // Section 3: Timeline & Statistics
    tl.to(shipGroupRef.current.position, {
      z: 10, 
      ease: "power2.in",
      onStart: () => AudioEngine.playWoosh(),
    }, 0.6);

    tl.to(camera.position, {
      z: 8,
      ease: "power1.inOut",
    }, 0.6);

    // Section 4: Final CTA
    tl.to(marsGroupRef.current.position, {
      x: 0,
      y: -5,
      z: -5,
      ease: "power3.inOut",
      onStart: () => AudioEngine.playWoosh(),
    }, 0.8);

    tl.to(marsGroupRef.current.scale, {
      x: 3,
      y: 3,
      z: 3,
      ease: "power2.inOut",
    }, 0.8);

    tl.to(camera.position, {
      y: 0,
      z: 10,
      ease: "power1.inOut",
    }, 0.8);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera, size.width]);

  // Mouse parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (sceneGroupRef.current) {
      // Smooth parallax
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        mouse.current.y * 0.05,
        0.05
      );
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        mouse.current.x * 0.05,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#ffedcc" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />

      <group ref={sceneGroupRef}>
        
        <group ref={marsGroupRef} position={[0, 0, 0]}>
          <Mars />
        </group>

        <group ref={shipGroupRef} position={[10, 0, -20]}>
          <Spaceship />
        </group>
      </group>
    </>
  );
}

export default function CanvasScene({ isEntered }: { isEntered?: boolean }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 50] }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Experience isEntered={isEntered} />
          <EffectComposer>
            <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={3} height={480} />
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
            <ChromaticAberration
              blendFunction={THREE.AdditiveBlending as any} // Using Additive or Normal
              offset={new THREE.Vector2(0.0015, 0.0015)}
            />
            <Noise opacity={0.02} />
            <Vignette offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
