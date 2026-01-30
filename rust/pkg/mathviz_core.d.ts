/* tslint:disable */
/* eslint-disable */

/**
 * Solve the damped pendulum.
 *
 * Returns a flat array of [θ0, ω0, θ1, ω1, ...] values.
 */
export function solve_damped_pendulum(gamma: number, omega0: number, theta0: number, omega_init: number, dt: number, steps: number): Float64Array;

/**
 * Solve the Lorenz system.
 *
 * Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
 */
export function solve_lorenz(sigma: number, rho: number, beta: number, x0: number, y0: number, z0: number, dt: number, steps: number): Float64Array;

/**
 * Solve the Rössler system.
 *
 * Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
 */
export function solve_rossler(a: number, b: number, c: number, x0: number, y0: number, z0: number, dt: number, steps: number): Float64Array;

/**
 * Solve the Van der Pol oscillator.
 *
 * Returns a flat array of [x0, y0, x1, y1, ...] values.
 * For 3D visualization, z is set to 0.
 */
export function solve_van_der_pol(mu: number, x0: number, y0: number, dt: number, steps: number): Float64Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly solve_damped_pendulum: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly solve_lorenz: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
    readonly solve_rossler: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
    readonly solve_van_der_pol: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
