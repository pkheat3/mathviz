"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface MiniPhaseSpaceProps {
  points: THREE.Vector3[];
  animatedIndex: number;
}

function MiniPhaseSpace({ points, animatedIndex }: MiniPhaseSpaceProps) {
  const animatedPointRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate colors
  const colors = useMemo(() => {
    if (points.length === 0) return [];
    return points.map((_, i) => {
      const t = i / points.length;
      return new THREE.Color().setHSL(0.7 - t * 0.7, 1, 0.5);
    });
  }, [points]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
    if (animatedPointRef.current && points.length > 0) {
      const idx = Math.min(animatedIndex, points.length - 1);
      const point = points[idx];
      if (point) {
        animatedPointRef.current.position.copy(point);
      }
    }
  });

  if (points.length === 0) return null;

  return (
    <group ref={groupRef}>
      <Line
        points={points}
        vertexColors={colors}
        lineWidth={1}
        transparent
        opacity={0.8}
      />
      <mesh ref={animatedPointRef}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

interface MiniSceneProps {
  points: THREE.Vector3[];
  animatedIndex: number;
  dimension: 2 | 3;
}

export default function MiniScene({ points, animatedIndex, dimension }: MiniSceneProps) {
  // Calculate camera position based on points
  const cameraPosition = useMemo(() => {
    if (points.length === 0) return [50, 50, 50] as const;

    const center = new THREE.Vector3();
    points.forEach((p) => center.add(p));
    center.divideScalar(points.length);

    let maxDist = 0;
    points.forEach((p) => {
      const dist = p.distanceTo(center);
      if (dist > maxDist) maxDist = dist;
    });

    const distance = maxDist * 2.5;

    if (dimension === 2) {
      return [0, 0, distance] as const;
    }
    return [distance * 0.7, distance * 0.5, distance * 0.7] as const;
  }, [points, dimension]);

  return (
    <Canvas
      className="w-full h-full"
      style={{ background: "linear-gradient(to bottom, #1a1a2e, #16213e)" }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={cameraPosition} />
        <ambientLight intensity={0.5} />
        <MiniPhaseSpace points={points} animatedIndex={animatedIndex} />
      </Suspense>
    </Canvas>
  );
}
