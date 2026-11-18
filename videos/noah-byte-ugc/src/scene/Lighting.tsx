import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Image-based reflections + a warm key (window), cool rim (screen glow) and soft fill.
export const Lighting: React.FC<{ keyIntensity?: number; rim?: string; shadows?: boolean; envIntensity?: number }> = ({
  keyIntensity = 2.6, rim = "#8a7dff", shadows = true, envIntensity = 0.55,
}) => {
  const { gl, scene } = useThree();
  const env = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  }, [gl]);
  scene.environment = env;
  (scene as any).environmentIntensity = envIntensity;
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.05;
  return (
    <>
      <hemisphereLight args={["#fff1e0", "#3a2f55", 0.55]} />
      <directionalLight
        position={[-5, 7, 6]} intensity={keyIntensity} color="#fff0dc" castShadow={shadows}
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004}
        shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}
      />
      <directionalLight position={[5, 4, -6]} intensity={2.2} color={rim} />
      <directionalLight position={[-6, 2, -4]} intensity={1.1} color="#7fd6ff" />
      <pointLight position={[2.5, 1.2, 4]} intensity={6} distance={12} color="#ffd9b8" />
    </>
  );
};
