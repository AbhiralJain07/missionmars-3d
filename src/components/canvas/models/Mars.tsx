"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

// ── Atmospheric Fresnel Glow Shader ─────────────────────────────────────
const atmosVert = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const atmosFrag = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 4.0);
    // Warm orange inner rim → reddish outer haze
    vec3 innerColor = vec3(1.0, 0.45, 0.15);
    vec3 outerColor = vec3(0.6, 0.08, 0.02);
    vec3 col = mix(outerColor, innerColor, fresnel);
    gl_FragColor = vec4(col, fresnel * 0.9);
  }
`;

// ── Cloud / dust haze layer shader ──────────────────────────────────────
const dustVert = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const dustFrag = /* glsl */`
  varying vec2 vUv;
  uniform float uTime;

  // simple hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // FBM
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v   += amp * noise(p);
      p   *= 2.2;
      amp *= 0.45;
    }
    return v;
  }

  void main() {
    vec2 p = vUv * 4.0 + vec2(uTime * 0.012, 0.0);
    float n = fbm(p);
    // Very subtle transparent dust storms
    float alpha = smoothstep(0.55, 0.75, n) * 0.12;
    vec3 color  = vec3(0.92, 0.58, 0.30);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Mars() {
  const marsRef   = useRef<THREE.Group>(null);
  const dustRef   = useRef<THREE.Mesh>(null);

  // Load texture from local /public — always available, no CORS issues
  const colorMap = useLoader(TextureLoader, "/mars_color.jpg");
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;

  // Dust uniform (time-driven)
  const dustUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state, delta) => {
    if (marsRef.current) {
      // Slow self-rotation
      marsRef.current.rotation.y += delta * 0.04;
    }
    // Animate dust
    dustUniforms.uTime.value += delta;
  });

  return (
    <group ref={marsRef}>

      {/* ── Core planet with high-res texture ── */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          roughness={0.85}
          metalness={0.05}
          // Subtle dark-side shadowing via env
          envMapIntensity={0.3}
        />
      </mesh>

      {/* ── Procedural animated dust-storm layer ── */}
      <mesh ref={dustRef}>
        <sphereGeometry args={[2.012, 64, 64]} />
        <shaderMaterial
          vertexShader={dustVert}
          fragmentShader={dustFrag}
          uniforms={dustUniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* ── Fresnel atmospheric rim glow ── */}
      <mesh>
        <sphereGeometry args={[2.08, 64, 64]} />
        <shaderMaterial
          vertexShader={atmosVert}
          fragmentShader={atmosFrag}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Wide hazy outer atmosphere ── */}
      <mesh>
        <sphereGeometry args={[2.25, 32, 32]} />
        <meshBasicMaterial
          color="#b03010"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

    </group>
  );
}
