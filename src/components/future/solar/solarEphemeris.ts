import * as THREE from 'three';

export type SolarBodyId =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface KeplerianElement {
  a: number;       // semi-major axis (AU)
  aDot: number;    // AU / century
  e: number;       // eccentricity
  eDot: number;
  I: number;       // inclination (deg)
  IDot: number;
  L: number;       // mean longitude (deg)
  LDot: number;
  wBar: number;    // longitude of perihelion (deg)
  wBarDot: number;
  Omega: number;   // longitude of ascending node (deg)
  OmegaDot: number;
}

export interface SolarBodyMeta {
  id: SolarBodyId;
  indexLabel: string;
  nameEn: string;
  nameVi: string;
  typeEn: string;
  typeVi: string;
  colorHex: string;
  orbitColorHex: string;
  radiusScene: number;
  axialTiltDeg: number;
  rotSpeed: number;
  periodDays: number;
  diameterKm: number;
  dayLengthEn: string;
  dayLengthVi: string;
  orbitalPeriodEn: string;
  orbitalPeriodVi: string;
  gravityMs2: number;
  moonsCount: number;
  tempDisplay: string;
  factEn: string;
  factVi: string;
  moreFactEn: string;
  moreFactVi: string;
  elements?: KeplerianElement;
}

/**
 * NASA JPL J2000 Keplerian elements (1800–2100 valid range)
 * Source: Standish (1992) / JPL Solar System Dynamics
 */
