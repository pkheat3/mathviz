import * as THREE from "three";

// 4th-order Runge-Kutta integrator

type DerivativeFn2D = (t: number, state: [number, number]) => [number, number];
type DerivativeFn3D = (t: number, state: [number, number, number]) => [number, number, number];

function rk4Step2D(
  f: DerivativeFn2D,
  t: number,
  y: [number, number],
  dt: number
): [number, number] {
  const k1 = f(t, y);
  const k2 = f(t + dt / 2, [y[0] + k1[0] * dt / 2, y[1] + k1[1] * dt / 2]);
  const k3 = f(t + dt / 2, [y[0] + k2[0] * dt / 2, y[1] + k2[1] * dt / 2]);
  const k4 = f(t + dt, [y[0] + k3[0] * dt, y[1] + k3[1] * dt]);

  return [
    y[0] + (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) * dt / 6,
    y[1] + (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) * dt / 6,
  ];
}

function rk4Step3D(
  f: DerivativeFn3D,
  t: number,
  y: [number, number, number],
  dt: number
): [number, number, number] {
  const k1 = f(t, y);
  const k2 = f(t + dt / 2, [
    y[0] + k1[0] * dt / 2,
    y[1] + k1[1] * dt / 2,
    y[2] + k1[2] * dt / 2,
  ]);
  const k3 = f(t + dt / 2, [
    y[0] + k2[0] * dt / 2,
    y[1] + k2[1] * dt / 2,
    y[2] + k2[2] * dt / 2,
  ]);
  const k4 = f(t + dt, [
    y[0] + k3[0] * dt,
    y[1] + k3[1] * dt,
    y[2] + k3[2] * dt,
  ]);

  return [
    y[0] + (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) * dt / 6,
    y[1] + (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) * dt / 6,
    y[2] + (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]) * dt / 6,
  ];
}

// Lorenz attractor
// dx/dt = σ(y - x)
// dy/dt = x(ρ - z) - y
// dz/dt = xy - βz
function lorenzDerivative(
  sigma: number,
  rho: number,
  beta: number
): DerivativeFn3D {
  return (_t, [x, y, z]) => [
    sigma * (y - x),
    x * (rho - z) - y,
    x * y - beta * z,
  ];
}

// Van der Pol oscillator
// dx/dt = y
// dy/dt = μ(1 - x²)y - x
function vanDerPolDerivative(mu: number): DerivativeFn2D {
  return (_t, [x, y]) => [
    y,
    mu * (1 - x * x) * y - x,
  ];
}

// Damped pendulum
// dθ/dt = ω
// dω/dt = -γω - ω₀²sin(θ)
function dampedPendulumDerivative(gamma: number, omega0: number): DerivativeFn2D {
  return (_t, [theta, omega]) => [
    omega,
    -gamma * omega - omega0 * omega0 * Math.sin(theta),
  ];
}

// Rössler system
// dx/dt = -y - z
// dy/dt = x + ay
// dz/dt = b + z(x - c)
function rosslerDerivative(a: number, b: number, c: number): DerivativeFn3D {
  return (_t, [x, y, z]) => [
    -y - z,
    x + a * y,
    b + z * (x - c),
  ];
}

// Solver functions that return THREE.Vector3 arrays

export function solveLorenz(params: {
  sigma: number;
  rho: number;
  beta: number;
  x0: number;
  y0: number;
  z0: number;
  dt: number;
  steps: number;
}): THREE.Vector3[] {
  const { sigma, rho, beta, x0, y0, z0, dt, steps } = params;
  const f = lorenzDerivative(sigma, rho, beta);
  const points: THREE.Vector3[] = [];

  let state: [number, number, number] = [x0, y0, z0];
  let t = 0;

  points.push(new THREE.Vector3(state[0], state[1], state[2]));

  for (let i = 0; i < steps; i++) {
    state = rk4Step3D(f, t, state, dt);
    t += dt;
    points.push(new THREE.Vector3(state[0], state[1], state[2]));
  }

  return points;
}

export function solveVanDerPol(params: {
  mu: number;
  x0: number;
  y0: number;
  dt: number;
  steps: number;
}): THREE.Vector3[] {
  const { mu, x0, y0, dt, steps } = params;
  const f = vanDerPolDerivative(mu);
  const points: THREE.Vector3[] = [];

  let state: [number, number] = [x0, y0];
  let t = 0;

  points.push(new THREE.Vector3(state[0], state[1], 0));

  for (let i = 0; i < steps; i++) {
    state = rk4Step2D(f, t, state, dt);
    t += dt;
    points.push(new THREE.Vector3(state[0], state[1], 0));
  }

  return points;
}

export function solveDampedPendulum(params: {
  gamma: number;
  omega0: number;
  theta0: number;
  omegaInit: number;
  dt: number;
  steps: number;
}): THREE.Vector3[] {
  const { gamma, omega0, theta0, omegaInit, dt, steps } = params;
  const f = dampedPendulumDerivative(gamma, omega0);
  const points: THREE.Vector3[] = [];

  let state: [number, number] = [theta0, omegaInit];
  let t = 0;

  points.push(new THREE.Vector3(state[0], state[1], 0));

  for (let i = 0; i < steps; i++) {
    state = rk4Step2D(f, t, state, dt);
    t += dt;
    points.push(new THREE.Vector3(state[0], state[1], 0));
  }

  return points;
}

export function solveRossler(params: {
  a: number;
  b: number;
  c: number;
  x0: number;
  y0: number;
  z0: number;
  dt: number;
  steps: number;
}): THREE.Vector3[] {
  const { a, b, c, x0, y0, z0, dt, steps } = params;
  const f = rosslerDerivative(a, b, c);
  const points: THREE.Vector3[] = [];

  let state: [number, number, number] = [x0, y0, z0];
  let t = 0;

  points.push(new THREE.Vector3(state[0], state[1], state[2]));

  for (let i = 0; i < steps; i++) {
    state = rk4Step3D(f, t, state, dt);
    t += dt;
    points.push(new THREE.Vector3(state[0], state[1], state[2]));
  }

  return points;
}
