import { ChemistryDomainId } from '../types';

export type ChemApparatusCategoryId =
  | 'all'
  | 'measurement'
  | 'glassware_titration'
  | 'heating_synthesis'
  | 'electrochemistry_spectro';

export interface ChemApparatusItem {
  id: string;
  category: Exclude<ChemApparatusCategoryId, 'all'>;
  symbol: string;
  viName: string;
  enName: string;
  unit: string;
  accentHex: string;
  shortDescVi: string;
  shortDescEn: string;
  widgetKind:
    | 'ph_meter'
    | 'thermometer'
    | 'balance'
    | 'conductivity'
    | 'burette'
    | 'pipette'
    | 'erlenmeyer'
    | 'beaker'
    | 'volumetric'
    | 'separatory'
    | 'hotplate'
    | 'bunsen'
    | 'condenser'
    | 'gas_syringe'
    | 'voltmeter'
    | 'colorimeter';
}

export interface ChemApparatusReading {
  valueText: string;
  subLabel: string;
  numericValue: number;
  phValue?: number;
  tempC?: number;
  fluidHex?: string;
  flameIntensity?: number;
  fillRatio?: number;
}

export const CHEM_APPARATUS_CATEGORIES: { id: ChemApparatusCategoryId; vi: string; en: string }[] = [
  { id: 'all', vi: 'Tất cả (16)', en: 'All (16)' },
  { id: 'measurement', vi: 'Đo pH · Cân · Nhiệt', en: 'pH · Balance · Temp' },
  { id: 'glassware_titration', vi: 'Thủy tinh · Chuẩn độ', en: 'Glassware · Titration' },
  { id: 'heating_synthesis', vi: 'Đun nóng · Sinh hàn · Khí', en: 'Heating · Condenser · Gas' },
  { id: 'electrochemistry_spectro', vi: 'Điện hóa · Quang phổ', en: 'Electro · Spectroscopy' }
];

