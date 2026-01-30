use nalgebra::SVector;

/// 4th-order Runge-Kutta integrator for ODE systems.
///
/// Generic over the system dimension N.
pub struct RK4Integrator<const N: usize> {
    pub dt: f64,
}

impl<const N: usize> RK4Integrator<N> {
    pub fn new(dt: f64) -> Self {
        Self { dt }
    }

    /// Perform a single RK4 step.
    ///
    /// `f` is the system of ODEs: dy/dt = f(t, y)
    pub fn step<F>(&self, f: &F, t: f64, y: &SVector<f64, N>) -> SVector<f64, N>
    where
        F: Fn(f64, &SVector<f64, N>) -> SVector<f64, N>,
    {
        let dt = self.dt;
        let k1 = f(t, y);
        let k2 = f(t + dt / 2.0, &(y + k1 * (dt / 2.0)));
        let k3 = f(t + dt / 2.0, &(y + k2 * (dt / 2.0)));
        let k4 = f(t + dt, &(y + k3 * dt));

        y + (k1 + k2 * 2.0 + k3 * 2.0 + k4) * (dt / 6.0)
    }

    /// Integrate the system for a given number of steps.
    ///
    /// Returns all intermediate states as a flat Vec<f64>.
    pub fn integrate<F>(&self, f: &F, mut y0: SVector<f64, N>, steps: usize) -> Vec<f64>
    where
        F: Fn(f64, &SVector<f64, N>) -> SVector<f64, N>,
    {
        let mut result = Vec::with_capacity((steps + 1) * N);
        let mut t = 0.0;

        // Store initial state
        for i in 0..N {
            result.push(y0[i]);
        }

        // Integrate
        for _ in 0..steps {
            y0 = self.step(f, t, &y0);
            t += self.dt;
            for i in 0..N {
                result.push(y0[i]);
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use nalgebra::Vector1;

    #[test]
    fn test_exponential_decay() {
        // dy/dt = -y, y(0) = 1
        // Solution: y(t) = e^(-t)
        let integrator = RK4Integrator::<1>::new(0.01);
        let f = |_t: f64, y: &Vector1<f64>| Vector1::new(-y[0]);
        let y0 = Vector1::new(1.0);

        let result = integrator.integrate(&f, y0, 100);

        // At t=1, y should be approximately e^(-1) ≈ 0.3679
        let y_at_1 = result[100]; // Index 100 corresponds to step 100
        let expected = (-1.0_f64).exp();

        assert!((y_at_1 - expected).abs() < 1e-6,
            "Expected {}, got {}", expected, y_at_1);
    }

    #[test]
    fn test_simple_harmonic_oscillator() {
        // dx/dt = v, dv/dt = -x
        // Solution: x(t) = cos(t), v(t) = -sin(t) for x(0)=1, v(0)=0
        let integrator = RK4Integrator::<2>::new(0.01);
        let f = |_t: f64, y: &nalgebra::Vector2<f64>| {
            nalgebra::Vector2::new(y[1], -y[0])
        };
        let y0 = nalgebra::Vector2::new(1.0, 0.0);

        let result = integrator.integrate(&f, y0, 628); // ~2π steps

        // At t ≈ 2π, should be back near (1, 0)
        let x_final = result[628 * 2];
        let v_final = result[628 * 2 + 1];

        assert!((x_final - 1.0).abs() < 0.01,
            "Expected x ≈ 1, got {}", x_final);
        assert!(v_final.abs() < 0.01,
            "Expected v ≈ 0, got {}", v_final);
    }
}