export const SOLAR_BODIES: SolarBodyMeta[] = [
  {
    id: 'sun',
    indexLabel: '00 · STAR',
    nameEn: 'Sun',
    nameVi: 'Mặt Trời',
    typeEn: 'G2V Yellow Dwarf Star',
    typeVi: 'Sao lùn vàng quang phổ G2V',
    colorHex: '#ffb020',
    orbitColorHex: '#ffb020',
    radiusScene: 4.1,
    axialTiltDeg: 7.25,
    rotSpeed: 0.14,
    periodDays: 0,
    diameterKm: 1392700,
    dayLengthEn: '25.4 days',
    dayLengthVi: '25,4 ngày',
    orbitalPeriodEn: '230M yrs (Galactic)',
    orbitalPeriodVi: '230 triệu năm (Ngân Hà)',
    gravityMs2: 274.0,
    moonsCount: 0,
    tempDisplay: '5,778 K (surface)',
    factEn: 'The only star in our Solar System, holding 99.86% of all its mass. Its light takes about 8 minutes to reach Earth.',
    factVi: 'Ngôi sao duy nhất của Hệ Mặt Trời, nắm giữ 99,86% tổng khối lượng. Ánh sáng mất khoảng 8 phút để tới Trái Đất.',
    moreFactEn: 'Inside its 15-million-kelvin core, nuclear fusion converts ~600 million tons of hydrogen into helium every second, driving space weather across 8 planets.',
    moreFactVi: 'Trong lõi nóng 15 triệu Kelvin, phản ứng nhiệt hạch tổng hợp ~600 triệu tấn Hydro thành Heli mỗi giây, nuôi dưỡng toàn bộ 8 hành tinh.'
  },
  {
    id: 'mercury',
    indexLabel: '01 · TERRESTRIAL',
    nameEn: 'Mercury',
    nameVi: 'Sao Thủy',
    typeEn: 'Terrestrial Planet',
    typeVi: 'Hành tinh đất đá',
    colorHex: '#b6aba1',
    orbitColorHex: '#9c9288',
    radiusScene: 0.42,
    axialTiltDeg: 0.03,
    rotSpeed: 0.12,
    periodDays: 87.97,
    diameterKm: 4879,
    dayLengthEn: '58.6 days',
    dayLengthVi: '58,6 ngày',
    orbitalPeriodEn: '88.0 days',
    orbitalPeriodVi: '88,0 ngày',
    gravityMs2: 3.7,
    moonsCount: 0,
    tempDisplay: '-180°C to +430°C',
    factEn: 'Closest & fastest planet; its 3:2 spin-orbit resonance creates 176-Earth-day solar days.',
    factVi: 'Hành tinh gần Mặt Trời và quay nhanh nhất với cộng hưởng tự quay 3:2.',
    moreFactEn: 'Mercury has the most eccentric orbit of the eight planets (e = 0.2056) and possesses an oversized iron core making up ~85% of its radius.',
    moreFactVi: 'Sao Thủy có quỹ đạo dẹt nhất trong 8 hành tinh (e = 0,2056) và sở hữu lõi sắt khổng lồ chiếm tới ~85% bán kính.',
    elements: {
      a: 0.38709927, aDot: 0.00000037,
      e: 0.20563593, eDot: 0.00001906,
      I: 7.00497902, IDot: -0.00594749,
      L: 252.25032350, LDot: 149472.67411175,
      wBar: 77.45779628, wBarDot: 0.16047689,
      Omega: 48.33076593, OmegaDot: -0.12534081
    }
  },
  {
    id: 'venus',
    indexLabel: '02 · TERRESTRIAL',
    nameEn: 'Venus',
    nameVi: 'Sao Kim',
    typeEn: 'Terrestrial Planet',
    typeVi: 'Hành tinh đất đá',
    colorHex: '#e8c488',
    orbitColorHex: '#d4a66a',
    radiusScene: 0.68,
    axialTiltDeg: 177.36,
    rotSpeed: -0.06,
    periodDays: 224.7,
    diameterKm: 12104,
    dayLengthEn: '243 days (R)',
    dayLengthVi: '243 ngày (Ngược)',
    orbitalPeriodEn: '224.7 days',
    orbitalPeriodVi: '224,7 ngày',
    gravityMs2: 8.87,
    moonsCount: 0,
    tempDisplay: '+464°C (Runaway CO₂)',
    factEn: 'Rotates backwards (retrograde) in 243 Earth days—longer than its own 225-day year.',
    factVi: 'Tự quay ngược chiều kim đồng hồ rất chậm (243 ngày Trái Đất), dài hơn cả 1 năm của chính nó.',
    moreFactEn: 'A thick CO₂ atmosphere creates 92 bar surface pressure—equivalent to 900 m underwater—making Venus the hottest planet despite being second from the Sun.',
    moreFactVi: 'Khí quyển CO₂ đặc tạo áp suất bề mặt 92 bar (tương đương độ sâu 900 m dưới biển), khiến Sao Kim nóng nhất Hệ Mặt Trời.',
    elements: {
      a: 0.72333566, aDot: 0.00000390,
      e: 0.00677672, eDot: -0.00004107,
      I: 3.39467605, IDot: -0.00078890,
      L: 181.97909950, LDot: 58517.81538729,
      wBar: 131.60246718, wBarDot: 0.00268329,
      Omega: 76.67984255, OmegaDot: -0.27769418
    }
  },
  {
    id: 'earth',
    indexLabel: '03 · HOME WORLD',
    nameEn: 'Earth',
    nameVi: 'Trái Đất',
    typeEn: 'Terrestrial Ocean World',
    typeVi: 'Hành tinh xanh',
    colorHex: '#3b82f6',
    orbitColorHex: '#38bdf8',
    radiusScene: 0.74,
    axialTiltDeg: 23.44,
    rotSpeed: 0.75,
    periodDays: 365.256,
    diameterKm: 12742,
    dayLengthEn: '23h 56m',
    dayLengthVi: '23 giờ 56 phút',
    orbitalPeriodEn: '365.26 days',
    orbitalPeriodVi: '365,26 ngày',
    gravityMs2: 9.81,
    moonsCount: 1,
    tempDisplay: '+15°C (mean)',
    factEn: 'Orbits at ~29.78 km/s inside the Sun’s habitable zone with liquid oceans & magnetic shield.',
    factVi: 'Chuyển động quanh Mặt Trời ở ~29,78 km/s trong vùng sống được với đại dương và từ quyển bảo vệ.',
    moreFactEn: 'Our 23.44° axial tilt drives Earth’s four seasons while our large Moon stabilizes planetary precession across geological timescales.',
    moreFactVi: 'Độ nghiêng trục 23,44° sinh ra bốn mùa trong năm, còn Mặt Trăng giúp ổn định góc nghiêng khí hậu suốt hàng tỷ năm.',
    elements: {
      a: 1.00000261, aDot: 0.00000562,
      e: 0.01671123, eDot: -0.00004392,
      I: -0.00001531, IDot: -0.01294668,
      L: 100.46457166, LDot: 35999.37244981,
      wBar: 102.93768193, wBarDot: 0.32327364,
      Omega: 0.0, OmegaDot: 0.0
    }
  },
  {
    id: 'mars',
    indexLabel: '04 · TERRESTRIAL',
    nameEn: 'Mars',
    nameVi: 'Sao Hỏa',
    typeEn: 'Terrestrial Desert World',
    typeVi: 'Hành tinh Đỏ',
    colorHex: '#d95b38',
    orbitColorHex: '#c85a3a',
    radiusScene: 0.52,
    axialTiltDeg: 25.19,
    rotSpeed: 0.72,
    periodDays: 686.98,
    diameterKm: 6779,
    dayLengthEn: '24h 37m',
    dayLengthVi: '24 giờ 37 phút',
    orbitalPeriodEn: '687.0 days',
    orbitalPeriodVi: '687,0 ngày',
    gravityMs2: 3.72,
    moonsCount: 2,
    tempDisplay: '-65°C (mean)',
    factEn: 'Home to Olympus Mons (21.9 km high) and Valles Marineris, the largest canyon in the Solar System.',
    factVi: 'Nơi có núi lửa Olympus Mons cao 21,9 km và hẻm núi Valles Marineris dài hơn 4.000 km.',
    moreFactEn: 'Mars preserves ancient river deltas and polar water-ice caps, orbited by two tiny captured moons, Phobos and Deimos.',
    moreFactVi: 'Sao Hỏa lưu giữ dấu tích đồng bằng sông cổ đại và băng nước hai cực, cùng hai vệ tinh nhỏ Phobos và Deimos.',
    elements: {
      a: 1.52371034, aDot: 0.00001847,
      e: 0.09339410, eDot: 0.00007882,
      I: 1.84969142, IDot: -0.00813131,
      L: -4.55343205, LDot: 19140.30268499,
      wBar: -23.94362959, wBarDot: 0.44441088,
      Omega: 49.55953891, OmegaDot: -0.29257343
    }
  },
  {
    id: 'jupiter',
    indexLabel: '05 · GAS GIANT',
    nameEn: 'Jupiter',
    nameVi: 'Sao Mộc',
    typeEn: 'Gas Giant',
    typeVi: 'Hành tinh khí khổng lồ',
    colorHex: '#d6a574',
    orbitColorHex: '#c9935b',
    radiusScene: 1.85,
    axialTiltDeg: 3.13,
    rotSpeed: 1.45,
    periodDays: 4332.59,
    diameterKm: 139820,
    dayLengthEn: '9h 55m',
    dayLengthVi: '9 giờ 55 phút',
    orbitalPeriodEn: '11.86 years',
    orbitalPeriodVi: '11,86 năm',
    gravityMs2: 24.79,
    moonsCount: 95,
    tempDisplay: '-110°C (cloud tops)',
    factEn: 'More massive than all other planets combined; completes a full rotation in under 10 hours.',
    factVi: 'Khối lượng lớn hơn tất cả hành tinh khác cộng lại; tự quay một vòng chỉ mất chưa đầy 10 giờ.',
    moreFactEn: 'The Great Red Spot is a centuries-old anticyclonic storm wider than Earth, while Jupiter’s gravity shapes the Asteroid Belt resonances.',
    moreFactVi: 'Vết Đỏ Lớn là siêu bão tồn tại hàng trăm năm rộng hơn cả Trái Đất, còn trường hấp dẫn Sao Mộc định hình vành đai tiểu hành tinh.',
    elements: {
      a: 5.20288700, aDot: -0.00011607,
      e: 0.04838624, eDot: -0.00013253,
      I: 1.30439695, IDot: -0.00183714,
      L: 34.39644051, LDot: 3034.74612775,
      wBar: 14.72847983, wBarDot: 0.21252668,
      Omega: 100.47390909, OmegaDot: 0.20469106
    }
  },
  {
    id: 'saturn',
    indexLabel: '06 · GAS GIANT',
    nameEn: 'Saturn',
    nameVi: 'Sao Thổ',
    typeEn: 'Ringed Gas Giant',
    typeVi: 'Hành tinh vành đai',
    colorHex: '#e4cd9a',
    orbitColorHex: '#d9bc7a',
    radiusScene: 1.52,
    axialTiltDeg: 26.73,
    rotSpeed: 1.32,
    periodDays: 10759.22,
    diameterKm: 116460,
    dayLengthEn: '10h 33m',
    dayLengthVi: '10 giờ 33 phút',
    orbitalPeriodEn: '29.45 years',
    orbitalPeriodVi: '29,45 năm',
    gravityMs2: 10.44,
    moonsCount: 146,
    tempDisplay: '-140°C (cloud tops)',
    factEn: 'Iconic icy rings span 282,000 km wide yet average barely 10–30 meters thick; mean density 0.687 g/cm³.',
    factVi: 'Hệ vành đai băng rộng 282.000 km nhưng dày trung bình chỉ ~10–30 mét; khối lượng riêng nhẹ hơn nước.',
    moreFactEn: 'Its largest moon Titan has a dense nitrogen atmosphere and liquid methane lakes, while Enceladus vents subsurface water-ice plumes.',
    moreFactVi: 'Vệ tinh Titan có khí quyển nitơ dày và hồ metan lỏng, còn Enceladus phun các mạch nước băng từ đại dương ngầm.',
    elements: {
      a: 9.53667594, aDot: -0.00125060,
      e: 0.05386179, eDot: -0.00050991,
      I: 2.48599187, IDot: 0.00193609,
      L: 49.95424423, LDot: 1222.49362201,
      wBar: 92.59887831, wBarDot: -0.41897216,
      Omega: 113.66242448, OmegaDot: -0.28867794
    }
  },
  {
    id: 'uranus',
    indexLabel: '07 · ICE GIANT',
    nameEn: 'Uranus',
    nameVi: 'Sao Thiên Vương',
    typeEn: 'Ice Giant',
    typeVi: 'Hành tinh băng khổng lồ',
    colorHex: '#8ae0e6',
    orbitColorHex: '#67d2dc',
    radiusScene: 1.05,
    axialTiltDeg: 97.77,
    rotSpeed: -0.9,
    periodDays: 30688.5,
    diameterKm: 50724,
    dayLengthEn: '17h 14m (R)',
    dayLengthVi: '17 giờ 14 phút',
    orbitalPeriodEn: '84.0 years',
    orbitalPeriodVi: '84,0 năm',
    gravityMs2: 8.69,
    moonsCount: 28,
    tempDisplay: '-195°C (coldest atm)',
    factEn: 'Tilted 97.77° on its side—effectively rolling around the Sun with 42-year-long polar seasons.',
    factVi: 'Trục tự quay nghiêng 97,77° gần như nằm ngang mặt phẳng quỹ đạo, tạo ra mùa kéo dài 42 năm.',
    moreFactEn: 'Upper-atmosphere methane absorbs red light and scatters cyan-blue wavelengths, sitting atop a superionic water-ammonia mantle.',
    moreFactVi: 'Khí metan tầng cao hấp thụ tia đỏ và phản xạ sắc xanh ngọc, bao phủ lớp phủ băng nước-amoniac áp suất siêu cao.',
    elements: {
      a: 19.18916464, aDot: -0.00196176,
      e: 0.04725744, eDot: -0.00004397,
      I: 0.77263783, IDot: -0.00242939,
      L: 313.23810451, LDot: 428.48202785,
      wBar: 170.95427630, wBarDot: 0.40805281,
      Omega: 74.01692503, OmegaDot: 0.04240589
    }
  },
  {
    id: 'neptune',
    indexLabel: '08 · ICE GIANT',
    nameEn: 'Neptune',
    nameVi: 'Sao Hải Vương',
    typeEn: 'Ice Giant',
    typeVi: 'Hành tinh băng khổng lồ',
    colorHex: '#4b74f5',
    orbitColorHex: '#4f78ff',
    radiusScene: 1.02,
    axialTiltDeg: 28.32,
    rotSpeed: 0.95,
    periodDays: 60195,
    diameterKm: 49244,
    dayLengthEn: '16h 06m',
    dayLengthVi: '16 giờ 06 phút',
    orbitalPeriodEn: '164.8 years',
    orbitalPeriodVi: '164,8 năm',
    gravityMs2: 11.15,
    moonsCount: 16,
    tempDisplay: '-200°C',
    factEn: 'First planet discovered via math prediction (1846); supersonic methane winds exceed 2,100 km/h.',
    factVi: 'Hành tinh đầu tiên tìm ra nhờ tính toán toán học (1846), sở hữu gió siêu thanh tới 2.100 km/h.',
    moreFactEn: 'Urban Le Verrier & John Couch Adams predicted Neptune’s position solely from gravitational perturbations observed in Uranus’s orbit.',
    moreFactVi: 'Le Verrier và Adams đã tính ra vị trí Sao Hải Vương hoàn toàn bằng nhiễu loạn hấp dẫn trên quỹ đạo Sao Thiên Vương trước khi kính thiên văn nhìn thấy nó.',
    elements: {
      a: 30.06992276, aDot: 0.00026291,
      e: 0.00859048, eDot: 0.00005105,
      I: 1.77004347, IDot: 0.00035372,
      L: -55.12002969, LDot: 218.45945325,
      wBar: 44.96476227, wBarDot: -0.32241464,
      Omega: 131.78422574, OmegaDot: -0.00508664
    }
  }
];