export const CHEM_APPARATUS_CATALOG: ChemApparatusItem[] = [
  {
    id: 'ph_meter_digital',
    category: 'measurement',
    symbol: 'pH',
    viName: 'Máy đo pH điện tử',
    enName: 'Digital pH Meter',
    unit: 'pH',
    accentHex: '#10b981',
    shortDescVi: 'Đầu dò điện cực thủy tinh đo pH dung dịch chính xác ±0,01',
    shortDescEn: 'Glass electrode probe measuring solution pH to ±0.01',
    widgetKind: 'ph_meter'
  },
  {
    id: 'thermometer_chem',
    category: 'measurement',
    symbol: '°C',
    viName: 'Nhiệt kế thí nghiệm (-10..200°C)',
    enName: 'Lab Thermometer',
    unit: '°C',
    accentHex: '#ef4444',
    shortDescVi: 'Theo dõi nhiệt độ phản ứng thu nhiệt / tỏa nhiệt & nhiệt lượng kế',
    shortDescEn: 'Tracks endothermic/exothermic reaction & calorimetry temperature',
    widgetKind: 'thermometer'
  },
  {
    id: 'balance_analytical',
    category: 'measurement',
    symbol: 'mg',
    viName: 'Cân phân tích điện tử (0,001g)',
    enName: 'Analytical Balance',
    unit: 'g',
    accentHex: '#0ea5e9',
    shortDescVi: 'Cân khối lượng hóa chất rắn, kết tủa hoặc kim loại phản ứng',
    shortDescEn: 'Measures mass of solids, precipitates, or reacting metals',
    widgetKind: 'balance'
  },
  {
    id: 'conductivity_probe',
    category: 'measurement',
    symbol: 'κ',
    viName: 'Đầu đo độ dẫn điện ion',
    enName: 'Conductivity Probe',
    unit: 'mS/cm',
    accentHex: '#06b6d4',
    shortDescVi: 'Đánh giá mức độ điện li mạnh/yếu dựa vào tổng nồng độ ion tự do',
    shortDescEn: 'Evaluates strong/weak electrolyte ionization by ionic conductivity',
    widgetKind: 'conductivity'
  },
  {
    id: 'burette_50ml',
    category: 'glassware_titration',
    symbol: 'Bu',
    viName: 'Buret chuẩn độ 50 mL',
    enName: '50 mL Titration Burette',
    unit: 'mL',
    accentHex: '#38bdf8',
    shortDescVi: 'Ống chuẩn độ khóa PTFE nhỏ giọt chính xác từng 0,05 mL',
    shortDescEn: 'PTFE-stopcock graduated burette with 0.05 mL precision',
    widgetKind: 'burette'
  },
  {
    id: 'pipette_10ml',
    category: 'glassware_titration',
    symbol: 'Pi',
    viName: 'Pipet bầu định mức 10 mL',
    enName: '10 mL Volumetric Pipette',
    unit: 'mL',
    accentHex: '#8b5cf6',
    shortDescVi: 'Hút chính xác thể tích dung dịch chuẩn trước khi chuẩn độ',
    shortDescEn: 'Transfers exact aliquot volume prior to titration',
    widgetKind: 'pipette'
  },
  {
    id: 'erlenmeyer_flask',
    category: 'glassware_titration',
    symbol: 'Er',
    viName: 'Bình tam giác Erlenmeyer 250 mL',
    enName: '250 mL Erlenmeyer Flask',
    unit: 'mL',
    accentHex: '#ec4899',
    shortDescVi: 'Bình nón lắc trộn dung dịch chuẩn độ & chỉ thị màu phenolphthalein',
    shortDescEn: 'Conical titration flask with indicator color transition',
    widgetKind: 'erlenmeyer'
  },
  {
    id: 'beaker_250ml',
    category: 'glassware_titration',
    symbol: 'Bk',
    viName: 'Cốc thủy tinh Borosilicat 250 mL',
    enName: '250 mL Borosilicate Beaker',
    unit: 'mL',
    accentHex: '#14b8a6',
    shortDescVi: 'Pha chế dung dịch, phản ứng kết tủa & nhúng điện cực',
    shortDescEn: 'Solution preparation, precipitation & electrode immersion',
    widgetKind: 'beaker'
  },
  {
    id: 'volumetric_flask',
    category: 'glassware_titration',
    symbol: 'Vf',
    viName: 'Bình định mức cổ dài 100 mL',
    enName: '100 mL Volumetric Flask',
    unit: 'M',
    accentHex: '#6366f1',
    shortDescVi: 'Pha dung dịch chuẩn nồng độ mol C_M chính xác tại vạch ngấn',
    shortDescEn: 'Prepares standard molarity solutions to the calibration mark',
    widgetKind: 'volumetric'
  },
  {
    id: 'separatory_funnel',
    category: 'glassware_titration',
    symbol: 'Sf',
    viName: 'Phễu chiết tách pha (Lỏng–Lỏng)',
    enName: 'Separatory Funnel',
    unit: 'mL',
    accentHex: '#f59e0b',
    shortDescVi: 'Chiết tách lớp este / hữu cơ không tan khỏi pha nước',
    shortDescEn: 'Separates immiscible ester/organic phase from aqueous layer',
    widgetKind: 'separatory'
  },
  {
    id: 'magnetic_hotplate',
    category: 'heating_synthesis',
    symbol: 'St',
    viName: 'Máy khuấy từ gia nhiệt',
    enName: 'Magnetic Stirrer Hotplate',
    unit: 'rpm',
    accentHex: '#f97316',
    shortDescVi: 'Khuấy đều bằng cá từ và gia nhiệt ổn định cho phản ứng hữu cơ',
    shortDescEn: 'Spins PTFE stir bar with controlled hotplate heating',
    widgetKind: 'hotplate'
  },
  {
    id: 'bunsen_burner',
    category: 'heating_synthesis',
    symbol: 'Fl',
    viName: 'Đèn khí Bunsen (Thử màu & Nung)',
    enName: 'Bunsen Burner',
    unit: '°C',
    accentHex: '#3b82f6',
    shortDescVi: 'Ngọn lửa xanh không khói để đun nóng và thử màu ngọn lửa ion',
    shortDescEn: 'Blue premixed gas flame for heating and ion flame tests',
    widgetKind: 'bunsen'
  },
  {
    id: 'reflux_condenser',
    category: 'heating_synthesis',
    symbol: 'Cd',
    viName: 'Ống sinh hàn hồi lưu Liebig',
    enName: 'Liebig Reflux Condenser',
    unit: '°C',
    accentHex: '#0284c7',
    shortDescVi: 'Ngưng tụ hơi este / ancol bay hơi hồi lưu bằng nước làm mát',
    shortDescEn: 'Condenses volatile ester/alcohol vapors with cooling jacket',
    widgetKind: 'condenser'
  },
  {
    id: 'gas_syringe_100ml',
    category: 'heating_synthesis',
    symbol: 'Gs',
    viName: 'Xi-lanh thu & đo thể tích khí',
    enName: '100 mL Gas Syringe',
    unit: 'mL',
    accentHex: '#22c55e',
    shortDescVi: 'Đo tốc độ sinh khí H₂, CO₂, O₂ theo thời gian thực',
    shortDescEn: 'Measures evolved gas volume (H₂, CO₂, O₂) over time',
    widgetKind: 'gas_syringe'
  },
  {
    id: 'voltmeter_galvanic',
    category: 'electrochemistry_spectro',
    symbol: 'E°',
    viName: 'Vôn kế đo suất điện động E°_pin',
    enName: 'Galvanic Voltmeter',
    unit: 'V',
    accentHex: '#a855f7',
    shortDescVi: 'Đo hiệu điện thế mạch hở giữa hai bán pin điện hóa',
    shortDescEn: 'Reads open-circuit cell potential E° between half-cells',
    widgetKind: 'voltmeter'
  },
  {
    id: 'colorimeter_uv',
    category: 'electrochemistry_spectro',
    symbol: 'Aλ',
    viName: 'Quang phổ kế UV-Vis / So màu',
    enName: 'UV-Vis Colorimeter',
    unit: 'Abs',
    accentHex: '#eab308',
    shortDescVi: 'Đo độ hấp thụ quang A theo định luật Beer–Lambert',
    shortDescEn: 'Measures optical absorbance A via Beer–Lambert law',
    widgetKind: 'colorimeter'
  }
];

