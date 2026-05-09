"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;
void main() {
  // Calculate Fresnel effect
  float intensity = pow(0.55 - dot(vNormal, vPositionNormal), 3.0);
  // Mars orange/red glow
  gl_FragColor = vec4(1.0, 0.35, 0.1, 1.0) * intensity * 1.5;
}
`;

export default function Mars() {
  const marsRef = useRef<THREE.Group>(null);
  const atmosRef = useRef<THREE.Mesh>(null);
  const [textures, setTextures] = useState<{ colorMap: THREE.Texture; normalMap: THREE.Texture } | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Load both textures
    Promise.all([
      new Promise<THREE.Texture>((resolve) => loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg', resolve)),
      new Promise<THREE.Texture>((resolve) => loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_normal.jpg', resolve))
    ]).then(([color, normal]) => {
      color.colorSpace = THREE.SRGBColorSpace;
      setTextures({ colorMap: color, normalMap: normal });
    });
  }, []);

  useFrame((state, delta) => {
    if (marsRef.current) {
      marsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={marsRef}>
      {/* Core Planet with Textures */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        {textures ? (
          <meshStandardMaterial
            map={textures.colorMap}
            normalMap={textures.normalMap}
            normalScale={new THREE.Vector2(2, 2)}
            roughness={0.8}
            metalness={0.1}
          />
        ) : (
          <meshStandardMaterial color="#d14924" roughness={0.8} metalness={0.2} />
        )}
      </mesh>

      {/* Custom Shader Atmospheric Glow */}
      <mesh ref={atmosRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
