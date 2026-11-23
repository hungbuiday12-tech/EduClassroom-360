export interface KeplerianElements {
  id: string;
  nameVi: string;
  nameEn: string;
  colorHex: number;
  emissiveHex: number;
  radiusScene: number;
  orbitalPeriodDays: number;
  axialTiltDeg: number;
  hasRings?: boolean;
  hasMoon?: boolean;
  // J2000 elements + rates per Julian century (NASA/JPL Standish Table 2a, 1800-2100)
  a0: number;
  da: number;
  e0: number;
  de: number;
  i0: number;
  di: number;
  l0: number;
  dl: number;
  wBar0: number;
  dwBar: number;
  node0: number;
  dNode: number;
}

export const SOLAR_PLANETS: KeplerianElements[] = [
  {
    id: 'mercury',
    nameVi: 'Sao Thủy (Mercury)',
    nameEn: 'Mercury',
    colorHex: 0xa8a29e,
    emissiveHex: 0x292524,
    radiusScene: 0.24,
    orbitalPeriodDays: 87.97,
    axialTiltDeg: 0.03,
    a0: 0.38709927,
    da: 0.00000037,
    e0: 0.20563593,
    de: 0.00001906,
    i0: 7.00497902,
    di: -0.00594749,
    l0: 252.2503235,
    dl: 149472.67411175,
    wBar0: 77.45779628,
    dwBar: 0.16047689,
    node0: 48.33076593,
    dNode: -0.12534081,
  },
  {
    id: 'venus',
    nameVi: 'Sao Kim (Venus)',
    nameEn: 'Venus',
    colorHex: 0xfcd34d,
    emissiveHex: 0x78350f,
    radiusScene: 0.42,
    orbitalPeriodDays: 224.7,
    axialTiltDeg: 177.4,
    a0: 0.72333566,
    da: 0.0000039,
    e0: 0.00677672,
    de: -0.00004107,
    i0: 3.39467605,
    di: -0.0007889,
    l0: 181.9790995,
    dl: 58517.81538729,
    wBar0: 131.60246718,
    dwBar: 0.00268329,
    node0: 76.67984255,
    dNode: -0.27769418,
  },
  {
    id: 'earth',
    nameVi: 'Trái Đất (Earth)',
    nameEn: 'Earth',
    colorHex: 0x38bdf8,
    emissiveHex: 0x0c4a6e,
    radiusScene: 0.46,
    orbitalPeriodDays: 365.256,
    axialTiltDeg: 23.44,
    hasMoon: true,
    a0: 1.00000261,
    da: 0.00000562,
    e0: 0.01671123,
    de: -0.00004392,
    i0: -0.00001531,
    di: -0.01294668,
    l0: 100.46457166,
    dl: 35999.37244981,
    wBar0: 102.93768193,
    dwBar: 0.32327364,
    node0: 0.0,
    dNode: 0.0,
  },
  {
    id: 'mars',
    nameVi: 'Sao Hỏa (Mars)',
    nameEn: 'Mars',
    colorHex: 0xf97316,
    emissiveHex: 0x7c2d12,
    radiusScene: 0.34,
    orbitalPeriodDays: 686.98,
    axialTiltDeg: 25.19,
    a0: 1.52371034,
    da: 0.00001847,
    e0: 0.0933941,
    de: 0.00007882,
    i0: 1.84969142,
    di: -0.00813131,
    l0: -4.55343205,
    dl: 19140.30268499,
    wBar0: -23.94362959,
    dwBar: 0.44441088,
    node0: 49.55953891,
    dNode: -0.29257343,
  },
  {
    id: 'jupiter',
    nameVi: 'Sao Mộc (Jupiter)',
    nameEn: 'Jupiter',
    colorHex: 0xfdba74,
    emissiveHex: 0x451a03,
    radiusScene: 1.05,
    orbitalPeriodDays: 4332.59,
    axialTiltDeg: 3.13,
    a0: 5.202887,
    da: -0.00011607,
    e0: 0.04838624,
    de: -0.00013253,
    i0: 1.30439695,
    di: -0.00183714,
    l0: 34.39644051,
    dl: 3034.74612775,
    wBar0: 14.72847983,
    dwBar: 0.21252668,
    node0: 100.47390909,
    dNode: 0.20469106,
  },
  {
    id: 'saturn',
    nameVi: 'Sao Thổ (Saturn)',
    nameEn: 'Saturn',
    colorHex: 0xfde68a,
    emissiveHex: 0x422006,
    radiusScene: 0.88,
    orbitalPeriodDays: 10759.22,
    axialTiltDeg: 26.73,
    hasRings: true,
    a0: 9.53667594,
    da: -0.0012506,
    e0: 0.05386179,
    de: -0.00050991,
    i0: 2.48599187,
    di: 0.00193609,
    l0: 49.95424423,
    dl: 1222.49362201,
    wBar0: 92.59887831,
    dwBar: -0.41897216,
    node0: 113.66242448,
    dNode: -0.28867794,
  },
  {
    id: 'uranus',
    nameVi: 'Sao Thiên Vương (Uranus)',
    nameEn: 'Uranus',
    colorHex: 0x67e8f9,
    emissiveHex: 0x083344,
    radiusScene: 0.64,
    orbitalPeriodDays: 30688.5,
    axialTiltDeg: 97.77,
    a0: 19.18916464,
    da: -0.00196176,
    e0: 0.04725744,
    de: -0.00004397,
    i0: 0.77263783,
    di: -0.00242939,
    l0: 313.23810451,
    dl: 428.48202785,
    wBar0: 170.9542763,
    dwBar: 0.40805281,
    node0: 74.01692503,
    dNode: 0.04240589,
  },
  {
    id: 'neptune',
    nameVi: 'Sao Hải Vương (Neptune)',
    nameEn: 'Neptune',
    colorHex: 0x60a5fa,
    emissiveHex: 0x172554,
    radiusScene: 0.62,
    orbitalPeriodDays: 60182,
    axialTiltDeg: 28.32,
    a0: 30.06992276,
    da: 0.00026291,
    e0: 0.00859048,
    de: 0.00005105,
    i0: 1.77004347,
    di: 0.00035372,
    l0: -55.12002969,
    dl: 218.45945325,
    wBar0: 44.96476227,
    dwBar: -0.32241464,
    node0: 131.78422574,
    dNode: -0.00508664,
  },
];