export interface PlanetState {
  id: SolarBodyId;
  scenePos: THREE.Vector3;
  auPos: THREE.Vector3;
  distanceAU: number;
  velocityKms: number;
  heliocentricLonDeg: number;
}

/** Compress physical AU distance smoothly into explore-scale Three.js units */
export function auToSceneDistance(au: number): number {
  if (au <= 0.01) return 0;
  return 9.2 + Math.pow(au, 0.56) * 14.5;
}

/** Julian Ephemeris Date from JS Date (UTC) */
export function dateToJulianDaysSinceJ2000(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5;
  return jd - 2451545.0;
}

/**
 * Compute real heliocentric position (AU + exploration-scale 3D scene coords)
 * & orbital speed (km/s via vis-viva equation) for any JS Date.
 */
export function computePlanetState(body: SolarBodyMeta, date: Date): PlanetState {
  if (!body.elements) {
    return {
      id: body.id,
      scenePos: new THREE.Vector3(0, 0, 0),
      auPos: new THREE.Vector3(0, 0, 0),
      distanceAU: 0,
      velocityKms: 0,
      heliocentricLonDeg: 0
    };
  }

  const d = dateToJulianDaysSinceJ2000(date);
  const T = d / 36525.0;
  const el = body.elements;

  const a = el.a + el.aDot * T;
  const e = el.e + el.eDot * T;
  const I = THREE.MathUtils.degToRad(el.I + el.IDot * T);
  const L = el.L + el.LDot * T;
  const wBar = el.wBar + el.wBarDot * T;
  const Omega = THREE.MathUtils.degToRad(el.Omega + el.OmegaDot * T);
  const omega = THREE.MathUtils.degToRad(wBar - (el.Omega + el.OmegaDot * T));

  let Mdeg = (L - wBar) % 360;
  if (Mdeg > 180) Mdeg -= 360;
  if (Mdeg < -180) Mdeg += 360;
  const M = THREE.MathUtils.degToRad(Mdeg);

  // Solve Kepler's equation M = E - e * sin(E) via Newton-Raphson
  let E = M + e * Math.sin(M);
  for (let iter = 0; iter < 6; iter++) {
    const f = E - e * Math.sin(E) - M;
    const fPrime = 1 - e * Math.cos(E);
    const delta = f / Math.max(1e-6, fPrime);
    E -= delta;
    if (Math.abs(delta) < 1e-7) break;
  }

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E);

  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  // Heliocentric ecliptic coordinates (AU): X_ecl, Y_ecl, Z_ecl
  const xEcl =
    (cosw * cosO - sinw * sinO * cosI) * xp +
    (-sinw * cosO - cosw * sinO * cosI) * yp;
  const yEcl =
    (cosw * sinO + sinw * cosO * cosI) * xp +
    (-sinw * sinO + cosw * cosO * cosI) * yp;
  const zEcl = sinw * sinI * xp + cosw * sinI * yp;

  // Map ecliptic (X, Y, Z) -> Three.js (x = X_ecl, y = Z_ecl, z = -Y_ecl) so CCW top-down
  const auPos = new THREE.Vector3(xEcl, zEcl, -yEcl);
  const distanceAU = Math.max(0.05, auPos.length());

  // Compress radial magnitude cleanly while preserving exact orbital inclination & longitude
  const sceneDist = auToSceneDistance(distanceAU);
  const scenePos = auPos.clone().normalize().multiplyScalar(sceneDist);

  // Vis-viva orbital velocity: v = 29.7847 * sqrt(2/r - 1/a) km/s
  const velocityKms = 29.7847 * Math.sqrt(Math.max(0.01, 2 / distanceAU - 1 / a));

  let lon = THREE.MathUtils.radToDeg(Math.atan2(yEcl, xEcl));
  if (lon < 0) lon += 360;

  return {
    id: body.id,
    scenePos,
    auPos,
    distanceAU,
    velocityKms,
    heliocentricLonDeg: lon
  };
}

