use nalgebra::{Vector2, Vector3};

/// Lorenz attractor system.
///
/// dx/dt = σ(y - x)
/// dy/dt = x(ρ - z) - y
/// dz/dt = xy - βz
///
/// Classic parameters: σ=10, ρ=28, β=8/3
pub struct Lorenz {
    pub sigma: f64,
    pub rho: f64,
    pub beta: f64,
}

impl Lorenz {
    pub fn new(sigma: f64, rho: f64, beta: f64) -> Self {
        Self { sigma, rho, beta }
    }

    pub fn derivative(&self, _t: f64, state: &Vector3<f64>) -> Vector3<f64> {
        let x = state[0];
        let y = state[1];
        let z = state[2];

        Vector3::new(
            self.sigma * (y - x),
            x * (self.rho - z) - y,
            x * y - self.beta * z,
        )
    }
}

/// Van der Pol oscillator.
///
/// dx/dt = y
/// dy/dt = μ(1 - x²)y - x
///
/// Classic parameter: μ = 1 to 3
pub struct VanDerPol {
    pub mu: f64,
}

impl VanDerPol {
    pub fn new(mu: f64) -> Self {
        Self { mu }
    }

    pub fn derivative(&self, _t: f64, state: &Vector2<f64>) -> Vector2<f64> {
        let x = state[0];
        let y = state[1];

        Vector2::new(y, self.mu * (1.0 - x * x) * y - x)
    }
}

/// Damped pendulum.
///
/// dθ/dt = ω
/// dω/dt = -γω - ω₀²sin(θ)
///
/// γ = damping coefficient, ω₀ = natural frequency
pub struct DampedPendulum {
    pub gamma: f64,
    pub omega0: f64,
}

impl DampedPendulum {
    pub fn new(gamma: f64, omega0: f64) -> Self {
        Self { gamma, omega0 }
    }

    pub fn derivative(&self, _t: f64, state: &Vector2<f64>) -> Vector2<f64> {
        let theta = state[0];
        let omega = state[1];

        Vector2::new(
            omega,
            -self.gamma * omega - self.omega0 * self.omega0 * theta.sin(),
        )
    }
}

/// Rössler system.
///
/// dx/dt = -y - z
/// dy/dt = x + ay
/// dz/dt = b + z(x - c)
///
/// Classic parameters: a=0.2, b=0.2, c=5.7
pub struct Rossler {
    pub a: f64,
    pub b: f64,
    pub c: f64,
}

impl Rossler {
    pub fn new(a: f64, b: f64, c: f64) -> Self {
        Self { a, b, c }
    }

    pub fn derivative(&self, _t: f64, state: &Vector3<f64>) -> Vector3<f64> {
        let x = state[0];
        let y = state[1];
        let z = state[2];

        Vector3::new(-y - z, x + self.a * y, self.b + z * (x - self.c))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lorenz_derivative() {
        let lorenz = Lorenz::new(10.0, 28.0, 8.0 / 3.0);
        let state = Vector3::new(1.0, 1.0, 1.0);
        let deriv = lorenz.derivative(0.0, &state);

        // dx/dt = 10*(1-1) = 0
        // dy/dt = 1*(28-1) - 1 = 26
        // dz/dt = 1*1 - 8/3*1 = -5/3
        assert!((deriv[0] - 0.0).abs() < 1e-10);
        assert!((deriv[1] - 26.0).abs() < 1e-10);
        assert!((deriv[2] - (1.0 - 8.0 / 3.0)).abs() < 1e-10);
    }

    #[test]
    fn test_van_der_pol_derivative() {
        let vdp = VanDerPol::new(1.0);
        let state = Vector2::new(0.0, 1.0);
        let deriv = vdp.derivative(0.0, &state);

        // dx/dt = 1
        // dy/dt = 1*(1-0)*1 - 0 = 1
        assert!((deriv[0] - 1.0).abs() < 1e-10);
        assert!((deriv[1] - 1.0).abs() < 1e-10);
    }

    #[test]
    fn test_damped_pendulum_derivative() {
        let pendulum = DampedPendulum::new(0.5, 1.0);
        let state = Vector2::new(0.0, 1.0);
        let deriv = pendulum.derivative(0.0, &state);

        // dθ/dt = 1
        // dω/dt = -0.5*1 - 1*sin(0) = -0.5
        assert!((deriv[0] - 1.0).abs() < 1e-10);
        assert!((deriv[1] - (-0.5)).abs() < 1e-10);
    }

    #[test]
    fn test_rossler_derivative() {
        let rossler = Rossler::new(0.2, 0.2, 5.7);
        let state = Vector3::new(1.0, 1.0, 1.0);
        let deriv = rossler.derivative(0.0, &state);

        // dx/dt = -1 - 1 = -2
        // dy/dt = 1 + 0.2*1 = 1.2
        // dz/dt = 0.2 + 1*(1-5.7) = 0.2 - 4.7 = -4.5
        assert!((deriv[0] - (-2.0)).abs() < 1e-10);
        assert!((deriv[1] - 1.2).abs() < 1e-10);
        assert!((deriv[2] - (-4.5)).abs() < 1e-10);
    }
}