export const CHEM_APPARATUS_BY_ID: Record<string, ChemApparatusItem> = Object.fromEntries(
  CHEM_APPARATUS_CATALOG.map((item) => [item.id, item])
);

export function getRecommendedChemToolsForSim(
  dimension: '2d' | '3d',
  simId: string,
  domainId: ChemistryDomainId
): string[] {
  const s = simId.toLowerCase();
  if (s.includes('titration') || s.includes('buffer')) {
    return ['burette_50ml', 'erlenmeyer_flask', 'ph_meter_digital', 'magnetic_hotplate'];
  }
  if (s.includes('galvanic') || s.includes('electrolysis') || s.includes('corrosion')) {
    return ['voltmeter_galvanic', 'beaker_250ml', 'conductivity_probe', 'balance_analytical'];
  }
  if (s.includes('ester') || s.includes('carbonyl') || s.includes('soap')) {
    return ['reflux_condenser', 'magnetic_hotplate', 'separatory_funnel', 'thermometer_chem'];
  }
  if (s.includes('flame') || s.includes('spectro') || s.includes('complex')) {
    return ['bunsen_burner', 'colorimeter_uv', 'beaker_250ml', 'pipette_10ml'];
  }
  if (s.includes('enthalpy') || s.includes('kinetics') || s.includes('maxwell') || s.includes('haber') || s.includes('contact')) {
    return ['thermometer_chem', 'gas_syringe_100ml', 'magnetic_hotplate', 'balance_analytical'];
  }
  if (s.includes('qualitative') || s.includes('halogen') || s.includes('metal_activity') || s.includes('stoichiometry')) {
    return ['beaker_250ml', 'gas_syringe_100ml', 'ph_meter_digital', 'balance_analytical'];
  }
  if (s.includes('colligative')) {
    return ['thermometer_chem', 'volumetric_flask', 'magnetic_hotplate', 'balance_analytical'];
  }

  switch (domainId) {
    case 'equilibrium_acidbase':
      return ['burette_50ml', 'erlenmeyer_flask', 'ph_meter_digital'];
    case 'electro_inorganic':
      return ['voltmeter_galvanic', 'beaker_250ml', 'gas_syringe_100ml'];
    case 'kinetics_thermo':
      return ['thermometer_chem', 'gas_syringe_100ml', 'magnetic_hotplate'];
    case 'organic_polymer':
      return ['reflux_condenser', 'separatory_funnel', 'magnetic_hotplate'];
    default:
      return dimension === '3d'
        ? ['bunsen_burner', 'colorimeter_uv', 'balance_analytical']
        : ['beaker_250ml', 'ph_meter_digital', 'thermometer_chem'];
  }
}

