# mathviz

A "Rust Core, React Shell" math visualization app featuring differential equation solvers with 3D phase space visualization. Rust/WebAssembly handles computation; Next.js + React Three Fiber handles rendering.

## Features

- **4 Dynamical Systems**: Lorenz Attractor, Van der Pol Oscillator, Damped Pendulum, Rössler System
- **High-Performance Computation**: Rust-based RK4 ODE solver compiled to WebAssembly
- **Interactive 3D Visualization**: React Three Fiber with orbit controls
- **Real-time Parameter Tuning**: Leva control panel for adjusting system parameters
- **Animated Trajectories**: Watch the system evolve in phase space

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **3D Rendering**: React Three Fiber, Three.js, drei
- **UI**: shadcn/ui, Tailwind CSS v4, Leva
- **Computation**: Rust, WebAssembly (wasm-bindgen)
- **Math**: nalgebra (Rust linear algebra library)

## Prerequisites

- Node.js 18+
- Rust toolchain (install via [rustup](https://rustup.rs/))
- wasm-pack (`cargo install wasm-pack`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the Rust/Wasm core

```bash
cd rust
wasm-pack build --target web --out-dir pkg
cd ..
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the visualization.

## Project Structure

```
mathviz/
├── src/                          # Next.js App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main visualization page
│   │   └── globals.css
│   ├── components/
│   │   ├── Scene.tsx             # R3F canvas wrapper
│   │   ├── PhaseSpace.tsx        # 3D trajectory visualization
│   │   ├── EquationSelector.tsx  # Preset equation picker
│   │   └── Controls.tsx          # Leva panel wrapper
│   └── lib/
│       ├── wasm.ts               # Wasm loader & bindings
│       └── equations.ts          # Equation presets config
├── rust/                         # Rust Math Core
│   ├── src/
│   │   ├── lib.rs                # Wasm entry point, exports
│   │   ├── ode.rs                # RK4 integrator
│   │   └── systems.rs            # Lorenz, Van der Pol, etc.
│   ├── Cargo.toml
│   └── pkg/                      # wasm-pack output (generated)
└── ...
```

## Supported Systems

| System | Dimension | Parameters |
|--------|-----------|------------|
| Lorenz Attractor | 3D | σ (sigma), ρ (rho), β (beta) |
| Van der Pol Oscillator | 2D | μ (mu) |
| Damped Pendulum | 2D | γ (gamma), ω₀ (omega0) |
| Rössler System | 3D | a, b, c |

## Development

### Run Rust tests

```bash
cd rust
cargo test
```

### Rebuild Wasm after Rust changes

```bash
cd rust
wasm-pack build --target web --out-dir pkg
```

### Build for production

```bash
npm run build
```

## License

MIT
