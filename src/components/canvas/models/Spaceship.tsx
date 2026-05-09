"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Spaceship() {
  const shipRef = useRef<THREE.Group>(null);
  const engineGlow1Ref = useRef<THREE.Mesh>(null);
  const engineGlow2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (shipRef.current) {
      // Subtle hovering effect
      shipRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.01;
      shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      // Slight bank based on time
      shipRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.02;
    }
    
    // Engine flicker
    const flicker = 0.6 + Math.random() * 0.4;
    if (engineGlow1Ref.current) (engineGlow1Ref.current.material as THREE.MeshBasicMaterial).opacity = flicker;
    if (engineGlow2Ref.current) (engineGlow2Ref.current.material as THREE.MeshBasicMaterial).opacity = flicker;
  });

  // Futuristic Stealth Black Material
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: "#0a0a0c",
    roughness: 0.1,
    metalness: 0.9,
    flatShading: true,
  });

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a24",
    roughness: 0.3,
    metalness: 0.7,
    flatShading: true,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#00f0ff",
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.0,
    transmission: 0.9, // glass-like
    transparent: true,
    opacity: 0.8,
  });

  return (
    <group ref={shipRef} scale={0.8}>
      
      {/* Main Central Hull (Sleek elongated diamond) */}
      <mesh material={hullMaterial} scale={[0.6, 0.4, 3]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>

      {/* Cockpit Canopy */}
      <mesh material={glassMaterial} position={[0, 0.25, 0.5]} scale={[0.3, 0.2, 0.8]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>

      {/* Left Wing */}
      <mesh material={hullMaterial} position={[-0.8, 0, -0.5]} scale={[1.2, 0.05, 1]} rotation={[0, -Math.PI / 6, 0]}>
        <coneGeometry args={[1, 2, 3]} />
      </mesh>
      
      {/* Right Wing */}
      <mesh material={hullMaterial} position={[0.8, 0, -0.5]} scale={[1.2, 0.05, 1]} rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[1, 2, 3]} />
      </mesh>

      {/* Wing Trims (Neon Cyan) */}
      <mesh position={[-1.5, 0.06, -0.8]} rotation={[0, -Math.PI / 6, 0]}>
        <boxGeometry args={[0.02, 0.02, 2]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[1.5, 0.06, -0.8]} rotation={[0, Math.PI / 6, 0]}>
        <boxGeometry args={[0.02, 0.02, 2]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Engine Pods */}
      <mesh material={trimMaterial} position={[-0.4, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
      </mesh>
      <mesh material={trimMaterial} position={[0.4, 0, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 8]} />
      </mesh>

      {/* Engine Glows */}
      <mesh ref={engineGlow1Ref} position={[-0.4, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.01, 0.6, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={engineGlow2Ref} position={[0.4, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.01, 0.6, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Engine Cores */}
      <mesh position={[-0.4, 0, -1.5]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.4, 0, -1.5]}>
         <sphereGeometry args={[0.1, 16, 16]} />
         <meshBasicMaterial color="#ffffff" />
      </mesh>

    </group>
  );
}
