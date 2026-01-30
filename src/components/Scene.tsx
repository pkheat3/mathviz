"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera } from "@react-three/drei";
import { ReactNode, Suspense } from "react";

interface SceneProps {
  children: ReactNode;
}

function SceneContent({ children }: SceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[50, 50, 50]} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={200}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Grid
        args={[100, 100]}
        cellSize={5}
        cellThickness={0.5}
        cellColor="#6e6e6e"
        sectionSize={20}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={150}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />
      {children}
    </>
  );
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      className="w-full h-full"
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e)" }}
    >
      <Suspense fallback={null}>
        <SceneContent>{children}</SceneContent>
      </Suspense>
    </Canvas>
  );
}
