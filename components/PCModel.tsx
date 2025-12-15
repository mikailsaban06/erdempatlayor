import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BuildState, PartCategory } from '../types';
import * as THREE from 'three';

interface PCModelProps {
  build: BuildState;
  rgbOn: boolean;
  isRotating: boolean;
}

const PCModel: React.FC<PCModelProps> = ({ build, rgbOn, isRotating }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Helper to determine materials
  const getMaterial = (color: string, transparent = false, opacity = 1.0, emissive = false) => (
    <meshPhysicalMaterial
      color={color}
      transparent={transparent}
      opacity={opacity}
      roughness={0.2}
      metalness={0.8}
      emissive={emissive ? color : '#000000'}
      emissiveIntensity={emissive ? 2 : 0}
      transmission={transparent ? 0.5 : 0}
      thickness={transparent ? 0.5 : 0}
    />
  );

  const GlowMaterial = ({ color }: { color: string }) => (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={rgbOn ? 2 : 0}
      toneMapped={false}
    />
  );

  const casePart = build[PartCategory.CASE];
  const moboPart = build[PartCategory.MOTHERBOARD];
  const gpuPart = build[PartCategory.GPU];
  const ramPart = build[PartCategory.RAM];
  const coolerPart = build[PartCategory.COOLER];
  const fanPart = build[PartCategory.FAN];
  const psuPart = build[PartCategory.PSU];

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      
      {/* --- CASE --- */}
      {casePart ? (
        <group>
            {/* Chassis Frame */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[2.1, 4.1, 4.1]} />
                <meshStandardMaterial color="#222" wireframe />
            </mesh>
            {/* Glass Panels */}
            <mesh position={[1.05, 1.5, 0]}>
               <boxGeometry args={[0.05, 4, 4]} />
               {getMaterial(casePart.color || '#111', true, 0.2)}
            </mesh>
            <mesh position={[0, 1.5, 2.05]}>
               <boxGeometry args={[2, 4, 0.05]} />
               {getMaterial(casePart.color || '#111', true, 0.2)}
            </mesh>
            {/* Solid Back Panel */}
            <mesh position={[-1.05, 1.5, 0]}>
               <boxGeometry args={[0.05, 4, 4]} />
               {getMaterial(casePart.color || '#111')}
            </mesh>
            {/* Top/Bottom */}
            <mesh position={[0, 3.55, 0]}>
                <boxGeometry args={[2.2, 0.1, 4.2]} />
                {getMaterial(casePart.color || '#111')}
            </mesh>
            <mesh position={[0, -0.55, 0]}>
                <boxGeometry args={[2.2, 0.1, 4.2]} />
                {getMaterial(casePart.color || '#111')}
            </mesh>
        </group>
      ) : (
        // Placeholder outline if no case
        <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2, 4, 4]} />
            <meshBasicMaterial color="#333" wireframe />
        </mesh>
      )}

      {/* --- MOTHERBOARD --- */}
      {moboPart && (
        <group position={[-0.9, 1.5, 0]}>
            <mesh rotation={[0, 0, 0]}>
                <boxGeometry args={[0.2, 3.5, 3]} />
                {getMaterial('#2a2a2a')}
            </mesh>
            {/* PCB Details */}
            <mesh position={[0.11, 0, 0]}>
                <boxGeometry args={[0.05, 3.3, 2.8]} />
                {getMaterial('#111')}
            </mesh>
             {/* VRM Heatsinks */}
             <mesh position={[0.2, 1.2, -0.5]}>
                <boxGeometry args={[0.3, 0.5, 1.5]} />
                {getMaterial('#555')}
             </mesh>
             {rgbOn && (
                <pointLight position={[0.5, 0, 0]} intensity={1} color="#00ffcc" distance={3} />
             )}
        </group>
      )}

      {/* --- GPU --- */}
      {gpuPart && moboPart && (
        <group position={[-0.4, 0.5, 0]}>
            <mesh>
                <boxGeometry args={[1.5, 0.4, 2.8]} />
                {getMaterial(gpuPart.color || '#333')}
            </mesh>
            {/* GPU Fans Glow */}
            {rgbOn && (
                <>
                <mesh position={[0.76, 0, 0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                    <GlowMaterial color="#ff00ff" />
                </mesh>
                <mesh position={[0.76, 0, -0.5]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
                    <GlowMaterial color="#ff00ff" />
                </mesh>
                </>
            )}
        </group>
      )}

      {/* --- RAM --- */}
      {ramPart && moboPart && (
        <group position={[-0.6, 1.8, 0.5]}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.1, 1.2, 0.05]} />
                {getMaterial(ramPart.color || '#111')}
            </mesh>
            <mesh position={[0.2, 0, 0]}>
                <boxGeometry args={[0.1, 1.2, 0.05]} />
                {getMaterial(ramPart.color || '#111')}
            </mesh>
            {/* RGB Strips on RAM */}
            <mesh position={[0.05, 0.5, 0]}>
                <boxGeometry args={[0.05, 0.2, 0.05]} />
                <GlowMaterial color={rgbOn ? "#ffaa00" : "#333"} />
            </mesh>
             <mesh position={[0.25, 0.5, 0]}>
                <boxGeometry args={[0.05, 0.2, 0.05]} />
                <GlowMaterial color={rgbOn ? "#ffaa00" : "#333"} />
            </mesh>
        </group>
      )}

      {/* --- CPU COOLER --- */}
      {coolerPart && moboPart && (
        <group position={[-0.5, 1.8, -0.5]}>
            {/* Block */}
            <mesh>
                <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
                {getMaterial('#111')}
            </mesh>
            {/* Tubes / Radiator (Simplified representation for AIO) */}
            <mesh position={[0.5, 1.5, 0]} rotation={[0,0, -0.2]}>
                <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
                 <meshStandardMaterial color="#000" />
            </mesh>
            {/* Pump RGB */}
            <mesh position={[0, 0.16, 0]} rotation={[Math.PI/2, 0, 0]}>
                <circleGeometry args={[0.3, 32]} />
                <GlowMaterial color="#00ffff" />
            </mesh>
        </group>
      )}

      {/* --- PSU --- */}
      {psuPart && casePart && (
        <group position={[-0.5, -0.3, 0]}>
             <mesh>
                <boxGeometry args={[1.5, 0.8, 1.5]} />
                {getMaterial('#111')}
            </mesh>
        </group>
      )}

      {/* --- FANS --- */}
      {fanPart && casePart && (
         <group position={[0.9, 1.5, 1.5]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
                 <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
                 {getMaterial('#111')}
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0,0,0.06]}>
                 <ringGeometry args={[0.5, 0.55, 32]} />
                 <GlowMaterial color={rgbOn ? "#00ff00" : "#333"} />
            </mesh>
         </group>
      )}

    </group>
  );
};

export default PCModel;