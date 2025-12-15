import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei';
import PCModel from './PCModel';
import { BuildState, Theme } from '../types';

interface ThreeSceneProps {
  build: BuildState;
  rgbOn: boolean;
  autoRotate: boolean;
  theme: Theme;
  onThumbnailUpdate?: (dataUrl: string) => void;
}

// Helper component to handle side-effects inside the Canvas context
const SceneEffects = ({ 
  build, 
  onThumbnailUpdate 
}: { 
  build: BuildState, 
  onThumbnailUpdate?: (url: string) => void 
}) => {
  const { gl, scene, camera } = useThree();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onThumbnailUpdate) return;
    
    // Skip thumbnail generation if build is empty (perf optimization)
    if (Object.keys(build).length === 0) return;

    // Debounce the screenshot capture to avoid performance hit during rapid changes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Force a render before capture to ensure latest state
      gl.render(scene, camera);
      try {
          const dataUrl = gl.domElement.toDataURL('image/png', 0.5); // 0.5 quality for smaller storage
          onThumbnailUpdate(dataUrl);
      } catch (e) {
          console.warn("Failed to capture thumbnail", e);
      }
    }, 1500); // Increased wait time to 1.5s to be less aggressive

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [build, gl, scene, camera, onThumbnailUpdate]);

  return null;
};

const ThreeScene: React.FC<ThreeSceneProps> = ({ build, rgbOn, autoRotate, theme, onThumbnailUpdate }) => {
  // Define colors based on theme
  const bgColor = theme === 'dark' ? '#09090b' : '#f3f4f6'; 
  const gridSectionColor = theme === 'dark' ? '#6366f1' : '#a5b4fc'; 
  const gridCellColor = theme === 'dark' ? '#3f3f46' : '#e5e7eb'; 
  const shadowColor = '#000000';
  const shadowOpacity = theme === 'dark' ? 0.6 : 0.4;

  return (
    <div className={`w-full h-full absolute inset-0 ${theme === 'dark' ? 'bg-[#09090b]' : 'bg-gray-100'} transition-colors duration-300`}>
      <Canvas
        camera={{ position: [8, 6, 10], fov: 35 }}
        shadows
        // preserveDrawingBuffer is required to use toDataURL()
        gl={{ antialias: true, toneMappingExposure: 1.1, preserveDrawingBuffer: true }}
        dpr={[1, 2]} 
      >
        <SceneEffects build={build} onThumbnailUpdate={onThumbnailUpdate} />

        {/* Dynamic Background Color */}
        <color attach="background" args={[bgColor]} />
        
        {/* Dynamic Fog */}
        <fog attach="fog" args={[bgColor, 30, 90]} />

        <ambientLight intensity={theme === 'dark' ? 0.4 : 0.7} />
        
        {/* Key Light */}
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-bias={-0.0001}
        />
        
        {/* Fill Light */}
        <pointLight position={[-10, 5, -10]} intensity={0.8} color="#3b82f6" />
        
        {/* Rim Light */}
        <spotLight position={[0, 5, -10]} intensity={2.5} color="#8b5cf6" angle={0.6} />

        <Environment preset={theme === 'dark' ? "city" : "studio"} blur={0.8} background={false} />

        {/* Improved Grid Floor */}
        <Grid
          position={[0, -2.01, 0]}
          args={[80, 80]} 
          cellSize={2}    
          sectionSize={10} 
          sectionColor={gridSectionColor} 
          cellColor={gridCellColor} 
          fadeDistance={60}
          fadeStrength={1.5}
          infiniteGrid
        />

        <PCModel build={build} rgbOn={rgbOn} isRotating={autoRotate} />

        {/* Shadows on the floor */}
        <ContactShadows
          position={[0, -2, 0]}
          resolution={1024}
          scale={25}
          blur={2.5}
          opacity={shadowOpacity}
          far={10}
          color={shadowColor}
        />

        <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2 - 0.1} 
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={25}
            autoRotate={autoRotate}
            autoRotateSpeed={1.0}
        />
      </Canvas>
    </div>
  );
};

export default ThreeScene;