export type EquationType = "lorenz" | "van_der_pol" | "damped_pendulum" | "rossler";

export interface EquationPreset {
  id: EquationType;
  name: string;
  shortDescription: string;
  fullDescription: string;
  funFact: string;
  dimension: 2 | 3;
  params: Record<string, number>;
  paramLabels: Record<string, string>;
  initial: { x0: number; y0: number; z0: number };
  simulation: { dt: number; steps: number };
}

export const equations: Record<EquationType, EquationPreset> = {
  lorenz: {
    id: "lorenz",
    name: "Lorenz Attractor",
    shortDescription: "The butterfly effect in action",
    fullDescription:
      "The Lorenz attractor is a set of chaotic solutions to the Lorenz system, a simplified model of atmospheric convection. It demonstrates how tiny changes in initial conditions can lead to vastly different outcomes - the famous 'butterfly effect'. The system never settles into a steady state or repeats exactly, yet it follows a beautiful butterfly-shaped pattern.",
    funFact:
      "Discovered by meteorologist Edward Lorenz in 1963 while modeling weather patterns. He found that rounding a number from 0.506127 to 0.506 completely changed the weather prediction!",
    dimension: 3,
    params: {
      sigma: 10,
      rho: 28,
      beta: 8 / 3,
    },
    paramLabels: {
      sigma: "σ (Prandtl number)",
      rho: "ρ (Rayleigh number)",
      beta: "β (geometric factor)",
    },
    initial: { x0: 1, y0: 1, z0: 1 },
    simulation: { dt: 0.01, steps: 10000 },
  },
  van_der_pol: {
    id: "van_der_pol",
    name: "Van der Pol Oscillator",
    shortDescription: "Self-sustaining electronic heartbeat",
    fullDescription:
      "The Van der Pol oscillator is a non-conservative oscillator with nonlinear damping. Unlike a simple pendulum that eventually stops, this system maintains its oscillation indefinitely. It was originally developed to describe electrical circuits with vacuum tubes, but the same mathematics describes heartbeat rhythms and other biological oscillators.",
    funFact:
      "The Van der Pol equation has been used to model the human heartbeat. When μ is small, the oscillation is nearly sinusoidal (like a healthy heart). When μ is large, you get 'relaxation oscillations' with sudden jumps - similar to abnormal heart rhythms!",
    dimension: 2,
    params: {
      mu: 1.5,
    },
    paramLabels: {
      mu: "μ (nonlinearity strength)",
    },
    initial: { x0: 2, y0: 0, z0: 0 },
    simulation: { dt: 0.02, steps: 5000 },
  },
  damped_pendulum: {
    id: "damped_pendulum",
    name: "Damped Pendulum",
    shortDescription: "Energy slowly fading to stillness",
    fullDescription:
      "The damped pendulum models a pendulum swinging through a resistive medium like air or oil. Unlike an ideal pendulum that swings forever, this system gradually loses energy to friction and eventually comes to rest. The phase space shows a spiral converging to the origin - the pendulum's final resting position.",
    funFact:
      "The grandfather clock uses a clever mechanism to add tiny amounts of energy to compensate for damping, keeping the pendulum swinging with remarkably constant period. Without this, even the best pendulum would stop within hours!",
    dimension: 2,
    params: {
      gamma: 0.3,
      omega0: 1.5,
    },
    paramLabels: {
      gamma: "γ (damping coefficient)",
      omega0: "ω₀ (natural frequency)",
    },
    initial: { x0: Math.PI - 0.5, y0: 0, z0: 0 },
    simulation: { dt: 0.02, steps: 5000 },
  },
  rossler: {
    id: "rossler",
    name: "Rössler System",
    shortDescription: "Chaos in its simplest form",
    fullDescription:
      "The Rössler system was designed by Otto Rössler in 1976 as the simplest possible chaotic system. Unlike the Lorenz attractor which has two symmetric 'wings', the Rössler attractor has a single band that folds and stretches in a beautiful spiral pattern. It's easier to analyze mathematically but still exhibits rich chaotic behavior.",
    funFact:
      "Otto Rössler, a biochemist, created this system specifically to be the 'simplest' chaotic attractor. He was inspired by a taffy-pulling machine - the stretching and folding action is what creates chaos!",
    dimension: 3,
    params: {
      a: 0.2,
      b: 0.2,
      c: 5.7,
    },
    paramLabels: {
      a: "a",
      b: "b",
      c: "c",
    },
    initial: { x0: 1, y0: 1, z0: 1 },
    simulation: { dt: 0.02, steps: 10000 },
  },
};

export const equationList = Object.values(equations);
