"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

interface PhaseSpaceProps {
  points: THREE.Vector3[];
  animatedPointIndex: number;
  showAxes?: boolean;
  colorMode?: "velocity" | "time" | "solid";
}

export default function PhaseSpace({
  points,
  animatedPointIndex,
  showAxes = true,
  colorMode = "time",
}: PhaseSpaceProps) {
  const animatedPointRef = useRef<THREE.Mesh>(null);

  // Generate colors based on mode
  const colors = useMemo(() => {
    if (points.length === 0) return [];

    if (colorMode === "solid") {
      return points.map(() => new THREE.Color("#00ff88"));
    }

    if (colorMode === "time") {
      return points.map((_, i) => {
        const t = i / points.length;
        // Gradient from blue to red
        return new THREE.Color().setHSL(0.7 - t * 0.7, 1, 0.5);
      });
    }

    // Velocity-based coloring
    const velocities: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const v = points[i + 1].clone().sub(points[i]).length();
      velocities.push(v);
    }
    velocities.push(velocities[velocities.length - 1] || 0);

    const maxV = Math.max(...velocities, 0.001);
    return velocities.map((v) => {
      const t = v / maxV;
      return new THREE.Color().setHSL(0.7 - t * 0.7, 1, 0.5);
    });
  }, [points, colorMode]);

  // Calculate bounds for axis scaling
  const bounds = useMemo(() => {
    if (points.length === 0) {
      return { min: new THREE.Vector3(-10, -10, -10), max: new THREE.Vector3(10, 10, 10) };
    }
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    points.forEach((p) => {
      min.min(p);
      max.max(p);
    });
    return { min, max };
  }, [points]);

  // Update animated point position
  useFrame(() => {
    if (animatedPointRef.current && points.length > 0) {
      const idx = Math.min(animatedPointIndex, points.length - 1);
      const point = points[idx];
      if (point) {
        animatedPointRef.current.position.copy(point);
      }
    }
  });

  if (points.length === 0) {
    return null;
  }

  const axisLength = Math.max(
    bounds.max.x - bounds.min.x,
    bounds.max.y - bounds.min.y,
    bounds.max.z - bounds.min.z
  ) * 0.6;

  return (
    <group>
      {/* Trajectory line */}
      <Line
        points={points}
        vertexColors={colors}
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />

      {/* Animated current position point */}
      <mesh ref={animatedPointRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Axis lines and labels */}
      {showAxes && (
        <group>
          {/* X axis - red */}
          <Line
            points={[
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(axisLength, 0, 0),
            ]}
            color="#ff4444"
            lineWidth={2}
          />
          <Text
            position={[axisLength + 2, 0, 0]}
            fontSize={3}
            color="#ff4444"
          >
            X
          </Text>

          {/* Y axis - green */}
          <Line
            points={[
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, axisLength, 0),
            ]}
            color="#44ff44"
            lineWidth={2}
          />
          <Text
            position={[0, axisLength + 2, 0]}
            fontSize={3}
            color="#44ff44"
          >
            Y
          </Text>

          {/* Z axis - blue */}
          <Line
            points={[
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, 0, axisLength),
            ]}
            color="#4444ff"
            lineWidth={2}
          />
          <Text
            position={[0, 0, axisLength + 2]}
            fontSize={3}
            color="#4444ff"
          >
            Z
          </Text>
        </group>
      )}
    </group>
  );
}
