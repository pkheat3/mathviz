"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { EquationPreset } from "@/lib/equations";
import {
  solveLorenz,
  solveVanDerPol,
  solveDampedPendulum,
  solveRossler,
} from "@/lib/solvers";

const MiniScene = dynamic(() => import("./MiniScene"), { ssr: false });

interface VisualizationCardProps {
  equation: EquationPreset;
  onClick: () => void;
}

export default function VisualizationCard({ equation, onClick }: VisualizationCardProps) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | null>(null);

  const solve = useCallback(async () => {
    setIsLoading(true);
    try {
      let result: THREE.Vector3[] = [];
      const { params, initial, simulation } = equation;

      switch (equation.id) {
        case "lorenz":
          result = await solveLorenz({
            sigma: params.sigma ?? 10,
            rho: params.rho ?? 28,
            beta: params.beta ?? 8 / 3,
            x0: initial.x0,
            y0: initial.y0,
            z0: initial.z0,
            dt: simulation.dt,
            steps: simulation.steps,
          });
          break;
        case "van_der_pol":
          result = await solveVanDerPol({
            mu: params.mu ?? 1,
            x0: initial.x0,
            y0: initial.y0,
            dt: simulation.dt,
            steps: simulation.steps,
          });
          break;
        case "damped_pendulum":
          result = await solveDampedPendulum({
            gamma: params.gamma ?? 0.5,
            omega0: params.omega0 ?? 1,
            theta0: initial.x0,
            omegaInit: initial.y0,
            dt: simulation.dt,
            steps: simulation.steps,
          });
          break;
        case "rossler":
          result = await solveRossler({
            a: params.a ?? 0.2,
            b: params.b ?? 0.2,
            c: params.c ?? 5.7,
            x0: initial.x0,
            y0: initial.y0,
            z0: initial.z0,
            dt: simulation.dt,
            steps: simulation.steps,
          });
          break;
      }

      setPoints(result);
    } catch (error) {
      console.error("Error solving equation:", error);
    } finally {
      setIsLoading(false);
    }
  }, [equation]);

  useEffect(() => {
    solve();
  }, [solve]);

  // Animation loop
  useEffect(() => {
    if (points.length === 0) return;

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 32) {
        // ~30fps for thumbnails
        setAnimatedIndex((prev) => {
          const next = prev + 15;
          return next >= points.length ? 0 : next;
        });
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [points.length]);

  const dimensionLabel = equation.dimension === 3 ? "3D" : "2D";

  return (
    <div
      onClick={onClick}
      className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10"
    >
      {/* Mini visualization */}
      <div className="h-48 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MiniScene points={points} animatedIndex={animatedIndex} dimension={equation.dimension} />
        )}

        {/* Dimension badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-slate-900/80 rounded text-xs font-medium text-slate-300">
          {dimensionLabel}
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
          {equation.name}
        </h3>
        <p className="text-sm text-slate-400 mt-1 line-clamp-2">
          {equation.shortDescription}
        </p>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
