import { Physics3DMode, PhysicsSimType } from '../types';

export interface CompiledModelSpec {
  title: string;
  equationLatex: string;
  lagrangianLatex: string;
  variablesSummary: string[];
  pythonCode: string;
  cppCode: string;
  sampleTable: { t: number; state1: number; state2: number; state1Label: string; state2Label: string }[];
}

export function compileSimToEquationsAndCode(
  simId: PhysicsSimType | Physics3DMode | string,
  params: Record<string, number>,
  titleHint?: string
): CompiledModelSpec {
  const g = params.gravity ?? params.g ?? 9.81;

  if (simId === 'spring_pendulum' || simId === 'spring_oscillation_horizontal' || simId === 'pendulum_spring') {
    const k = params.stiffness ?? params.k ?? 40;
    const m = params.mass ?? params.m ?? 1.0;
    const A = (params.amplitude ?? 10) / 100;
    const omega = Math.sqrt(k / Math.max(0.05, m));
    const table = [0, 0.25, 0.5, 0.75, 1.0, 1.25].map((t) => ({
      t,
      state1: A * Math.cos(omega * t),
      state2: -A * omega * Math.sin(omega * t),
      state1Label: 'x (m)',
      state2Label: 'v (m/s)'
    }));
    return {
      title: titleHint || 'Con lắc Lò xo Điều hòa (Harmonic Oscillator)',
      equationLatex: `m\\ddot{x} + kx = 0 \\;\\Longrightarrow\\; \\ddot{x} + \\frac{${k.toFixed(1)}}{${m.toFixed(2)}}x = 0,\\quad \\omega = ${omega.toFixed(3)}\\text{ rad/s}`,
      lagrangianLatex: `\\mathcal{L}(x,\\dot{x}) = \\frac{1}{2}m\\dot{x}^2 - \\frac{1}{2}kx^2`,
      variablesSummary: [
        `m = ${m.toFixed(2)} kg`,
        `k = ${k.toFixed(1)} N/m`,
        `x₀ = ${(A * 100).toFixed(1)} cm`,
        `ω = √(k/m) = ${omega.toFixed(3)} rad/s`,
        `T = 2π/ω = ${((2 * Math.PI) / omega).toFixed(3)} s`
      ],
      sampleTable: table,
      pythonCode: `import numpy as np

# Thông số lấy trực tiếp từ Synapse Physics Lab
m = ${m.toFixed(2)}      # kg
k = ${k.toFixed(2)}     # N/m
x0 = ${A.toFixed(4)}    # m (biên độ ban đầu)
v0 = 0.0

def deriv(state):
    x, v = state
    a = -(k / m) * x
    return np.array([v, a])

# Giải số Runge-Kutta bậc 4 (RK4)
dt = 0.01
state = np.array([x0, v0])
for step in range(200):
    t = step * dt
    k1 = deriv(state)
    k2 = deriv(state + 0.5 * dt * k1)
    k3 = deriv(state + 0.5 * dt * k2)
    k4 = deriv(state + dt * k3)
    state = state + (dt / 6.0) * (k1 + 2*k2 + 2*k3 + k4)
    if step % 25 == 0:
        print(f"t={t:.2f}s | x={state[0]:.4f}m | v={state[1]:.4f}m/s")`,
      cppCode: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double m = ${m.toFixed(2)}, k = ${k.toFixed(2)};
    double x = ${A.toFixed(4)}, v = 0.0, dt = 0.01;
    auto accel = [&](double pos) { return -(k / m) * pos; };
    for (int step = 0; step <= 200; ++step) {
        if (step % 25 == 0)
            cout << "t=" << step * dt << "s | x=" << x << "m | v=" << v << "m/s\\n";
        double k1x = v, k1v = accel(x);
        double k2x = v + 0.5*dt*k1v, k2v = accel(x + 0.5*dt*k1x);
        double k3x = v + 0.5*dt*k2v, k3v = accel(x + 0.5*dt*k2x);
        double k4x = v + dt*k3v,     k4v = accel(x + dt*k3x);
        x += (dt / 6.0) * (k1x + 2*k2x + 2*k3x + k4x);
        v += (dt / 6.0) * (k1v + 2*k2v + 2*k3v + k4v);
    }
    return 0;
}`
    };
  }

  if (simId === 'simple_pendulum' || simId === 'simple_pendulum_3d') {
    const L = params.length ?? 1.5;
    const alphaDeg = params.angle0 ?? 14;
    const alpha0 = (alphaDeg * Math.PI) / 180;
    const omega = Math.sqrt(g / Math.max(0.1, L));
    const table = [0, 0.3, 0.6, 0.9, 1.2, 1.5].map((t) => ({
      t,
      state1: alphaDeg * Math.cos(omega * t),
      state2: -alpha0 * omega * Math.sin(omega * t),
      state1Label: 'θ (°)',
      state2Label: 'ω (rad/s)'
    }));
    return {
      title: titleHint || 'Con lắc Đơn Phi tuyến (Nonlinear Pendulum ODE)',
      equationLatex: `\\ddot{\\theta} + \\frac{g}{l}\\sin\\theta = 0 \\;\\Longrightarrow\\; \\ddot{\\theta} + \\frac{${g.toFixed(2)}}{${L.toFixed(2)}}\\sin\\theta = 0`,
      lagrangianLatex: `\\mathcal{L}(\\theta,\\dot{\\theta}) = \\frac{1}{2}ml^2\\dot{\\theta}^2 - mgl(1 - \\cos\\theta)`,
      variablesSummary: [
        `l = ${L.toFixed(2)} m`,
        `g = ${g.toFixed(2)} m/s²`,
        `α₀ = ${alphaDeg}°`,
        `T ≈ 2π√(l/g) = ${(2 * Math.PI / omega).toFixed(3)} s`
      ],
      sampleTable: table,
      pythonCode: `import math

g = ${g.toFixed(2)}
L = ${L.toFixed(2)}
theta = math.radians(${alphaDeg})
omega = 0.0
dt = 0.01

for step in range(250):
    if step % 30 == 0:
        print(f"t={step*dt:.2f}s | theta={math.degrees(theta):.2f} deg | omega={omega:.3f} rad/s")
    a = -(g / L) * math.sin(theta)
    omega += a * dt
    theta += omega * dt`,
      cppCode: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double g = ${g.toFixed(2)}, L = ${L.toFixed(2)};
    double theta = ${alpha0.toFixed(5)}, omega = 0.0, dt = 0.01;
    for (int s = 0; s <= 250; ++s) {
        if (s % 30 == 0) cout << "t=" << s*dt << "s | theta=" << theta*180/M_PI << " deg\\n";
        double a = -(g / L) * sin(theta);
        omega += a * dt;
        theta += omega * dt;
    }
}`
    };
  }

  if (simId === 'projectile_motion' || simId === 'projectile_3d' || simId === 'free_fall_energy') {
    const v0 = params.v0 ?? 24;
    const angle = params.angle ?? 45;
    const rad = (angle * Math.PI) / 180;
    const vx0 = v0 * Math.cos(rad);
    const vy0 = v0 * Math.sin(rad);
    const table = [0, 0.5, 1.0, 1.5, 2.0, 2.5].map((t) => ({
      t,
      state1: vx0 * t,
      state2: Math.max(0, vy0 * t - 0.5 * g * t * t),
      state1Label: 'x (m)',
      state2Label: 'y (m)'
    }));
    return {
      title: titleHint || 'Bài toán Ném xiên 2D/3D trong Trọng trường',
      equationLatex: `\\ddot{x} = 0,\\quad \\ddot{y} = -g = -${g.toFixed(2)}\\text{ m/s}^2`,
      lagrangianLatex: `y(x) = x\\tan\\alpha - \\frac{g}{2v_0^2\\cos^2\\alpha}x^2`,
      variablesSummary: [
        `v₀ = ${v0} m/s`,
        `α = ${angle}°`,
        `g = ${g.toFixed(2)} m/s²`,
        `L_max = ${((v0 * v0 * Math.sin(2 * rad)) / g).toFixed(2)} m`
      ],
      sampleTable: table,
      pythonCode: `import math

v0 = ${v0}
alpha = math.radians(${angle})
g = ${g.toFixed(2)}
vx, vy = v0 * math.cos(alpha), v0 * math.sin(alpha)
x, y, dt = 0.0, 0.0, 0.02

t = 0.0
while y >= 0:
    print(f"t={t:.2f}s | x={x:.2f}m | y={y:.2f}m")
    x += vx * dt
    y += vy * dt - 0.5 * g * dt * dt
    vy -= g * dt
    t += dt`,
      cppCode: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
    double v0 = ${v0}, alpha = ${rad.toFixed(5)}, g = ${g.toFixed(2)};
    double vx = v0 * cos(alpha), vy = v0 * sin(alpha), x = 0, y = 0, dt = 0.02;
    for (double t = 0; y >= 0; t += dt) {
        cout << "t=" << t << "s | x=" << x << " | y=" << y << "\\n";
        x += vx * dt;
        y += vy * dt - 0.5 * g * dt * dt;
        vy -= g * dt;
    }
}`
    };
  }

  // Generic Parametric Differential / Algebraic Physical Solver for any of the 107 sims
  const entries = Object.entries(params).slice(0, 6);
  const pyVars =
    entries.length > 0
      ? entries.map(([k, v]) => `${k} = ${Number(v).toFixed(3)}`).join('\n')
      : 'alpha = 1.0\nbeta = 9.81';
  const cppVars =
    entries.length > 0
      ? entries.map(([k, v]) => `    double ${k} = ${Number(v).toFixed(3)};`).join('\n')
      : '    double alpha = 1.0, beta = 9.81;';
  const k0 = entries[0]?.[1] ?? 2.0;
  const k1 = entries[1]?.[1] ?? 1.0;

  return {
    title: titleHint || `Mô hình Động lực học (${simId})`,
    equationLatex: `\\frac{d^2\\psi}{dt^2} + \\gamma\\frac{d\\psi}{dt} + \\omega_0^2 \\psi = F_{\\text{ext}}(t)`,
    lagrangianLatex: `\\frac{d}{dt}\\left(\\frac{\\partial \\mathcal{L}}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial \\mathcal{L}}{\\partial q_i} = Q_i`,
    variablesSummary: entries.map(([k, v]) => `${k} = ${Number(v).toFixed(2)}`),
    sampleTable: [0, 0.2, 0.4, 0.6, 0.8, 1.0].map((t) => ({
      t,
      state1: Math.cos(Math.max(0.5, k0) * t) * Math.exp(-0.08 * t),
      state2: Math.sin(Math.max(0.5, k1) * t),
      state1Label: 'q(t)',
      state2Label: 'dq/dt'
    })),
    pythonCode: `import numpy as np

# Trạng thái thông số xuất từ Synapse Sim: ${simId}
${pyVars}

def step_rk4(y, f, dt):
    k1 = f(y)
    k2 = f(y + 0.5 * dt * k1)
    k3 = f(y + 0.5 * dt * k2)
    k4 = f(y + dt * k3)
    return y + (dt / 6.0) * (k1 + 2*k2 + 2*k3 + k4)

# Tích phân theo thời gian
state = np.array([1.0, 0.0])
omega = max(0.5, abs(${k0.toFixed(2)}))
for i in range(60):
    state = step_rk4(state, lambda s: np.array([s[1], -omega*s[0] - 0.1*s[1]]), 0.05)
    if i % 10 == 0:
        print(f"t={i*0.05:.2f}s | q={state[0]:.4f} | dq={state[1]:.4f}")`,
    cppCode: `#include <iostream>
#include <cmath>
using namespace std;

int main() {
${cppVars}
    double q = 1.0, dq = 0.0, dt = 0.05;
    double w = max(0.5, abs(${k0.toFixed(2)}));
    for (int i = 0; i <= 60; ++i) {
        if (i % 10 == 0) cout << "t=" << i*dt << "s | q=" << q << " | dq=" << dq << "\\n";
        double ddq = -w * q - 0.1 * dq;
        dq += ddq * dt;
        q += dq * dt;
    }
}`
  };
}