export function evaluateChemApparatusReading(
  toolId: string,
  simId: string,
  params: Record<string, number>,
  simTime: number,
  xPct: number,
  yPct: number
): ChemApparatusReading {
  const s = simId.toLowerCase();
  const baseTemp =
    params.tempC ??
    params.temperature ??
    params.temp ??
    (s.includes('haber') ? 450 : s.includes('contact') ? 480 : s.includes('metallurgy') ? 950 : s.includes('ester') ? 78 : 25);
  const conc = params.conc ?? params.concentration ?? params.molarity ?? params.ca ?? 0.5;
  const volAdded = params.vBase ?? params.volBase ?? params.volume ?? (15 + Math.sin(simTime * 0.7) * 10);

  // Estimate live pH cleanly
  let ph = 7.0;
  if (s.includes('titration') || s.includes('buffer')) {
    const eqVol = params.vAcid ?? 25;
    const ratio = volAdded / Math.max(1, eqVol);
    ph = Math.max(0.8, Math.min(13.2, 1.4 + 11.4 / (1 + Math.exp(-(ratio - 1) * 7.5))));
  } else if (s.includes('qualitative') || s.includes('halogen')) {
    ph = 5.4 + Math.sin(xPct * 0.06) * 2.5;
  } else if (s.includes('ester')) {
    ph = 2.6;
  } else if (s.includes('soap')) {
    ph = 10.6;
  } else if (s.includes('amino')) {
    ph = params.ph ?? 6.1;
  }

  // Fluid color linked to pH/sim type
  let fluidHex = '#38bdf8';
  if (s.includes('titration')) {
    fluidHex = ph >= 8.2 ? '#ec4899' : '#e0f2fe';
  } else if (s.includes('complex') || s.includes('galvanic') || s.includes('electrolysis')) {
    fluidHex = '#0284c7';
  } else if (s.includes('ester') || s.includes('soap')) {
    fluidHex = '#f59e0b';
  } else if (s.includes('halogen') || s.includes('qualitative')) {
    fluidHex = xPct > 55 ? '#eab308' : '#10b981';
  }

  const wave = Math.sin(simTime * 1.4 + xPct * 0.04) * 0.02;

  switch (toolId) {
    case 'ph_meter_digital': {
      const val = Math.max(0, Math.min(14, ph + wave * 2));
      return {
        valueText: `pH ${val.toFixed(2)}`,
        subLabel: val < 6.8 ? 'Acid' : val > 7.2 ? 'Bazơ' : 'Trung tính',
        numericValue: val,
        phValue: val,
        fluidHex
      };
    }
    case 'thermometer_chem': {
      const localT = baseTemp + Math.sin(simTime * 0.9) * 0.6 + (yPct > 65 ? 12 : 0);
      return {
        valueText: `${localT.toFixed(1)} °C`,
        subLabel: localT > 60 ? 'Gia nhiệt' : 'Nhiệt độ phòng',
        numericValue: localT,
        tempC: localT
      };
    }
    case 'balance_analytical': {
      const mass = (params.mass ?? params.mSolid ?? 4.82) + Math.max(0, Math.sin(simTime * 0.35) * 0.12);
      return {
        valueText: `${mass.toFixed(3)} g`,
        subLabel: 'Cân phân tích ±1mg',
        numericValue: mass
      };
    }
    case 'conductivity_probe': {
      const cond = Math.max(0.2, conc * 18.4 + Math.abs(7 - ph) * 3.1 + Math.sin(simTime * 1.5) * 0.4);
      return {
        valueText: `${cond.toFixed(1)} mS/cm`,
        subLabel: cond > 10 ? 'Điện li mạnh' : 'Điện li yếu',
        numericValue: cond
      };
    }
    case 'burette_50ml': {
      const v = Math.max(0, Math.min(50, volAdded));
      return {
        valueText: `${v.toFixed(2)} mL`,
        subLabel: 'Buret NaOH 0.1M',
        numericValue: v,
        fillRatio: 1 - v / 50,
        fluidHex
      };
    }
    case 'pipette_10ml': {
      return {
        valueText: '10.00 mL',
        subLabel: 'Định mức chuẩn',
        numericValue: 10,
        fillRatio: 0.78,
        fluidHex
      };
    }
    case 'erlenmeyer_flask': {
      const totalV = Math.round(25 + volAdded);
      return {
        valueText: `${totalV} mL`,
        subLabel: ph >= 8.2 ? 'Hồng nhạt' : 'Không màu',
        numericValue: totalV,
        phValue: ph,
        fluidHex,
        fillRatio: Math.min(0.85, totalV / 80)
      };
    }
    case 'beaker_250ml': {
      const v = Math.round(80 + conc * 60);
      return {
        valueText: `${v} mL`,
        subLabel: `${conc.toFixed(2)} M`,
        numericValue: v,
        fluidHex,
        fillRatio: Math.min(0.85, v / 250)
      };
    }
    case 'volumetric_flask': {
      return {
        valueText: `${conc.toFixed(2)} M`,
        subLabel: '100.0 mL chuẩn',
        numericValue: conc,
        fluidHex,
        fillRatio: 0.72
      };
    }
    case 'separatory_funnel': {
      const yieldPct = Math.round(62 + Math.sin(simTime * 0.5) * 8);
      return {
        valueText: `${yieldPct}% tách`,
        subLabel: '2 pha hữu cơ/nước',
        numericValue: yieldPct,
        fluidHex: '#f59e0b',
        fillRatio: 0.65
      };
    }
    case 'magnetic_hotplate': {
      const rpm = Math.round(350 + (params.speed ?? 1) * 180);
      return {
        valueText: `${Math.round(baseTemp)}°C · ${rpm}`,
        subLabel: 'Khuấy từ gia nhiệt',
        numericValue: rpm,
        tempC: baseTemp
      };
    }
    case 'bunsen_burner': {
      const flameT = Math.max(480, Math.round(baseTemp + 620 + Math.sin(simTime * 4) * 18));
      return {
        valueText: `${flameT} °C`,
        subLabel: s.includes('flame') ? 'Thử màu ion' : 'Ngọn lửa xanh',
        numericValue: flameT,
        flameIntensity: 0.85 + Math.sin(simTime * 7) * 0.15
      };
    }
    case 'reflux_condenser': {
      const coolT = 18.5 + Math.sin(simTime * 0.6) * 0.5;
      return {
        valueText: `${coolT.toFixed(1)} °C`,
        subLabel: 'Nước làm mát hồi lưu',
        numericValue: coolT,
        tempC: coolT
      };
    }
    case 'gas_syringe_100ml': {
      const gasVol = Math.min(100, Math.max(4, 18 + (simTime * 9) % 74));
      return {
        valueText: `${gasVol.toFixed(1)} mL`,
        subLabel: 'Khí thu được',
        numericValue: gasVol,
        fillRatio: gasVol / 100
      };
    }
    case 'voltmeter_galvanic': {
      const eCell = (params.eCell ?? 1.1) + Math.sin(simTime * 1.1) * 0.01;
      return {
        valueText: `${eCell >= 0 ? '+' : ''}${eCell.toFixed(2)} V`,
        subLabel: s.includes('electrolysis') ? 'Nguồn DC ngoài' : 'Suất điện động E°',
        numericValue: eCell
      };
    }
    case 'colorimeter_uv': {
      const abs = Math.min(2.4, Math.max(0.05, conc * 1.15 + Math.sin(simTime * 1.2) * 0.03));
      const nm = s.includes('complex') ? 610 : s.includes('titration') ? 553 : 460;
      return {
        valueText: `${abs.toFixed(3)} Abs`,
        subLabel: `λ = ${nm} nm`,
        numericValue: abs
      };
    }
    default:
      return {
        valueText: `${conc.toFixed(2)} M`,
        subLabel: 'Thiết bị hóa học',
        numericValue: conc
      };
  }
}