/** Light-time constant: 1 AU = 8.316746397 light-minutes */
const AU_TO_LIGHT_MIN = 8.3167464;

export function computeEarthRelativeTelemetry(
  bodyState: PlanetState,
  earthState: PlanetState
): { earthDistAU: number; lightMinutes: number } {
  const earthDistAU = bodyState.auPos.distanceTo(earthState.auPos);
  return {
    earthDistAU,
    lightMinutes: earthDistAU * AU_TO_LIGHT_MIN
  };
}

/** Generate points for an entire closed Keplerian orbit ellipse in exploration scale */
export function buildOrbitCurvePoints(body: SolarBodyMeta, date: Date, segments = 160): THREE.Vector3[] {
  if (!body.elements) return [];
  const d = dateToJulianDaysSinceJ2000(date);
  const T = d / 36525.0;
  const el = body.elements;

  const a = el.a + el.aDot * T;
  const e = el.e + el.eDot * T;
  const I = THREE.MathUtils.degToRad(el.I + el.IDot * T);
  const wBar = el.wBar + el.wBarDot * T;
  const Omega = THREE.MathUtils.degToRad(el.Omega + el.OmegaDot * T);
  const omega = THREE.MathUtils.degToRad(wBar - (el.Omega + el.OmegaDot * T));

  const cosO = Math.cos(Omega);
  const sinO = Math.sin(Omega);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);
  const cosI = Math.cos(I);
  const sinI = Math.sin(I);

  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const E = (i / segments) * Math.PI * 2;
    const xp = a * (Math.cos(E) - e);
    const yp = a * Math.sqrt(Math.max(0, 1 - e * e)) * Math.sin(E);

    const xEcl =
      (cosw * cosO - sinw * sinO * cosI) * xp +
      (-sinw * cosO - cosw * sinO * cosI) * yp;
    const yEcl =
      (cosw * sinO + sinw * cosO * cosI) * xp +
      (-sinw * sinO + cosw * cosO * cosI) * yp;
    const zEcl = sinw * sinI * xp + cosw * sinI * yp;

    const v = new THREE.Vector3(xEcl, zEcl, -yEcl);
    const r = Math.max(0.05, v.length());
    v.normalize().multiplyScalar(auToSceneDistance(r));
    pts.push(v);
  }
  return pts;
}

