"use client";

import { useState } from "react";
import VisualizationCard from "@/components/VisualizationCard";
import FullView from "@/components/FullView";
import { equations, equationList, EquationType } from "@/lib/equations";

export default function Home() {
  const [selectedEquation, setSelectedEquation] = useState<EquationType | null>(null);

  // Full view mode
  if (selectedEquation) {
    return (
      <FullView
        equation={equations[selectedEquation]}
        onBack={() => setSelectedEquation(null)}
      />
    );
  }

  // Gallery view
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-white">
            math<span className="text-emerald-400">viz</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Explore differential equation visualizations
          </p>
        </div>
      </header>

      {/* Gallery */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equationList.map((equation) => (
            <VisualizationCard
              key={equation.id}
              equation={equation}
              onClick={() => setSelectedEquation(equation.id)}
            />
          ))}
        </div>

        {/* Info text */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Click any card to explore the visualization in full screen
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-slate-500 text-sm text-center">
            Powered by WebAssembly numerical solvers
          </p>
        </div>
      </footer>
    </div>
  );
}
