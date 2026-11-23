/**
 * Adaptive 1€ Filter (One Euro Filter — Casiez, Roussel, Vogel 2012)
 * Smooths hand tremor heavily when velocity is near zero (high stillness stability)
 * while raising cutoff dynamically during fast hand motion to minimize lag.
 */

export class OneEuroFilter {
  private minCutoff: number;
  private beta: number;
  private dCutoff: number;

  private xPrev: number | null = null;
  private dxPrev = 0;
  private tPrev: number | null = null;

  constructor(minCutoff = 1.6, beta = 0.05, dCutoff = 1.0) {
    this.minCutoff = minCutoff;
    this.beta = beta;
    this.dCutoff = dCutoff;
  }

  public setParams(minCutoff: number, beta: number, dCutoff = 1.0): void {
    this.minCutoff = Math.max(0.05, minCutoff);
    this.beta = Math.max(0, beta);
    this.dCutoff = Math.max(0.05, dCutoff);
  }

  public reset(initialValue?: number, timestampSec?: number): void {
    if (typeof initialValue === 'number' && Number.isFinite(initialValue)) {
      this.xPrev = initialValue;
      this.dxPrev = 0;
      this.tPrev = typeof timestampSec === 'number' ? timestampSec : null;
    } else {
      this.xPrev = null;
      this.dxPrev = 0;
      this.tPrev = null;
    }
  }

  private alpha(cutoffHz: number, dtSec: number): number {
    const tau = 1.0 / (2.0 * Math.PI * Math.max(0.01, cutoffHz));
    return 1.0 / (1.0 + tau / Math.max(1e-4, dtSec));
  }

  public filter(x: number, timestampSec: number): number {
    if (!Number.isFinite(x)) {
      return this.xPrev ?? 0;
    }
    if (this.xPrev === null || this.tPrev === null) {
      this.xPrev = x;
      this.dxPrev = 0;
      this.tPrev = timestampSec;
      return x;
    }

    const rawDt = timestampSec - this.tPrev;
    const dt = rawDt > 1e-4 ? Math.min(0.25, rawDt) : 1 / 60;
    this.tPrev = timestampSec;

    const dx = (x - this.xPrev) / dt;
    const aD = this.alpha(this.dCutoff, dt);
    const edx = aD * dx + (1 - aD) * this.dxPrev;
    this.dxPrev = edx;

    const cutoff = this.minCutoff + this.beta * Math.abs(edx);
    const aX = this.alpha(cutoff, dt);
    const filtered = aX * x + (1 - aX) * this.xPrev;
    this.xPrev = filtered;
    return filtered;
  }

  public getLast(): number | null {
    return this.xPrev;
  }
}

export class OneEuroFilter3D {
  private readonly fx: OneEuroFilter;
  private readonly fy: OneEuroFilter;
  private readonly fz: OneEuroFilter;

  constructor(minCutoff = 1.8, beta = 0.055, dCutoff = 1.0) {
    this.fx = new OneEuroFilter(minCutoff, beta, dCutoff);
    this.fy = new OneEuroFilter(minCutoff, beta, dCutoff);
    this.fz = new OneEuroFilter(minCutoff, beta, dCutoff);
  }

  public setParams(minCutoff: number, beta: number, dCutoff = 1.0): void {
    this.fx.setParams(minCutoff, beta, dCutoff);
    this.fy.setParams(minCutoff, beta, dCutoff);
    this.fz.setParams(minCutoff, beta, dCutoff);
  }

  public reset(): void {
    this.fx.reset();
    this.fy.reset();
    this.fz.reset();
  }

  public filter(
    x: number,
    y: number,
    z: number,
    timestampSec: number
  ): { x: number; y: number; z: number } {
    return {
      x: this.fx.filter(x, timestampSec),
      y: this.fy.filter(y, timestampSec),
      z: this.fz.filter(z, timestampSec)
    };
  }
}

export function smoothingToOneEuroParams(smoothing: number): {
  minCutoff: number;
  beta: number;
  dCutoff: number;
} {
  const s = Math.max(0.05, Math.min(0.95, smoothing));
  // Lower smoothing => crisper tracking; higher smoothing => ultra-steady idle pose
  const minCutoff = 0.75 + (1 - s) * 2.25;
  const beta = 0.03 + (1 - s) * 0.095;
  return { minCutoff, beta, dCutoff: 1.0 };
}
