"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import { EquationPreset } from "@/lib/equations";
import {
  solveLorenz,
  solveVanDerPol,
  solveDampedPendulum,
  solveRossler,
} from "@/lib/solvers";

const Scene = dynamic(() => import("./Scene"), { ssr: false });
const PhaseSpace = dynamic(() => import("./PhaseSpace"), { ssr: false });

interface FullViewProps {
  equation: EquationPreset;
  onBack: () => void;
}

export default function FullView({ equation, onBack }: FullViewProps) {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [animatedIndex, setAnimatedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
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
      setAnimatedIndex(0);
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
    if (!isPlaying || points.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (time - lastTime > 16) {
        setAnimatedIndex((prev) => {
          const next = prev + 10;
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
  }, [isPlaying, points.length]);

  // Format parameter value for display
  const formatParamValue = (value: number): string => {
    if (Number.isInteger(value)) return value.toString();
    // Check if it's a simple fraction like 8/3
    if (Math.abs(value - 8 / 3) < 0.001) return "8/3";
    return value.toFixed(2);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Gallery
          </button>
        </div>
        <h1 className="text-xl font-semibold text-white">{equation.name}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setAnimatedIndex(0)}
            className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Visualization */}
        <main className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-400">Computing trajectory...</span>
              </div>
            </div>
          ) : (
            <Scene>
              <PhaseSpace
                points={points}
                animatedPointIndex={animatedIndex}
                showAxes={true}
                colorMode="time"
              />
            </Scene>
          )}
        </main>

        {/* Info panel */}
        <aside className="w-96 bg-slate-800/50 border-l border-slate-700 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">About</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {equation.fullDescription}
              </p>
            </div>

            {/* Fun fact */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">
                Fun Fact
              </h3>
              <p className="text-sm text-slate-300">{equation.funFact}</p>
            </div>

            {/* Parameters */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Parameters
              </h2>
              <div className="space-y-2">
                {Object.entries(equation.params).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center py-2 px-3 bg-slate-700/30 rounded-lg"
                  >
                    <span className="text-sm text-slate-300">
                      {equation.paramLabels[key] || key}
                    </span>
                    <span className="text-sm font-mono text-emerald-400">
                      {formatParamValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Visualization
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="py-2 px-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xs text-slate-400 block">
                    Dimension
                  </span>
                  <span className="text-sm text-white">
                    {equation.dimension}D
                  </span>
                </div>
                <div className="py-2 px-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xs text-slate-400 block">Points</span>
                  <span className="text-sm text-white">
                    {points.length.toLocaleString()}
                  </span>
                </div>
                <div className="py-2 px-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xs text-slate-400 block">
                    Time Step
                  </span>
                  <span className="text-sm font-mono text-white">
                    {equation.simulation.dt}
                  </span>
                </div>
                <div className="py-2 px-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xs text-slate-400 block">Status</span>
                  <span className="text-sm text-white">
                    {isPlaying ? "Playing" : "Paused"}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>Drag to rotate the view</p>
              <p>Scroll to zoom in/out</p>
              <p>Right-click drag to pan</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
