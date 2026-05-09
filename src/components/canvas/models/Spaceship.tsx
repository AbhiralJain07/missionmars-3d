"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Emissive panel glow material ──────────────────────────────────────────
function PanelGlow({ color = "#00f0ff", intensity = 2.5 }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={0.1}
      metalness={0.8}
    />
  );
}

export default function Spaceship() {
  const rootRef        = useRef<THREE.Group>(null);
  const bankRef        = useRef<THREE.Group>(null);  // for banking roll
  const eng1Ref        = useRef<THREE.Mesh>(null);
  const eng2Ref        = useRef<THREE.Mesh>(null);
  const eng3Ref        = useRef<THREE.Mesh>(null);
  const trailRef1      = useRef<THREE.Mesh>(null);
  const trailRef2      = useRef<THREE.Mesh>(null);
  const trailRef3      = useRef<THREE.Mesh>(null);
  const scannerRef     = useRef<THREE.Mesh>(null);
  const t              = useRef(0);

  useFrame((state, delta) => {
    t.current += delta;
    const time = t.current;

    // Gentle hover on root
    if (rootRef.current) {
      rootRef.current.position.y = Math.sin(time * 1.2) * 0.08;
    }

    // Organic banking roll
    if (bankRef.current) {
      bankRef.current.rotation.z = Math.sin(time * 0.6) * 0.06;
      bankRef.current.rotation.x = Math.sin(time * 0.4) * 0.03;
    }

    // Engine flicker — each engine independent
    const f1 = 0.7 + Math.sin(time * 18)  * 0.3 + Math.random() * 0.15;
    const f2 = 0.7 + Math.sin(time * 22 + 1) * 0.3 + Math.random() * 0.15;
    const f3 = 0.7 + Math.sin(time * 16 + 2) * 0.3 + Math.random() * 0.15;

    if (eng1Ref.current)   (eng1Ref.current.material   as THREE.MeshBasicMaterial).opacity = f1;
    if (eng2Ref.current)   (eng2Ref.current.material   as THREE.MeshBasicMaterial).opacity = f2;
    if (eng3Ref.current)   (eng3Ref.current.material   as THREE.MeshBasicMaterial).opacity = f3;

    // Trail length pulsing
    if (trailRef1.current) trailRef1.current.scale.z = 0.8 + f1 * 0.6;
    if (trailRef2.current) trailRef2.current.scale.z = 0.8 + f2 * 0.6;
    if (trailRef3.current) trailRef3.current.scale.z = 0.8 + f3 * 0.6;

    // Rotating sensor scanner dish
    if (scannerRef.current) {
      scannerRef.current.rotation.y = time * 2;
    }
  });

  // ── Shared materials (memoized — avoids recreating every frame) ─────────
  const hull = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0d0d14",
    roughness: 0.15,
    metalness: 0.95,
    flatShading: false,
  }), []);

  const panelDark = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#12121e",
    roughness: 0.4,
    metalness: 0.7,
  }), []);

  const heatShield = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#1a0800",
    roughness: 0.9,
    metalness: 0.1,
    emissive: "#330800",
    emissiveIntensity: 0.3,
  }), []);

  return (
    <group ref={rootRef} scale={1.1}>
      <group ref={bankRef}>

        {/* ── MAIN FUSELAGE — elongated tapered cylinder ── */}
        <mesh material={hull} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.42, 3.8, 12]} />
        </mesh>

        {/* Nose cone */}
        <mesh material={hull} position={[0, 0, 2.3]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 1.4, 10]} />
        </mesh>

        {/* Aft section (slightly wider) */}
        <mesh material={panelDark} position={[0, 0, -2.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.52, 0.6, 12]} />
        </mesh>

        {/* Heat shield belly */}
        <mesh material={heatShield} position={[0, -0.18, 0.2]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.55, 0.04, 3.0]} />
        </mesh>

        {/* ── COCKPIT — teardrop glass dome ── */}
        <mesh position={[0, 0.3, 0.9]}>
          <sphereGeometry args={[0.22, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshPhysicalMaterial
            color="#003040"
            metalness={0.0}
            roughness={0.0}
            transmission={0.85}
            transparent
            opacity={0.9}
            emissive="#004466"
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Cockpit frame ring */}
        <mesh position={[0, 0.16, 0.9]}>
          <torusGeometry args={[0.22, 0.012, 8, 24]} />
          <PanelGlow color="#00c8ff" intensity={1.5} />
        </mesh>

        {/* ── DELTA WINGS ── */}
        {/* Left wing */}
        <mesh material={hull} position={[-1.1, -0.04, -0.3]}
          rotation={[0, Math.PI / 8, -0.06]}
          scale={[1.4, 0.045, 0.9]}>
          <coneGeometry args={[1, 2.4, 3]} />
        </mesh>
        {/* Right wing */}
        <mesh material={hull} position={[1.1, -0.04, -0.3]}
          rotation={[0, -Math.PI / 8, 0.06]}
          scale={[1.4, 0.045, 0.9]}>
          <coneGeometry args={[1, 2.4, 3]} />
        </mesh>
        {/* Left winglet upswept */}
        <mesh material={panelDark} position={[-2.1, 0.18, -0.9]}
          rotation={[0, Math.PI / 6, -0.4]}
          scale={[0.4, 0.03, 0.35]}>
          <coneGeometry args={[1, 2, 3]} />
        </mesh>
        {/* Right winglet upswept */}
        <mesh material={panelDark} position={[2.1, 0.18, -0.9]}
          rotation={[0, -Math.PI / 6, 0.4]}
          scale={[0.4, 0.03, 0.35]}>
          <coneGeometry args={[1, 2, 3]} />
        </mesh>

        {/* ── WING PANEL LINES (emissive) ── */}
        {/* Left wing leading edge */}
        <mesh position={[-1.55, 0.02, -0.55]} rotation={[0, Math.PI / 7, 0]}>
          <boxGeometry args={[0.012, 0.012, 2.1]} />
          <PanelGlow color="#00f0ff" intensity={3} />
        </mesh>
        {/* Right wing leading edge */}
        <mesh position={[1.55, 0.02, -0.55]} rotation={[0, -Math.PI / 7, 0]}>
          <boxGeometry args={[0.012, 0.012, 2.1]} />
          <PanelGlow color="#00f0ff" intensity={3} />
        </mesh>
        {/* Spine line along fuselage top */}
        <mesh position={[0, 0.23, 0]}>
          <boxGeometry args={[0.01, 0.01, 3.4]} />
          <PanelGlow color="#00aaff" intensity={2} />
        </mesh>
        {/* Belly heat stripe */}
        <mesh position={[0, -0.21, 0.2]}>
          <boxGeometry args={[0.01, 0.01, 2.8]} />
          <PanelGlow color="#ff3300" intensity={1.5} />
        </mesh>

        {/* ── ENGINE POD NACELLES (3 engines) ── */}
        {/* Center engine */}
        <mesh material={panelDark} position={[0, -0.15, -2.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.24, 0.9, 10]} />
        </mesh>
        {/* Left engine */}
        <mesh material={panelDark} position={[-0.55, -0.05, -2.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.17, 0.8, 10]} />
        </mesh>
        {/* Right engine */}
        <mesh material={panelDark} position={[0.55, -0.05, -2.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.17, 0.8, 10]} />
        </mesh>

        {/* ── ENGINE GLOWS ── */}
        <mesh ref={eng1Ref} position={[0, -0.15, -2.75]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.01, 0.9, 16]} />
          <meshBasicMaterial color="#00cfff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={eng2Ref} position={[-0.55, -0.05, -2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.01, 0.7, 16]} />
          <meshBasicMaterial color="#00cfff" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={eng3Ref} position={[0.55, -0.05, -2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.01, 0.7, 16]} />
          <meshBasicMaterial color="#00cfff" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Engine core bright dots */}
        <mesh position={[0, -0.15, -2.5]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.55, -0.05, -2.35]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color="#aaffff" />
        </mesh>
        <mesh position={[0.55, -0.05, -2.35]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial color="#aaffff" />
        </mesh>

        {/* ── ENGINE TRAILS (scale-z animated) ── */}
        <mesh ref={trailRef1} position={[0, -0.15, -3.4]}>
          <cylinderGeometry args={[0.0, 0.16, 1.6, 8]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.18} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={trailRef2} position={[-0.55, -0.05, -3.0]}>
          <cylinderGeometry args={[0.0, 0.10, 1.2, 8]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={trailRef3} position={[0.55, -0.05, -3.0]}>
          <cylinderGeometry args={[0.0, 0.10, 1.2, 8]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ── SENSOR ARRAY / DISH (rotating) ── */}
        <group position={[0, 0.3, -0.8]}>
          <mesh ref={scannerRef}>
            <torusGeometry args={[0.12, 0.012, 6, 18]} />
            <PanelGlow color="#ff9900" intensity={2} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffcc00" />
          </mesh>
        </group>

        {/* ── WEAPON / SENSOR PODS under wings ── */}
        <mesh material={panelDark} position={[-1.2, -0.12, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.7, 6]} />
        </mesh>
        <mesh material={panelDark} position={[1.2, -0.12, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.7, 6]} />
        </mesh>
        {/* Pod tip glows */}
        <mesh position={[-1.2, -0.12, -1.0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <PanelGlow color="#ff2200" intensity={4} />
        </mesh>
        <mesh position={[1.2, -0.12, -1.0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <PanelGlow color="#ff2200" intensity={4} />
        </mesh>

      </group>
    </group>
  );
}