// =====================================================================
// 100% PROCEDURAL HIGH-DETAIL PLANETARY TEXTURES (ZERO EXTERNAL ASSETS)
// =====================================================================

function hash2d(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function fbm2d(x: number, y: number, seed: number, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < octaves; o++) {
    const xi = Math.floor(x * freq);
    const yi = Math.floor(y * freq);
    const xf = x * freq - xi;
    const yf = y * freq - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash2d(xi, yi, seed + o * 17);
    const b = hash2d(xi + 1, yi, seed + o * 17);
    const c = hash2d(xi, yi + 1, seed + o * 17);
    const d = hash2d(xi + 1, yi + 1, seed + o * 17);
    val += amp * ((a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v);
    freq *= 2.05;
    amp *= 0.5;
  }
  return val;
}

export function createPlanetSurfaceTexture(id: SolarBodyId): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  if (id === 'sun') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const u = (x / w) * 14;
        const v = (y / h) * 7;
        const n = fbm2d(u, v, 3, 4);
        const gran = fbm2d(u * 2.8, v * 2.8, 11, 3);
        const spot = n < 0.34 ? 0.52 : 1.0;
        const heat = THREE.MathUtils.clamp((n * 0.65 + gran * 0.5) * spot, 0, 1);
        const idx = (y * w + x) * 4;
        img.data[idx] = Math.round(230 + heat * 25);
        img.data[idx + 1] = Math.round(105 + heat * 135);
        img.data[idx + 2] = Math.round(14 + Math.pow(heat, 2) * 98);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'earth') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const lat = Math.abs((y / h) * 2 - 1);
      for (let x = 0; x < w; x++) {
        const n = fbm2d((x / w) * 8, (y / h) * 4, 42, 4);
        const detail = fbm2d((x / w) * 18, (y / h) * 9, 99, 3);
        const idx = (y * w + x) * 4;
        if (lat > 0.84 - n * 0.08) {
          // Polar ice caps
          img.data[idx] = 235;
          img.data[idx + 1] = 244;
          img.data[idx + 2] = 255;
        } else if (n > 0.53) {
          // Continents (forest green to arid tan)
          const arid = detail > 0.55 && lat < 0.45 ? 1 : 0;
          img.data[idx] = arid ? 178 : 48;
          img.data[idx + 1] = arid ? 155 : 138;
          img.data[idx + 2] = arid ? 102 : 66;
        } else {
          // Oceans with bathymetry variation
          const depth = n / 0.53;
          img.data[idx] = Math.round(12 + depth * 28);
          img.data[idx + 1] = Math.round(52 + depth * 82);
          img.data[idx + 2] = Math.round(135 + depth * 95);
        }
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'jupiter') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const yf = y / h;
      for (let x = 0; x < w; x++) {
        const xf = x / w;
        const turb = (fbm2d(xf * 10, yf * 10, 71, 3) - 0.5) * 0.06;
        const band = Math.sin((yf + turb) * Math.PI * 15);
        // Great Red Spot near southern tropic
        const dx = (xf - 0.62) * 3.8;
        const dy = (yf - 0.64) * 9.5;
        const grsDist = Math.hypot(dx, dy);
        const grsMask = grsDist < 0.48 ? Math.cos((grsDist / 0.48) * (Math.PI / 2)) : 0;

        const baseR = 198 + band * 34;
        const baseG = 160 + band * 26;
        const baseB = 122 + band * 18;
        const idx = (y * w + x) * 4;
        img.data[idx] = Math.round(THREE.MathUtils.lerp(baseR, 212, grsMask));
        img.data[idx + 1] = Math.round(THREE.MathUtils.lerp(baseG, 82, grsMask));
        img.data[idx + 2] = Math.round(THREE.MathUtils.lerp(baseB, 56, grsMask));
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'saturn') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const yf = y / h;
      for (let x = 0; x < w; x++) {
        const xf = x / w;
        const turb = (fbm2d(xf * 6, yf * 12, 83, 3) - 0.5) * 0.025;
        const band = Math.sin((yf + turb) * Math.PI * 19) * 0.5 + Math.cos(yf * Math.PI * 7) * 0.5;
        const idx = (y * w + x) * 4;
        img.data[idx] = Math.round(224 + band * 20);
        img.data[idx + 1] = Math.round(198 + band * 18);
        img.data[idx + 2] = Math.round(145 + band * 15);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'mars') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const lat = Math.abs((y / h) * 2 - 1);
      for (let x = 0; x < w; x++) {
        const n = fbm2d((x / w) * 9, (y / h) * 5, 29, 4);
        const idx = (y * w + x) * 4;
        if (lat > 0.91 - n * 0.04) {
          img.data[idx] = 238;
          img.data[idx + 1] = 230;
          img.data[idx + 2] = 225;
        } else {
          const darkBasalt = n < 0.44 ? 0.72 : 1.0;
          img.data[idx] = Math.round((176 + n * 58) * darkBasalt);
          img.data[idx + 1] = Math.round((78 + n * 42) * darkBasalt);
          img.data[idx + 2] = Math.round((46 + n * 24) * darkBasalt);
        }
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'mercury') {
    ctx.fillStyle = '#8b837b';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) {
      const cx = hash2d(i, 1, 5) * w;
      const cy = hash2d(i, 2, 5) * h;
      const cr = 2 + hash2d(i, 3, 5) * 14;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(65, 60, 56, 0.48)' : 'rgba(190, 184, 176, 0.28)';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'venus') {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const yf = y / h;
      for (let x = 0; x < w; x++) {
        const xf = x / w;
        const swirl = fbm2d(xf * 7 + Math.sin(yf * Math.PI) * 1.4, yf * 8, 53, 4);
        const idx = (y * w + x) * 4;
        img.data[idx] = Math.round(212 + swirl * 38);
        img.data[idx + 1] = Math.round(176 + swirl * 34);
        img.data[idx + 2] = Math.round(108 + swirl * 30);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  } else if (id === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#a8edf0');
    grad.addColorStop(0.5, '#76d8e0');
    grad.addColorStop(1, '#58c3ce');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else {
    // Neptune
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const yf = y / h;
      for (let x = 0; x < w; x++) {
        const xf = x / w;
        const band = fbm2d(xf * 6, yf * 14, 107, 3);
        const spot = Math.hypot((xf - 0.38) * 4, (yf - 0.58) * 10);
        const darkSpot = spot < 0.45 ? 0.68 : 1.0;
        const idx = (y * w + x) * 4;
        img.data[idx] = Math.round((46 + band * 34) * darkSpot);
        img.data[idx + 1] = Math.round((92 + band * 48) * darkSpot);
        img.data[idx + 2] = Math.round((215 + band * 35) * darkSpot);
        img.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

export function createSaturnRingTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  for (let x = 0; x < size; x++) {
    const r = x / size; // 0 inner -> 1 outer
    let alpha = 0;
    let tint = 220;
    if (r > 0.16 && r < 0.28) {
      // C Ring (faint dusky)
      alpha = 0.28;
      tint = 175;
    } else if (r >= 0.28 && r < 0.62) {
      // B Ring (bright dense)
      alpha = 0.72 + Math.sin(r * 160) * 0.14;
      tint = 235;
    } else if (r >= 0.62 && r < 0.68) {
      // Cassini Division gap
      alpha = 0.06;
      tint = 120;
    } else if (r >= 0.68 && r < 0.94) {
      // A Ring + Encke gap
      alpha = Math.abs(r - 0.87) < 0.01 ? 0.12 : 0.56 + Math.cos(r * 140) * 0.1;
      tint = 215;
    }
    ctx.fillStyle = `rgba(${tint}, ${Math.round(tint * 0.91)}, ${Math.round(tint * 0.72)}, ${alpha})`;
    ctx.fillRect(x, 0, 1, 32);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSolarGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 232, 160, 0.95)');
  grad.addColorStop(0.28, 'rgba(255, 174, 52, 0.48)');
  grad.addColorStop(0.62, 'rgba(249, 115, 22, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