const DEG2RAD = Math.PI / 180;
const AU_PER_LIGHT_MIN = 0.120238; // c * 60s / 1 AU

/** Convert decimal year (1800..2100) to Julian centuries since J2000.0 */
export function yearToJulianCenturies(year: number): number {
  const jd = 2451545.0 + (year - 2000.0) * 365.25;
  return (jd - 2451545.0) / 36525.0;
}

/** Map heliocentric AU radius nonlinearly onto readable 3D workshop coordinates */
export function auToSceneDistance(au: number): number {
  return 3.4 + Math.pow(au, 0.66) * 5.2;
}

export interface PlanetEphemerisPoint {
  auX: number;
  auY: number;
  auZ: number;
  sceneX: number;
  sceneY: number;
  sceneZ: number;
  heliocentricAU: number;
  orbitalSpeedKmS: number;
}

export function computePlanetPosition(
  el: KeplerianElements,
  julianCenturies: number
): PlanetEphemerisPoint {
  const T = julianCenturies;
  const a = el.a0 + el.da * T;
  const e = el.e0 + el.de * T;
  const inc = (el.i0 + el.di * T) * DEG2RAD;
  const L = el.l0 + el.dl * T;
  const wBar = el.wBar0 + el.dwBar * T;
  const node = (el.node0 + el.dNode * T) * DEG2RAD;
  const omega = (wBar - el.node0 - el.dNode * T) * DEG2RAD;

  let M = (L - wBar) % 360;
  if (M > 180) M -= 360;
  if (M < -180) M += 360;
  const Mrad = M * DEG2RAD;

  // Solve Kepler's Equation M = E - e sin(E) via Newton-Raphson
  let E = Mrad + e * Math.sin(Mrad);
  for (let iter = 0; iter < 6; iter++) {
    const f = E - e * Math.sin(E) - Mrad;
    const fp = 1 - e * Math.cos(E);
    E -= f / fp;
  }

  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E);

  const cosO = Math.cos(node);
  const sinO = Math.sin(node);
  const cosW = Math.cos(omega);
  const sinW = Math.sin(omega);
  const cosI = Math.cos(inc);
  const sinI = Math.sin(inc);

  const auX =
    (cosW * cosO - sinW * sinO * cosI) * xOrb +
    (-sinW * cosO - cosW * sinO * cosI) * yOrb;
  const auY =
    (cosW * sinO + sinW * cosO * cosI) * xOrb +
    (-sinW * sinO + cosW * cosO * cosI) * yOrb;
  const auZ = sinW * sinI * xOrb + cosW * sinI * yOrb;

  const rAU = Math.sqrt(auX * auX + auY * auY + auZ * auZ);
  const scale = auToSceneDistance(rAU) / Math.max(1e-6, rAU);
  // Three.js Y-up: map ecliptic X->X, ecliptic Z->Y, ecliptic Y->-Z
  const sceneX = auX * scale;
  const sceneY = auZ * scale;
  const sceneZ = -auY * scale;

  // Vis-viva equation: v = 29.78 * sqrt(2/r - 1/a) km/s
  const orbitalSpeedKmS = 29.78 * Math.sqrt(Math.max(0.01, 2 / rAU - 1 / a));

  return {
    auX,
    auY,
    auZ,
    sceneX,
    sceneY,
    sceneZ,
    heliocentricAU: rAU,
    orbitalSpeedKmS,
  };
}

export function distanceAUAndLightMin(
  a: PlanetEphemerisPoint,
  b: PlanetEphemerisPoint
): { au: number; lightMin: number } {
  const dx = a.auX - b.auX;
  const dy = a.auY - b.auY;
  const dz = a.auZ - b.auZ;
  const au = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return { au, lightMin: au / AU_PER_LIGHT_MIN };
}
