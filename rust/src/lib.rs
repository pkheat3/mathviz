mod ode;
mod systems;

use nalgebra::{Vector2, Vector3};
use wasm_bindgen::prelude::*;

use crate::ode::RK4Integrator;
use crate::systems::{DampedPendulum, Lorenz, Rossler, VanDerPol};

/// Solve the Lorenz system.
///
/// Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
#[wasm_bindgen]
pub fn solve_lorenz(
    sigma: f64,
    rho: f64,
    beta: f64,
    x0: f64,
    y0: f64,
    z0: f64,
    dt: f64,
    steps: usize,
) -> Vec<f64> {
    let lorenz = Lorenz::new(sigma, rho, beta);
    let integrator = RK4Integrator::<3>::new(dt);
    let initial = Vector3::new(x0, y0, z0);

    integrator.integrate(&|t, y| lorenz.derivative(t, y), initial, steps)
}

/// Solve the Van der Pol oscillator.
///
/// Returns a flat array of [x0, y0, x1, y1, ...] values.
/// For 3D visualization, z is set to 0.
#[wasm_bindgen]
pub fn solve_van_der_pol(
    mu: f64,
    x0: f64,
    y0: f64,
    dt: f64,
    steps: usize,
) -> Vec<f64> {
    let vdp = VanDerPol::new(mu);
    let integrator = RK4Integrator::<2>::new(dt);
    let initial = Vector2::new(x0, y0);

    integrator.integrate(&|t, y| vdp.derivative(t, y), initial, steps)
}

/// Solve the damped pendulum.
///
/// Returns a flat array of [θ0, ω0, θ1, ω1, ...] values.
#[wasm_bindgen]
pub fn solve_damped_pendulum(
    gamma: f64,
    omega0: f64,
    theta0: f64,
    omega_init: f64,
    dt: f64,
    steps: usize,
) -> Vec<f64> {
    let pendulum = DampedPendulum::new(gamma, omega0);
    let integrator = RK4Integrator::<2>::new(dt);
    let initial = Vector2::new(theta0, omega_init);

    integrator.integrate(&|t, y| pendulum.derivative(t, y), initial, steps)
}

/// Solve the Rössler system.
///
/// Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
#[wasm_bindgen]
pub fn solve_rossler(
    a: f64,
    b: f64,
    c: f64,
    x0: f64,
    y0: f64,
    z0: f64,
    dt: f64,
    steps: usize,
) -> Vec<f64> {
    let rossler = Rossler::new(a, b, c);
    let integrator = RK4Integrator::<3>::new(dt);
    let initial = Vector3::new(x0, y0, z0);

    integrator.integrate(&|t, y| rossler.derivative(t, y), initial, steps)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lorenz_solver() {
        let result = solve_lorenz(10.0, 28.0, 8.0 / 3.0, 1.0, 1.0, 1.0, 0.01, 100);
        // Should have 101 points * 3 coordinates = 303 values
        assert_eq!(result.len(), 303);
        // First point should be initial conditions
        assert_eq!(result[0], 1.0);
        assert_eq!(result[1], 1.0);
        assert_eq!(result[2], 1.0);
    }

    #[test]
    fn test_van_der_pol_solver() {
        let result = solve_van_der_pol(1.0, 2.0, 0.0, 0.01, 100);
        // Should have 101 points * 2 coordinates = 202 values
        assert_eq!(result.len(), 202);
        // First point should be initial conditions
        assert_eq!(result[0], 2.0);
        assert_eq!(result[1], 0.0);
    }

    #[test]
    fn test_damped_pendulum_solver() {
        let result = solve_damped_pendulum(0.5, 1.0, 1.0, 0.0, 0.01, 100);
        // Should have 101 points * 2 coordinates = 202 values
        assert_eq!(result.len(), 202);
    }

    #[test]
    fn test_rossler_solver() {
        let result = solve_rossler(0.2, 0.2, 5.7, 1.0, 1.0, 1.0, 0.01, 100);
        // Should have 101 points * 3 coordinates = 303 values
        assert_eq!(result.len(), 303);
    }
}
