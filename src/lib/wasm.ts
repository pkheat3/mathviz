import * as THREE from "three";

// We'll store the initialized module here
let wasmModule: typeof import("../../rust/pkg/mathviz_core") | null = null;
let initPromise: Promise<typeof import("../../rust/pkg/mathviz_core")> | null = null;

export async function initWasm() {
  if (wasmModule) {
    return wasmModule;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const wasm = await import("../../rust/pkg/mathviz_core");
    // Call the default export to initialize the wasm module
    await wasm.default();
    wasmModule = wasm;
    return wasm;
  })();

  return initPromise;
}

// Convert flat Float64Array to THREE.Vector3 array for 3D systems
export function toVector3Array(data: Float64Array, dim: 3): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < data.length; i += dim) {
    points.push(new THREE.Vector3(data[i], data[i + 1], data[i + 2]));
  }
  return points;
}

// Convert flat Float64Array to THREE.Vector3 array for 2D systems (z=0)
export function toVector3Array2D(data: Float64Array): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < data.length; i += 2) {
    points.push(new THREE.Vector3(data[i], data[i + 1], 0));
  }
  return points;
}

// High-level solver functions
export async function solveLorenz(params: {
  sigma: number;
  rho: number;
  beta: number;
  x0: number;
  y0: number;
  z0: number;
  dt: number;
  steps: number;
}): Promise<THREE.Vector3[]> {
  const wasm = await initWasm();
  const data = wasm.solve_lorenz(
    params.sigma,
    params.rho,
    params.beta,
    params.x0,
    params.y0,
    params.z0,
    params.dt,
    params.steps
  );
  return toVector3Array(data, 3);
}

export async function solveVanDerPol(params: {
  mu: number;
  x0: number;
  y0: number;
  dt: number;
  steps: number;
}): Promise<THREE.Vector3[]> {
  const wasm = await initWasm();
  const data = wasm.solve_van_der_pol(
    params.mu,
    params.x0,
    params.y0,
    params.dt,
    params.steps
  );
  return toVector3Array2D(data);
}

export async function solveDampedPendulum(params: {
  gamma: number;
  omega0: number;
  theta0: number;
  omegaInit: number;
  dt: number;
  steps: number;
}): Promise<THREE.Vector3[]> {
  const wasm = await initWasm();
  const data = wasm.solve_damped_pendulum(
    params.gamma,
    params.omega0,
    params.theta0,
    params.omegaInit,
    params.dt,
    params.steps
  );
  return toVector3Array2D(data);
}

export async function solveRossler(params: {
  a: number;
  b: number;
  c: number;
  x0: number;
  y0: number;
  z0: number;
  dt: number;
  steps: number;
}): Promise<THREE.Vector3[]> {
  const wasm = await initWasm();
  const data = wasm.solve_rossler(
    params.a,
    params.b,
    params.c,
    params.x0,
    params.y0,
    params.z0,
    params.dt,
    params.steps
  );
  return toVector3Array(data, 3);
}
