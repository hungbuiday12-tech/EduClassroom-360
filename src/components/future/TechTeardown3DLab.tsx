import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Power,
  RotateCcw,
  Volume2,
  VolumeX,
  Wrench,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackgroundTheme } from '../../context/BackgroundContext';

interface TechTeardown3DLabProps {
  onEarnXP?: (xp: number) => void;
}

type DeviceId = 'desk_fan' | 'usbc_charger' | 'lithium_bms' | 'relay_traffic';
type VomMode = 'V' | 'R' | 'A';
type TestPointId = 'TP1' | 'TP2' | 'TP3' | 'TP4';

interface PartMeta {
  id: string;
  nameVi: string;
  nameEn: string;
  roleVi: string;
  roleEn: string;
  specs: string;
  explodeVec: [number, number, number];
}

interface TestPointSpec {
  id: TestPointId;
  partId: string;
  localOffset: [number, number, number];
  labelVi: string;
  labelEn: string;
}

interface VomTelemetry {
  V: string;
  R: string;
  A: string;
  noteVi: string;
  noteEn: string;
  faultyFlag?: boolean;
}

interface RepairChoice {
  id: string;
  labelVi: string;
  labelEn: string;
  correct: boolean;
  feedbackVi: string;
  feedbackEn: string;
}

interface FaultScenario {
  id: string;
  titleVi: string;
  titleEn: string;
  faultPartId: string;
  symptomVi: string;
  symptomEn: string;
  clueVi: string;
  clueEn: string;
  readings: Record<TestPointId, { broken: VomTelemetry; fixed: VomTelemetry }>;
  repairChoices: RepairChoice[];
}

interface DeviceSpec {
  id: DeviceId;
  titleVi: string;
  titleEn: string;
  ratedBadge: string;
  parts: PartMeta[];
  testPoints: TestPointSpec[];
  scenarios: FaultScenario[];
}

const DEVICES: DeviceSpec[] = [
  {
    id: 'desk_fan',
    titleVi: 'Quạt Điện Động Cơ AC',
    titleEn: 'AC Electric Fan Motor',
    ratedBadge: '220VAC · 55W',
    parts: [
      {
        id: 'front_grille',
        nameVi: 'Lồng Bảo Vệ Trước',
        nameEn: 'Front Safety Grille',
        roleVi: 'Chắn an toàn và hướng luồng gió hút xoáy ổn định.',
        roleEn: 'Safety guard directing axial intake airflow.',
        specs: 'Ø320mm · Thép sơn tĩnh điện',
        explodeVec: [0, 0, 2.1]
      },
      {
        id: 'fan_blades',
        nameVi: 'Cánh Quạt 4 Lá',
        nameEn: '4-Blade Rotor Impeller',
        roleVi: 'Tạo chênh áp đẩy gió nhờ góc nghiêng cánh 24°.',
        roleEn: 'Generates axial thrust via 24° pitched blades.',
        specs: '1420 RPM max · ABS cân bằng động',
        explodeVec: [0, 0, 1.35]
      },
      {
        id: 'motor_shaft',
        nameVi: 'Trục Rotor & Bạc Đạn',
        nameEn: 'Steel Shaft & Bearings',
        roleVi: 'Truyền mô-men quay từ lõi rotor lồng sóc ra cánh quạt.',
        roleEn: 'Transfers squirrel-cage rotor torque to impeller.',
        specs: 'Ø8mm · Thép tôi + Bạc đồng',
        explodeVec: [0, 0.25, 0.55]
      },
      {
        id: 'stator_coil',
        nameVi: 'Cuộn Dây Stator Đồng',
        nameEn: 'Copper Stator Winding',
        roleVi: 'Tạo từ trường quay lệch pha khi có dòng AC chạy qua.',
        roleEn: 'Generates rotating magnetic field across stator poles.',
        specs: '220V · R_cuộn ≈ 145 Ω',
        explodeVec: [0, 0, -0.1]
      },
      {
        id: 'thermal_fuse',
        nameVi: 'Cầu Chì Nhiệt 130°C',
        nameEn: '130°C Thermal Fuse',
        roleVi: 'Ngắt mạch tự động bảo vệ cháy cuộn đồng khi động cơ quá nhiệt.',
        roleEn: 'Sacrificial cutoff preventing coil meltdown above 130°C.',
        specs: '130°C · 2A · 250VAC',
        explodeVec: [-1.15, 0.7, -0.1]
      },
      {
        id: 'start_capacitor',
        nameVi: 'Tụ Đề Khởi Động 2.5µF',
        nameEn: '2.5µF Run/Start Capacitor',
        roleVi: 'Tạo độ lệch pha 90° cho cuộn đề giúp rotor khởi động quay.',
        roleEn: 'Shifts auxiliary winding phase by ~90° for starting torque.',
        specs: '2.5 µF · 400VAC CBB61',
        explodeVec: [1.2, -0.55, -0.45]
      },
      {
        id: 'speed_switch',
        nameVi: 'Cụm Phím Số & Dây Nguồn',
        nameEn: 'Speed Switch & AC Cord',
        roleVi: 'Đóng ngắt 3 cấp số gió (Thấp - Trung - Cao).',
        roleEn: 'Selects tap windings for 3 airflow speeds.',
        specs: '3 Cấp · 220V 50Hz',
        explodeVec: [0, -1.35, 0.3]
      },
      {
        id: 'rear_housing',
        nameVi: 'Vỏ Động Cơ & Khe Tản Nhiệt',
        nameEn: 'Rear Motor Vent Shell',
        roleVi: 'Bảo vệ stator và hút gió làm mát cuộn đồng phía sau.',
        roleEn: 'Protects stator windings and channels cooling air.',
        specs: 'ABS chịu nhiệt 120°C',
        explodeVec: [0, 0, -1.65]
      }
    ],
    testPoints: [
      { id: 'TP1', partId: 'speed_switch', localOffset: [0.35, 0.15, 0.15], labelVi: 'TP1: Đầu vào AC 220V', labelEn: 'TP1: AC Mains In' },
      { id: 'TP2', partId: 'thermal_fuse', localOffset: [0, 0.18, 0.12], labelVi: 'TP2: Sau Cầu Chì Nhiệt', labelEn: 'TP2: Post-Thermal Fuse' },
      { id: 'TP3', partId: 'stator_coil', localOffset: [0, 0.55, 0.08], labelVi: 'TP3: Cuộn Chính Stator', labelEn: 'TP3: Main Stator Tap' },
      { id: 'TP4', partId: 'start_capacitor', localOffset: [0.22, 0.18, 0.14], labelVi: 'TP4: Cực Tụ Đề 2.5µF', labelEn: 'TP4: Start Cap Lead' }
    ],
    scenarios: [
      {
        id: 'fan_fuse_blown',
        titleVi: 'Ca #1: Quạt Mất Nguồn Hoàn Toàn',
        titleEn: 'Case #1: Dead Fan — No Hum',
        faultPartId: 'thermal_fuse',
        symptomVi: 'Cắm điện bấm số 1-2-3 nhưng quạt đứng im hoàn toàn, không nghe tiếng ù.',
        symptomEn: 'AC plugged in and speed pressed, yet motor stays completely silent.',
        clueVi: 'Gợi ý: Đo VOM tại TP1 và TP2 xem điện áp có đi qua Cầu Chì Nhiệt vào cuộn Stator không.',
        clueEn: 'Hint: Probe TP1 vs TP2 to check voltage and continuity across the Thermal Fuse.',
        readings: {
          TP1: {
            broken: { V: '220.4 VAC', R: '0.2 Ω', A: '0.00 A', noteVi: 'Có điện lưới 220V tại công tắc', noteEn: '220V mains present at switch' },
            fixed: { V: '220.4 VAC', R: '0.2 Ω', A: '0.24 A', noteVi: 'Nguồn 220V cấp ổn định', noteEn: 'Stable 220V supply' }
          },
          TP2: {
            broken: { V: '0.00 VAC', R: '∞ Ω (OL)', A: '0.00 A', noteVi: 'HỞ MẠCH! Cầu chì nhiệt đứt hoàn toàn', noteEn: 'OPEN! Thermal fuse blown', faultyFlag: true },
            fixed: { V: '219.8 VAC', R: '0.4 Ω', A: '0.24 A', noteVi: 'Thông mạch hoàn hảo qua cầu chì mới', noteEn: 'Continuity restored' }
          },
          TP3: {
            broken: { V: '0.00 VAC', R: '146 Ω', A: '0.00 A', noteVi: 'Cuộn đồng Stator còn tốt (146Ω) nhưng mất áp', noteEn: 'Stator winding intact (146Ω), no voltage' },
            fixed: { V: '219.5 VAC', R: '146 Ω', A: '0.24 A', noteVi: 'Cuộn Stator tạo từ trường quay tốt', noteEn: 'Stator energized normally' }
          },
          TP4: {
            broken: { V: '0.00 VAC', R: '2.48 µF OK', A: '0.00 A', noteVi: 'Tụ đề còn tốt, chưa có áp cấp', noteEn: 'Capacitor healthy, unpowered' },
            fixed: { V: '286 VAC', R: '2.50 µF OK', A: '0.08 A', noteVi: 'Pha lệch tụ đề hoạt động chuẩn', noteEn: 'Phase-shift normal' }
          }
        },
        repairChoices: [
          {
            id: 'fuse_130_2a',
            labelVi: 'Cầu chì nhiệt 130°C · 2A 250V',
            labelEn: 'Thermal Fuse 130°C · 2A 250V',
            correct: true,
            feedbackVi: 'Chuẩn kỹ thuật! Cầu chì 130°C bảo vệ cuộn stator đúng ngưỡng chịu nhiệt.',
            feedbackEn: 'Exact match! 130°C 2A thermal cutoff protects the stator winding.'
          },
          {
            id: 'fuse_wire_jump',
            labelVi: 'Đấu tắt bằng dây đồng trần (nguy hiểm)',
            labelEn: 'Bypass with bare copper wire (unsafe)',
            correct: false,
            feedbackVi: 'Không an toàn! Đấu tắt mất chức năng ngắt nhiệt, dễ gây cháy cuộn dây.',
            feedbackEn: 'Unsafe bypass! Removing thermal protection risks coil fire.'
          },
          {
            id: 'cap_25uf',
            labelVi: 'Thay Tụ đề 2.5µF 400V',
            labelEn: 'Replace 2.5µF Start Capacitor',
            correct: false,
            feedbackVi: 'Tụ đề vẫn đo được 2.48µF bình thường, nguyên nhân chính là hở mạch ở TP2.',
            feedbackEn: 'Capacitor already measures OK; open circuit is at TP2 thermal fuse.'
          }
        ]
      },
      {
        id: 'fan_cap_dead',
        titleVi: 'Ca #2: Quạt Ù Nhẹ Nhưng Không Tự Quay',
        titleEn: 'Case #2: Motor Hums — Blades Won’t Spin',
        faultPartId: 'start_capacitor',
        symptomVi: 'Cấp điện nghe tiếng "ù ù" từ motor nhưng cánh quạt đứng yên, lấy tay xoay mồi mới quay chậm.',
        symptomEn: 'Motor hums quietly but blades stay still unless nudged by hand.',
        clueVi: 'Gợi ý: Cuộn Stator vẫn có điện áp 220V ở TP3, hãy kiểm tra thông số Tụ Đề tại TP4.',
        clueEn: 'Hint: Stator is powered at TP3; inspect phase-shift Start Capacitor at TP4.',
        readings: {
          TP1: {
            broken: { V: '220.2 VAC', R: '0.2 Ω', A: '0.18 A', noteVi: 'Công tắc có dòng 0.18A vào cuộn chính', noteEn: 'Mains drawing 0.18A locked-rotor' },
            fixed: { V: '220.2 VAC', R: '0.2 Ω', A: '0.24 A', noteVi: 'Dòng tải chuẩn 0.24A', noteEn: 'Normal 0.24A load' }
          },
          TP2: {
            broken: { V: '219.9 VAC', R: '0.4 Ω', A: '0.18 A', noteVi: 'Cầu chì nhiệt còn nguyên', noteEn: 'Thermal fuse intact' },
            fixed: { V: '219.9 VAC', R: '0.4 Ω', A: '0.24 A', noteVi: 'Cầu chì dẫn tốt', noteEn: 'Fuse intact' }
          },
          TP3: {
            broken: { V: '219.4 VAC', R: '145 Ω', A: '0.18 A', noteVi: 'Cuộn chính có điện nhưng thiếu từ trường quay', noteEn: 'Main winding powered, lacking rotation torque' },
            fixed: { V: '219.4 VAC', R: '145 Ω', A: '0.24 A', noteVi: 'Từ trường quay ổn định', noteEn: 'Smooth rotating field' }
          },
          TP4: {
            broken: { V: '12.0 VAC', R: '0.08 µF (HỎNG)', A: '0.00 A', noteVi: 'TỤ KHÔ SỤT DUNG! Không đủ lệch pha khởi động', noteEn: 'DRIED CAPACITOR (0.08µF)! No starting phase shift', faultyFlag: true },
            fixed: { V: '286 VAC', R: '2.50 µF OK', A: '0.08 A', noteVi: 'Đủ 2.5µF tạo mô-men quay cực khỏe', noteEn: 'Full 2.5µF starting torque restored' }
          }
        },
        repairChoices: [
          {
            id: 'cap_25_400v',
            labelVi: 'Tụ CBB61 2.5µF · 400VAC (Chuẩn)',
            labelEn: 'CBB61 2.5µF · 400VAC Capacitor',
            correct: true,
            feedbackVi: 'Tuyệt vời! Tụ 2.5µF 400V khôi phục độ lệch pha giúp rotor tự tăng tốc ngay lập tức.',
            feedbackEn: 'Correct! 2.5µF 400VAC restores 90° phase shift for immediate spin-up.'
          },
          {
            id: 'cap_100v_dc',
            labelVi: 'Tụ hóa 100µF 16VDC (Sai loại)',
            labelEn: '100µF 16VDC Electrolytic (Wrong)',
            correct: false,
            feedbackVi: 'Nguy hiểm! Tụ hóa phân cực DC sẽ nổ ngay khi đấu vào mạch AC 220V.',
            feedbackEn: 'Dangerous! Polarized DC cap explodes under 220VAC.'
          },
          {
            id: 'fuse_replace',
            labelVi: 'Thay Cầu Chì Nhiệt',
            labelEn: 'Replace Thermal Fuse',
            correct: false,
            feedbackVi: 'TP2 đã có 219.9V chứng tỏ cầu chì nhiệt không bị đứt.',
            feedbackEn: 'TP2 already measures 219.9V, so the thermal fuse is healthy.'
          }
        ]
      }
    ]
  },
  {
    id: 'usbc_charger',
    titleVi: 'Bộ Sạc Nhanh USB-C GaN 65W',
    titleEn: 'USB-C 65W GaN Fast Charger',
    ratedBadge: '220V → 20V 3.25A',
    parts: [
      {
        id: 'top_shell',
        nameVi: 'Nắp Vỏ Chống Cháy Trên',
        nameEn: 'Top Flame-Retardant Shell',
        roleVi: 'Cách điện toàn khối sơ cấp-thứ cấp và tản nhiệt đối lưu.',
        roleEn: 'Insulates high-voltage primary & diffuses waste heat.',
        specs: 'PC+ABS UL94-V0',
        explodeVec: [0, 1.55, 0]
      },
      {
        id: 'pcb_board',
        nameVi: 'Bo Mạch PCB FR-4 Cách Ly',
        nameEn: 'Isolated FR-4 Main PCB',
        roleVi: 'Nền dẫn mạch với khe cắt cách ly cao áp ≥ 6.4mm.',
        roleEn: 'Carries copper traces with ≥6.4mm isolation creepage slot.',
        specs: 'FR-4 2oz Copper',
        explodeVec: [0, -0.15, 0]
      },
      {
        id: 'ac_fuse_bridge',
        nameVi: 'Cầu Chì & Cầu Chỉnh Lưu',
        nameEn: 'Input Fuse & Bridge Rectifier',
        roleVi: 'Bảo vệ quá dòng đầu vào và chỉnh lưu 220VAC thành 310VDC.',
        roleEn: 'Protects AC input and rectifies mains into ~310V DC bus.',
        specs: 'Fuse 3.15A · Bridge MB10F',
        explodeVec: [-1.45, 0.35, 0.15]
      },
      {
        id: 'bulk_capacitor',
        nameVi: 'Tụ Lọc Nguồn Chính 400V',
        nameEn: '400V 68µF Bulk Capacitor',
        roleVi: 'San phẳng điện áp DC 310V cấp cho tầng chuyển mạch GaN.',
        roleEn: 'Smooths rectified 310V DC bus for GaN switching stage.',
        specs: '400VDC · 68µF 105°C Low-ESR',
        explodeVec: [-0.65, 1.0, -0.55]
      },
      {
        id: 'flyback_transformer',
        nameVi: 'Biến Áp Xung Cao Tần',
        nameEn: 'High-Frequency Flyback Transformer',
        roleVi: 'Hạ áp từ 310VDC xuống 20VDC ở tần số 120kHz kèm cách ly quang.',
        roleEn: 'Steps down 310V pulses at 120kHz with galvanic isolation.',
        specs: '120kHz · Lõi Ferit RM8',
        explodeVec: [0.15, 0.95, 0.2]
      },
      {
        id: 'gan_mosfet',
        nameVi: 'Chip GaN MOSFET & Tản Nhiệt',
        nameEn: 'GaN Power FET & Heatsink',
        roleVi: 'Đóng cắt xung tốc độ siêu cao hiệu suất đạt 93%.',
        roleEn: 'Switches primary bus at ultra-low loss (~93% efficiency).',
        specs: '650V GaN · Tản nhôm CNC',
        explodeVec: [0.55, 0.65, -0.95]
      },
      {
        id: 'usbc_port',
        nameVi: 'Cổng USB-C PD & LED Báo',
        nameEn: 'USB-C PD Port & Status LED',
        roleVi: 'Giao tiếp chip PD thương lượng áp ra 5V / 9V / 20V.',
        roleEn: 'Negotiates USB-PD profiles (5V/9V/20V) with device.',
        specs: 'USB-C 20V 3.25A Max',
        explodeVec: [1.55, 0.45, 0]
      },
      {
        id: 'bottom_shell',
        nameVi: 'Đế Vỏ & Chân Cắm AC',
        nameEn: 'Bottom Shell & AC Prongs',
        roleVi: 'Tiếp nhận điện lưới và cố định bo mạch chắc chắn.',
        roleEn: 'Houses AC mains prongs and anchors PCB rails.',
        specs: 'Đồng thau mạ niken',
        explodeVec: [0, -1.25, 0]
      }
    ],
    testPoints: [
      { id: 'TP1', partId: 'ac_fuse_bridge', localOffset: [-0.25, 0.2, 0.15], labelVi: 'TP1: Sau Cầu Chì AC', labelEn: 'TP1: Post AC Fuse' },
      { id: 'TP2', partId: 'bulk_capacitor', localOffset: [0, 0.42, 0.1], labelVi: 'TP2: Bus DC 310V (Tụ chính)', labelEn: 'TP2: 310V DC Bus' },
      { id: 'TP3', partId: 'flyback_transformer', localOffset: [0.2, 0.3, 0.15], labelVi: 'TP3: Cuộn Thứ Cấp Biến Áp', labelEn: 'TP3: Secondary Tap' },
      { id: 'TP4', partId: 'usbc_port', localOffset: [0.1, 0.25, 0.12], labelVi: 'TP4: Ngõ Ra VBUS USB-C', labelEn: 'TP4: USB-C VBUS Out' }
    ],
    scenarios: [
      {
        id: 'charger_bulged_cap',
        titleVi: 'Ca #1: Phồng Tụ Lọc Cao Áp — Sạc Mất Áp Ra',
        titleEn: 'Case #1: Bulged 400V Cap — No USB-C Output',
        faultPartId: 'bulk_capacitor',
        symptomVi: 'Cắm sạc không lên nguồn, đèn LED cổng USB-C tắt ngấm, điện thoại không báo nhận sạc.',
        symptomEn: 'Charger stays dark with 0V on USB-C port; phone shows no charging.',
        clueVi: 'Gợi ý: Quan sát đỉnh Tụ lọc 400V (bị phồng rộp) và kiểm tra áp Bus DC tại TP2.',
        clueEn: 'Hint: Inspect the 400V Bulk Capacitor top vent and probe DC Bus at TP2.',
        readings: {
          TP1: {
            broken: { V: '220.0 VAC', R: '0.3 Ω', A: '0.02 A', noteVi: 'Cầu chì đầu vào còn tốt', noteEn: 'Input fuse healthy' },
            fixed: { V: '220.0 VAC', R: '0.3 Ω', A: '0.31 A', noteVi: 'Dòng tải sơ cấp ổn định', noteEn: 'Primary draw normal' }
          },
          TP2: {
            broken: { V: '38.5 VDC (SỤT ÁP)', R: '∞ Ω ESR HỎNG', A: '0.01 A', noteVi: 'TỤ PHỒNG KHÔ! Áp bus 310V tụt xuống 38.5V', noteEn: 'FAILED CAP! 310V bus collapsed to 38.5V', faultyFlag: true },
            fixed: { V: '311.2 VDC', R: '0.8 Ω ESR OK', A: '0.21 A', noteVi: 'Bus DC 311V phẳng mịn chuẩn thiết kế', noteEn: 'Clean 311V DC rail' }
          },
          TP3: {
            broken: { V: '0.00 VDC', R: '1.2 Ω', A: '0.00 A', noteVi: 'IC GaN khóa bảo vệ thiếu áp UVLO', noteEn: 'GaN controller in UVLO lock' },
            fixed: { V: '20.1 VDC', R: '1.2 Ω', A: '3.25 A', noteVi: 'Biến áp đóng cắt 120kHz ổn định', noteEn: '120kHz switching healthy' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '12.4 kΩ', A: '0.00 A', noteVi: 'Ngõ ra USB-C mất điện hoàn toàn', noteEn: '0.00V output at USB-C' },
            fixed: { V: '20.00 VDC', R: '12.4 kΩ', A: '3.25 A', noteVi: 'Xuất chuẩn PD 20V · 65W!', noteEn: 'PD 20V 65W Active!' }
          }
        },
        repairChoices: [
          {
            id: 'cap_400v_68uf',
            labelVi: 'Tụ Hóa 400V · 68µF 105°C Low-ESR',
            labelEn: '400V · 68µF 105°C Low-ESR Cap',
            correct: true,
            feedbackVi: 'Chính xác! Tụ 400V Low-ESR chịu được áp đỉnh 311VDC và xung cao tần GaN.',
            feedbackEn: 'Correct! 400V Low-ESR handles 311VDC bus and high-frequency ripple.'
          },
          {
            id: 'cap_25v_68uf',
            labelVi: 'Tụ Hóa 25V · 68µF (Quá thấp áp)',
            labelEn: '25V · 68µF Cap (Under-rated)',
            correct: false,
            feedbackVi: 'Sai mức chịu áp! Đặt tụ 25V vào đường 311VDC sẽ đánh thủng tức thì.',
            feedbackEn: 'Under-rated! A 25V capacitor fails violently on a 311V bus.'
          },
          {
            id: 'replace_usbc',
            labelVi: 'Thay Cổng USB-C',
            labelEn: 'Replace USB-C Connector',
            correct: false,
            feedbackVi: 'Áp Bus sơ cấp TP2 đã sụt xuống 38.5V trước khi tới tầng thứ cấp.',
            feedbackEn: 'Primary bus at TP2 already dropped to 38.5V upstream.'
          }
        ]
      },
      {
        id: 'charger_fuse_open',
        titleVi: 'Ca #2: Cháy Cầu Chì Sơ Cấp Sau Sét Lan Truyền',
        titleEn: 'Case #2: Surge-Blown Primary Fuse',
        faultPartId: 'ac_fuse_bridge',
        symptomVi: 'Sau khi ổ cắm bị chập nhẹ, bộ sạc im lặng hoàn toàn dù tụ chính chưa phồng.',
        symptomEn: 'After a wall-outlet spike, charger went dead while capacitors look visually intact.',
        clueVi: 'Gợi ý: Kiểm tra thông mạch tại TP1 (ngay sau cầu chì AC đầu vào).',
        clueEn: 'Hint: Probe resistance and AC voltage at TP1 right after the input fuse.',
        readings: {
          TP1: {
            broken: { V: '0.00 VAC', R: '∞ Ω (ĐỨT)', A: '0.00 A', noteVi: 'ĐỨT CẦU CHÌ 3.15A! Mạch sơ cấp bị ngắt hoàn toàn', noteEn: 'BLOWN 3.15A FUSE! Input open circuit', faultyFlag: true },
            fixed: { V: '220.1 VAC', R: '0.2 Ω', A: '0.31 A', noteVi: 'Thông mạch sơ cấp hoàn hảo', noteEn: 'Input fuse conducting' }
          },
          TP2: {
            broken: { V: '0.00 VDC', R: '1.1 Ω OK', A: '0.00 A', noteVi: 'Tụ 400V còn tốt, không bị chập', noteEn: 'Bulk cap healthy, unpowered' },
            fixed: { V: '311.0 VDC', R: '0.9 Ω OK', A: '0.21 A', noteVi: 'Bus DC 311V ổn định', noteEn: '311V rail normal' }
          },
          TP3: {
            broken: { V: '0.00 VDC', R: '1.2 Ω', A: '0.00 A', noteVi: 'Biến áp chưa được cấp xung', noteEn: 'No primary switching' },
            fixed: { V: '20.1 VDC', R: '1.2 Ω', A: '3.25 A', noteVi: 'Biến áp thứ cấp hoạt động chuẩn', noteEn: 'Transformer active' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '12.4 kΩ', A: '0.00 A', noteVi: 'Không có điện áp USB-C', noteEn: '0V out' },
            fixed: { V: '20.00 VDC', R: '12.4 kΩ', A: '3.25 A', noteVi: 'Đạt chuẩn sạc nhanh 65W', noteEn: '65W PD ready' }
          }
        },
        repairChoices: [
          {
            id: 'fuse_315a_250v',
            labelVi: 'Cầu chì chậm T3.15A · 250VAC',
            labelEn: 'Slow-Blow Fuse T3.15A · 250VAC',
            correct: true,
            feedbackVi: 'Chuẩn xác! Cầu chì chậm 3.15A chịu được dòng nạp tụ ban đầu mà vẫn bảo vệ quá tải.',
            feedbackEn: 'Spot on! Slow-blow T3.15A absorbs inrush current while guarding against faults.'
          },
          {
            id: 'fuse_30a_auto',
            labelVi: 'Cầu chì ô tô 30A (Quá dòng)',
            labelEn: '30A Automotive Fuse (Too High)',
            correct: false,
            feedbackVi: 'Dòng định mức 30A quá lớn, không bảo vệ được mạch GaN 65W khi chạm chập.',
            feedbackEn: '30A rating is far too high to protect a 65W primary stage.'
          },
          {
            id: 'replace_gan',
            labelVi: 'Thay Chip GaN MOSFET',
            labelEn: 'Replace GaN MOSFET',
            correct: false,
            feedbackVi: 'Mạch bị đứt ngay tại TP1 (cầu chì vào) trước khi tới chip GaN.',
            feedbackEn: 'Fault already isolated upstream at TP1 AC input fuse.'
          }
        ]
      }
    ]
  },
  {
    id: 'lithium_bms',
    titleVi: 'Khối Pin Lithium 3S & Mạch BMS',
    titleEn: '3S Lithium Pack & BMS Protection',
    ratedBadge: '12.6V · 30A BMS',
    parts: [
      {
        id: 'top_cover',
        nameVi: 'Nắp Bảo Vệ Polycarbonate',
        nameEn: 'Polycarbonate Protective Lid',
        roleVi: 'Chống va đập và nhìn xuyên bảng LED báo trạng thái BMS.',
        roleEn: 'Impact shield with inspection window for BMS LEDs.',
        specs: 'PC trong suốt 2mm',
        explodeVec: [0, 1.5, 0]
      },
      {
        id: 'cell_pack',
        nameVi: 'Cụm 3 Cell 18650 (B1·B2·B3)',
        nameEn: '3x 18650 Cell Array + Nickel Strips',
        roleVi: 'Lưu trữ năng lượng 3 cell nối tiếp đạt áp danh định 11.1–12.6V.',
        roleEn: '3-series Lithium-Ion cells providing 11.1–12.6V bank.',
        specs: '3S · 3000mAh · 3.95V/cell',
        explodeVec: [-1.1, 0.25, 0]
      },
      {
        id: 'bms_pcb',
        nameVi: 'Bo Mạch Cân Bằng BMS 3S',
        nameEn: '3S Balance & Protection PCB',
        roleVi: 'Giám sát từng cell B1/B2/B3 và dẫn dòng xả qua thanh đồng dày.',
        roleEn: 'Monitors B1/B2/B3 sense taps and carries high discharge current.',
        specs: '3S 30A · Balance 4.20V',
        explodeVec: [0, 0.1, 0]
      },
      {
        id: 'ntc_sensor',
        nameVi: 'Đầu Dò Nhiệt Độ NTC 10kΩ',
        nameEn: '10kΩ NTC Thermistor Probe',
        roleVi: 'Đo nhiệt độ cell pin; ngắt xả nếu pin quá nóng >60°C.',
        roleEn: 'Senses cell pack temperature to cut off above 60°C.',
        specs: 'NTC 10kΩ @ 25°C · β=3950',
        explodeVec: [-0.25, 0.95, 0.95]
      },
      {
        id: 'bms_ic',
        nameVi: 'IC Giám Sát Pin BM3451',
        nameEn: 'BM3451 Voltage Supervisor IC',
        roleVi: 'So sánh ngưỡng quá sạc/quá xả và xuất lệnh đóng mở MOSFET.',
        roleEn: 'Detects overcharge/over-discharge and drives gate pins.',
        specs: 'TSSOP-16 · 3S Sense',
        explodeVec: [0.4, 0.9, -0.75]
      },
      {
        id: 'mosfet_bank',
        nameVi: 'Cặp MOSFET Xả Công Suất',
        nameEn: 'Dual Power Discharge MOSFETs',
        roleVi: 'Công tắc bán dẫn đóng ngắt cực âm P- chịu tải tới 30A.',
        roleEn: 'Low-Rds(on) semiconductor switches gating P- output.',
        specs: 'Dual N-CH 30V 60A',
        explodeVec: [0.95, 0.75, 0.55]
      },
      {
        id: 'xt60_port',
        nameVi: 'Đầu Cắm Tải XT60 & Dây Silicone',
        nameEn: 'XT60 Power Output & Leads',
        roleVi: 'Truyền dòng lớn ra thiết bị tải với tiếp điểm mạ vàng.',
        roleEn: 'Gold-plated high-current output connector.',
        specs: 'XT60 · 12AWG Silicone',
        explodeVec: [1.55, 0.35, 0]
      },
      {
        id: 'bottom_tray',
        nameVi: 'Khay Đế Nhôm Tản Nhiệt',
        nameEn: 'Aluminum Heat-Spreader Tray',
        roleVi: 'Giải nhiệt cho cặp MOSFET công suất và đỡ toàn khối pin.',
        roleEn: 'Draws heat from MOSFETs and stabilizes the pack.',
        specs: 'Nhôm 6061 Anode',
        explodeVec: [0, -1.2, 0]
      }
    ],
    testPoints: [
      { id: 'TP1', partId: 'cell_pack', localOffset: [0.15, 0.42, 0.2], labelVi: 'TP1: Tổng Áp 3 Cell (B+)', labelEn: 'TP1: Raw 3S Pack (B+)' },
      { id: 'TP2', partId: 'ntc_sensor', localOffset: [0, 0.18, 0.1], labelVi: 'TP2: Trở Cảm Biến NTC', labelEn: 'TP2: NTC Sensor Pin' },
      { id: 'TP3', partId: 'mosfet_bank', localOffset: [0, 0.25, 0.1], labelVi: 'TP3: Cực Gate MOSFET', labelEn: 'TP3: MOSFET Gate Drive' },
      { id: 'TP4', partId: 'xt60_port', localOffset: [0.15, 0.22, 0.12], labelVi: 'TP4: Ngõ Ra XT60 (P+/P-)', labelEn: 'TP4: XT60 Output Rail' }
    ],
    scenarios: [
      {
        id: 'bms_mosfet_burned',
        titleVi: 'Ca #1: Pin Đủ Áp Nhưng Cổng XT60 Mất Điện',
        titleEn: 'Case #1: Cells Charged — XT60 Output Dead',
        faultPartId: 'mosfet_bank',
        symptomVi: 'Cả 3 cell pin đều còn đầy điện (~11.85V) nhưng đo cổng XT60 lại về 0.00V, mạch không xả được.',
        symptomEn: 'All 3 cells hold 11.85V combined, yet XT60 terminal outputs 0.00V.',
        clueVi: 'Gợi ý: Kiểm tra TP1 (tổng cell) và TP3/TP4 xem cặp MOSFET công suất có đang bị chết hở mạch không.',
        clueEn: 'Hint: Compare TP1 pack voltage with TP3/TP4 across the Power MOSFET bank.',
        readings: {
          TP1: {
            broken: { V: '11.85 VDC', R: '0.02 Ω', A: '0.00 A', noteVi: '3 Cell 18650 khỏe (3.95V/cell)', noteEn: '3S cells balanced at 11.85V' },
            fixed: { V: '11.85 VDC', R: '0.02 Ω', A: '4.20 A', noteVi: 'Khối pin cấp dòng tải 4.2A ổn định', noteEn: 'Supplying 4.2A cleanly' }
          },
          TP2: {
            broken: { V: '2.48 VDC', R: '10.0 kΩ OK', A: '0.00 A', noteVi: 'Nhiệt độ phòng 25°C chuẩn (NTC 10kΩ)', noteEn: 'NTC reads healthy 10kΩ (25°C)' },
            fixed: { V: '2.48 VDC', R: '10.0 kΩ OK', A: '0.00 A', noteVi: 'Nhiệt độ an toàn 25°C', noteEn: 'Safe 25°C thermal' }
          },
          TP3: {
            broken: { V: '11.6 VDC (MẤT DẪN)', R: '∞ Ω D-S HỞ', A: '0.00 A', noteVi: 'CHÁY MOSFET XẢ! Gate có lệnh nhưng Drain-Source đứt hoàn toàn', noteEn: 'OPEN MOSFET! Gate driven yet Drain-Source dead', faultyFlag: true },
            fixed: { V: '11.6 VDC', R: '0.005 Ω ON', A: '4.20 A', noteVi: 'MOSFET dẫn bão hòa Rds ≈ 5mΩ', noteEn: 'MOSFET saturated at 5mΩ' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '∞ Ω', A: '0.00 A', noteVi: 'Ngõ ra XT60 bị cô lập bởi MOSFET hỏng', noteEn: 'XT60 isolated (0.00V)' },
            fixed: { V: '11.85 VDC', R: '0.03 Ω', A: '4.20 A', noteVi: 'Ngõ ra XT60 đủ 11.85V!', noteEn: 'XT60 Live 11.85V!' }
          }
        },
        repairChoices: [
          {
            id: 'mosfet_30v_60a',
            labelVi: 'Cặp N-CH Power MOSFET 30V 60A',
            labelEn: 'Dual N-CH Power MOSFET 30V 60A',
            correct: true,
            feedbackVi: 'Chuẩn kỹ thuật! MOSFET nội trở thấp 5mΩ khôi phục đường xả 30A cho XT60.',
            feedbackEn: 'Correct! Low-Rds(on) 30V 60A MOSFET restores full 30A output.'
          },
          {
            id: 'ntc_sensor_pick',
            labelVi: 'Thay Đầu Dò Nhiệt NTC 10kΩ',
            labelEn: 'Replace 10kΩ NTC Thermistor',
            correct: false,
            feedbackVi: 'TP2 đã đo được đúng 10.0kΩ, cảm biến nhiệt không hề bị lỗi.',
            feedbackEn: 'TP2 already reads 10.0kΩ; the NTC sensor is working properly.'
          },
          {
            id: 'cell_replace',
            labelVi: 'Thay Cụm 3 Cell 18650',
            labelEn: 'Replace 3x 18650 Cells',
            correct: false,
            feedbackVi: 'Cả 3 cell đang ở mức 11.85V rất khỏe, lỗi nằm ở MOSFET ngắt dòng tại TP3.',
            feedbackEn: 'Cells are already at 11.85V; fault is at TP3 MOSFET switch.'
          }
        ]
      },
      {
        id: 'bms_ntc_open',
        titleVi: 'Ca #2: Đứt Dây Cảm Biến Nhiệt NTC — BMS Báo Lỗi Quá Nhiệt Giả',
        titleEn: 'Case #2: Open NTC — False Thermal Lockout',
        faultPartId: 'ntc_sensor',
        symptomVi: 'Khối pin nguội lạnh nhưng BMS khóa ngõ ra không cho sạc/xả do nhận sai nhiệt độ.',
        symptomEn: 'Pack is cool to the touch, yet BMS refuses to output voltage.',
        clueVi: 'Gợi ý: Chuyển VOM sang chế độ Ω và đo TP2 của cảm biến NTC.',
        clueEn: 'Hint: Switch VOM to Ω and measure TP2 across the NTC thermistor.',
        readings: {
          TP1: {
            broken: { V: '11.85 VDC', R: '0.02 Ω', A: '0.00 A', noteVi: 'Cell pin đủ áp 11.85V', noteEn: 'Cells charged (11.85V)' },
            fixed: { V: '11.85 VDC', R: '0.02 Ω', A: '4.20 A', noteVi: 'Cấp tải ổn định', noteEn: 'Normal output' }
          },
          TP2: {
            broken: { V: '4.98 VDC', R: '∞ Ω (ĐỨT NTC)', A: '0.00 A', noteVi: 'ĐỨT CẢM BIẾN NTC! Điện trở hở mạch khiến IC khóa nhiệt', noteEn: 'OPEN NTC! Infinite resistance triggers thermal lock', faultyFlag: true },
            fixed: { V: '2.48 VDC', R: '10.0 kΩ OK', A: '0.00 A', noteVi: 'Điện trở NTC chuẩn 10.0kΩ — Mở khóa BMS!', noteEn: '10.0kΩ restored — BMS unlocked!' }
          },
          TP3: {
            broken: { V: '0.00 VDC (KHÓA)', R: '12 mΩ', A: '0.00 A', noteVi: 'IC BM3451 ngắt áp Gate để bảo vệ pin', noteEn: 'Supervisor cutting Gate drive due to NTC fault' },
            fixed: { V: '11.6 VDC', R: '5 mΩ', A: '4.20 A', noteVi: 'Gate MOSFET mở thông hoàn toàn', noteEn: 'MOSFET Gate enabled' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '∞ Ω', A: '0.00 A', noteVi: 'XT60 bị khóa an toàn', noteEn: 'XT60 locked' },
            fixed: { V: '11.85 VDC', R: '0.03 Ω', A: '4.20 A', noteVi: 'Xuất điện áp chuẩn 11.85V', noteEn: '11.85V active' }
          }
        },
        repairChoices: [
          {
            id: 'ntc_10k_3950',
            labelVi: 'Nhiệt điện trở NTC 10kΩ (β=3950)',
            labelEn: 'NTC Thermistor 10kΩ (β=3950)',
            correct: true,
            feedbackVi: 'Tuyệt vời! Điện trở 10kΩ ở 25°C giúp IC BM3451 giải phóng khóa bảo vệ ngay lập tức.',
            feedbackEn: 'Exact spec! 10kΩ @ 25°C clears the false thermal fault.'
          },
          {
            id: 'res_10ohm',
            labelVi: 'Điện trở thường 10Ω (Quá nhỏ)',
            labelEn: '10Ω Fixed Resistor (Wrong)',
            correct: false,
            feedbackVi: '10Ω khiến mạch tưởng pin đang nóng >100°C và vẫn tiếp tục khóa!',
            feedbackEn: '10Ω simulates extreme >100°C overheat and keeps BMS locked.'
          },
          {
            id: 'mosfet_swap',
            labelVi: 'Thay Cặp MOSFET',
            labelEn: 'Replace MOSFET Bank',
            correct: false,
            feedbackVi: 'Cổng Gate tại TP3 đang 0V vì IC cố tình khóa theo tín hiệu lỗi ở TP2.',
            feedbackEn: 'TP3 Gate is 0V intentionally because TP2 NTC failed open.'
          }
        ]
      }
    ]
  },
  {
    id: 'relay_traffic',
    titleVi: 'Bo Mạch Điều Khiển Relay Công Nghiệp',
    titleEn: 'Industrial 12V Relay & Signal Board',
    ratedBadge: '12VDC · 10A RELAY',
    parts: [
      {
        id: 'acrylic_lid',
        nameVi: 'Nắp Mica Bảo Vệ Trong Suốt',
        nameEn: 'Clear Acrylic Enclosure Lid',
        roleVi: 'Che bụi công nghiệp và cho phép quan sát trực tiếp cơ cấu rơ-le.',
        roleEn: 'Dust shield allowing clear view of mechanical relay contacts.',
        specs: 'PMMA trong suốt 3mm',
        explodeVec: [0, 1.55, 0]
      },
      {
        id: 'control_pcb',
        nameVi: 'Bo Mạch Động Lực Công Nghiệp',
        nameEn: 'Industrial Driver PCB',
        roleVi: 'Tích hợp khối cấp nguồn, mạch kích rơ-le và dãy LED tải.',
        roleEn: 'Carries regulator, coil driver, relay, and load LEDs.',
        specs: 'FR-4 Đen · 2 Lớp',
        explodeVec: [0, -0.1, 0]
      },
      {
        id: 'input_regulator',
        nameVi: 'IC Ổn Áp 7805 & Cổng 12V',
        nameEn: '12V Domino & 7805 5V Regulator',
        roleVi: 'Hạ áp từ 12V xuống 5.0V ổn định nuôi mạch logic kích.',
        roleEn: 'Steps 12V supply down to steady 5.0V logic rail.',
        specs: 'IN 12V · OUT 5.0V 1A',
        explodeVec: [-1.45, 0.5, 0.35]
      },
      {
        id: 'resistor_bank',
        nameVi: 'Hàng Điện Trở Kích Base 1kΩ',
        nameEn: '1kΩ Base Current Resistor Bank',
        roleVi: 'Hạn dòng kích từ chân 5V vào cực Base Transistor.',
        roleEn: 'Limits 5V trigger current into transistor Base.',
        specs: '1kΩ ±1% · 0.5W Metal Film',
        explodeVec: [-0.55, 0.95, 0.65]
      },
      {
        id: 'driver_transistor',
        nameVi: 'Transistor NPN & Diode Dập Xung',
        nameEn: 'NPN Driver & 1N4007 Flyback Diode',
        roleVi: 'Khuếch đại dòng kích đóng cuộn hút 12V và triệt xung ngược.',
        roleEn: 'Sinks 12V coil current while diode clamps inductive flyback.',
        specs: 'S8050 NPN · 1N4007',
        explodeVec: [0.15, 0.95, -0.65]
      },
      {
        id: 'relay_coil',
        nameVi: 'Rơ-le Điện Từ 12V (Lõi Đồng)',
        nameEn: '12V Electromagnetic Relay',
        roleVi: 'Cuộn dây hút lá đồng đóng tiếp điểm tải công suất 10A.',
        roleEn: 'Copper coil pulls armature blade closing 10A load contacts.',
        specs: 'Coil 12VDC (320 Ω) · 10A',
        explodeVec: [0.85, 0.85, 0.15]
      },
      {
        id: 'led_signal_bar',
        nameVi: 'Cụm Đèn LED Báo Tải Đỏ-Vàng-Xanh',
        nameEn: 'Tri-Color Load Indicator Array',
        roleVi: 'Hiển thị trạng thái đóng/cắt tiếp điểm đầu ra rơ-le.',
        roleEn: 'Shows active load switching state on relay output.',
        specs: '3x High-Flux SMD LED',
        explodeVec: [1.5, 0.45, -0.25]
      },
      {
        id: 'mounting_base',
        nameVi: 'Đế Ray DIN Nhôm Công Nghiệp',
        nameEn: 'Aluminum DIN-Rail Mounting Base',
        roleVi: 'Gá cố định bo mạch vào tủ điện công nghiệp chuẩn 35mm.',
        roleEn: 'Clamps control board onto standard 35mm DIN rail.',
        specs: 'Nhôm định hình 35mm',
        explodeVec: [0, -1.2, 0]
      }
    ],
    testPoints: [
      { id: 'TP1', partId: 'input_regulator', localOffset: [0.15, 0.3, 0.12], labelVi: 'TP1: Ngõ Ra Ổn Áp 5V', labelEn: 'TP1: 5V Logic Rail' },
      { id: 'TP2', partId: 'resistor_bank', localOffset: [0, 0.2, 0.12], labelVi: 'TP2: Sau Điện Trở 1kΩ', labelEn: 'TP2: Post 1kΩ Base Resistor' },
      { id: 'TP3', partId: 'relay_coil', localOffset: [0, 0.48, 0.15], labelVi: 'TP3: Cuộn Hút Rơ-le 12V', labelEn: 'TP3: Relay Coil Terminals' },
      { id: 'TP4', partId: 'led_signal_bar', localOffset: [0, 0.25, 0.12], labelVi: 'TP4: Tiếp Điểm Tải LED', labelEn: 'TP4: Relay Load Output' }
    ],
    scenarios: [
      {
        id: 'relay_resistor_open',
        titleVi: 'Ca #1: Cháy Điện Trở Kích Base — Rơ-le Không Đóng',
        titleEn: 'Case #1: Burned 1kΩ Resistor — Relay Dead',
        faultPartId: 'resistor_bank',
        symptomVi: 'Nguồn 12V & 5V đủ nhưng không nghe tiếng "tạch" đóng rơ-le, dàn đèn tải tắt im.',
        symptomEn: '5V & 12V power present, yet relay never clicks and load LEDs stay dark.',
        clueVi: 'Gợi ý: Đo thông mạch/điện áp tại TP2 ngay sau hàng Điện Trở Kích Base.',
        clueEn: 'Hint: Probe TP2 after the 1kΩ Base Resistor bank for open-circuit voltage drop.',
        readings: {
          TP1: {
            broken: { V: '5.01 VDC', R: '0.1 Ω', A: '0.01 A', noteVi: 'IC 7805 xuất chuẩn 5.01V', noteEn: '7805 5V rail normal' },
            fixed: { V: '5.01 VDC', R: '0.1 Ω', A: '0.05 A', noteVi: 'Nguồn 5V ổn định', noteEn: '5V rail steady' }
          },
          TP2: {
            broken: { V: '0.00 VDC', R: '∞ Ω (ĐỨT R)', A: '0.00 mA', noteVi: 'CHÁY ĐIỆN TRỞ 1kΩ! Mất dòng kích vào cực Base', noteEn: 'OPEN 1kΩ RESISTOR! Zero Base trigger current', faultyFlag: true },
            fixed: { V: '0.72 VDC', R: '1.00 kΩ OK', A: '4.3 mA', noteVi: 'Đủ dòng Base 4.3mA (V_BE = 0.72V)', noteEn: '4.3mA Base drive active' }
          },
          TP3: {
            broken: { V: '12.0 VDC (KHÔNG DÒNG)', R: '320 Ω OK', A: '0.0 mA', noteVi: 'Cuộn hút 320Ω còn tốt nhưng chưa được nối mass', noteEn: '320Ω coil good, not grounded by transistor' },
            fixed: { V: '12.0 VDC', R: '320 Ω OK', A: '37.5 mA', noteVi: 'Cuộn hút đóng tiếp điểm rơ-le chắc chắn!', noteEn: 'Coil drawing 37.5mA — Contacts closed!' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '∞ Ω (HỞ)', A: '0.00 A', noteVi: 'Tiếp điểm tải đang mở', noteEn: 'Load contacts open' },
            fixed: { V: '12.0 VDC', R: '0.05 Ω', A: '0.85 A', noteVi: 'Đèn tải Đỏ-Vàng-Xanh sáng rực!', noteEn: 'Tri-color Load LEDs Active!' }
          }
        },
        repairChoices: [
          {
            id: 'res_1k_halfw',
            labelVi: 'Điện trở 1kΩ · 0.5W Màng Kim Loại',
            labelEn: '1kΩ · 0.5W Metal-Film Resistor',
            correct: true,
            feedbackVi: 'Chuẩn kỹ thuật! I_B = (5 − 0.7)/1kΩ = 4.3mA kích bão hòa transistor an toàn.',
            feedbackEn: 'Exact match! 4.3mA drives the NPN transistor into clean saturation.'
          },
          {
            id: 'res_10m_ohm',
            labelVi: 'Điện trở 10MΩ (Quá lớn)',
            labelEn: '10MΩ Resistor (Too High)',
            correct: false,
            feedbackVi: '10MΩ chỉ cho dòng micro-ampe đi qua, hoàn toàn không đủ đóng rơ-le.',
            feedbackEn: '10MΩ passes only microamps — far too weak to trigger the relay.'
          },
          {
            id: 'swap_relay',
            labelVi: 'Thay Cụm Rơ-le 12V',
            labelEn: 'Replace 12V Relay',
            correct: false,
            feedbackVi: 'Cuộn hút rơ-le đo ở TP3 vẫn đạt đúng 320Ω, lỗi nằm ở điện trở kích tại TP2.',
            feedbackEn: 'Relay coil at TP3 already measures 320Ω; fault is the open resistor at TP2.'
          }
        ]
      },
      {
        id: 'relay_coil_open',
        titleVi: 'Ca #2: Đứt Cuộn Hút Rơ-le 12V — Tín Hiệu Có Nhưng Không Đóng Tải',
        titleEn: 'Case #2: Open 12V Relay Coil — Driven But Won’t Latch',
        faultPartId: 'relay_coil',
        symptomVi: 'Transistor kích hoạt bình thường nhưng rơ-le im re, tiếp điểm tải không đóng.',
        symptomEn: 'Control transistor conducts cleanly, yet mechanical relay stays silent.',
        clueVi: 'Gợi ý: Đo điện trở cuộn hút rơ-le tại TP3 (chuẩn ~320Ω).',
        clueEn: 'Hint: Measure coil resistance at TP3 (normal coil ≈ 320Ω).',
        readings: {
          TP1: {
            broken: { V: '5.01 VDC', R: '0.1 Ω', A: '0.02 A', noteVi: '5V Logic ổn định', noteEn: '5V steady' },
            fixed: { V: '5.01 VDC', R: '0.1 Ω', A: '0.05 A', noteVi: '5V Logic ổn định', noteEn: '5V steady' }
          },
          TP2: {
            broken: { V: '0.72 VDC', R: '1.00 kΩ OK', A: '4.3 mA', noteVi: 'Mạch kích Base hoạt động tốt', noteEn: 'Base drive healthy' },
            fixed: { V: '0.72 VDC', R: '1.00 kΩ OK', A: '4.3 mA', noteVi: 'Mạch kích Base tốt', noteEn: 'Base drive healthy' }
          },
          TP3: {
            broken: { V: '12.0 VDC', R: '∞ Ω (ĐỨT CUỘN)', A: '0.0 mA', noteVi: 'ĐỨT CUỘN DÂY ĐỒNG! Trở kháng hở mạch ∞ Ω thay vì 320 Ω', noteEn: 'OPEN COIL WINDING! Infinite Ω instead of 320Ω', faultyFlag: true },
            fixed: { V: '12.0 VDC', R: '320 Ω OK', A: '37.5 mA', noteVi: 'Cuộn hút 320Ω đóng lá đồng dứt khoát!', noteEn: '320Ω coil pulls armature closed!' }
          },
          TP4: {
            broken: { V: '0.00 VDC', R: '∞ Ω', A: '0.00 A', noteVi: 'Tiếp điểm tải chưa đóng', noteEn: 'Output open' },
            fixed: { V: '12.0 VDC', R: '0.05 Ω', A: '0.85 A', noteVi: 'Tải LED đóng điện thành công!', noteEn: 'Load energized!' }
          }
        },
        repairChoices: [
          {
            id: 'relay_12v_10a',
            labelVi: 'Rơ-le Điện Từ 12VDC · 10A (320Ω)',
            labelEn: '12VDC · 10A Electromagnetic Relay',
            correct: true,
            feedbackVi: 'Hoàn hảo! Cuộn hút 12V khôi phục lực từ kéo đóng tiếp điểm tải tức thì.',
            feedbackEn: 'Perfect! New 12VDC coil snaps the 10A contact armature cleanly.'
          },
          {
            id: 'relay_5v',
            labelVi: 'Rơ-le 5VDC cấp vào nguồn 12V',
            labelEn: '5VDC Relay on 12V Rail',
            correct: false,
            feedbackVi: 'Áp 12V quá cao gấp 2.4 lần định mức 5V sẽ làm cháy cuộn hút nhanh chóng.',
            feedbackEn: '12V across a 5V coil causes rapid thermal burnout.'
          },
          {
            id: 'swap_7805',
            labelVi: 'Thay IC Ổn Áp 7805',
            labelEn: 'Replace 7805 Regulator',
            correct: false,
            feedbackVi: 'TP1 vẫn đo đúng 5.01V ổn định, nguồn 5V không hề hỏng.',
            feedbackEn: 'TP1 already outputs steady 5.01V; regulator is fine.'
          }
        ]
      }
    ]
  }
];

function detectSoftwareWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String(
      ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || ''
    );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(name);
  } catch {
    return false;
  }
}

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();
const _raycaster = new THREE.Raycaster();
const _ndc = new THREE.Vector2();

interface RuntimePartHandle {
  id: string;
  group: THREE.Group;
  basePos: THREE.Vector3;
  explodeVec: THREE.Vector3;
  hitMeshes: THREE.Object3D[];
  faultMat?: THREE.MeshStandardMaterial;
  faultOrigColor?: number;
  faultOrigEmissive?: number;
}

interface DeviceAnimHandles {
  fanRotor?: THREE.Group;
  relayArmature?: THREE.Group;
  statusLeds: THREE.MeshStandardMaterial[];
  coilGlowMats: THREE.MeshStandardMaterial[];
}

export const TechTeardown3DLab: React.FC<TechTeardown3DLabProps> = ({ onEarnXP }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { perfMode } = useBackgroundTheme();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const onEarnXPRef = useRef(onEarnXP);
  onEarnXPRef.current = onEarnXP;

  const [deviceId, setDeviceId] = useState<DeviceId>('desk_fan');
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [explodePct, setExplodePct] = useState<number>(36);
  const [selectedPartId, setSelectedPartId] = useState<string>('thermal_fuse');
  const [activePin, setActivePin] = useState<TestPointId>('TP2');
  const [vomMode, setVomMode] = useState<VomMode>('V');
  const [powerOn, setPowerOn] = useState<boolean>(false);
  const [repairedMap, setRepairedMap] = useState<Record<string, boolean>>({});
  const [xpAwardedMap, setXpAwardedMap] = useState<Record<string, boolean>>({});
  const [drawerTab, setDrawerTab] = useState<'vom' | 'repair'>('vom');
  const [drawerCollapsed, setDrawerCollapsed] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [repairFeedback, setRepairFeedback] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const device = useMemo(
    () => DEVICES.find((d) => d.id === deviceId) || DEVICES[0],
    [deviceId]
  );
  const scenario = device.scenarios[scenarioIdx % device.scenarios.length];
  const scenarioKey = `${device.id}:${scenario.id}`;
  const isRepaired = Boolean(repairedMap[scenarioKey]);
  const selectedPart =
    device.parts.find((p) => p.id === selectedPartId) || device.parts[0];

  const stateRef = useRef({
    explodeTarget: explodePct / 100,
    explodeCurrent: explodePct / 100,
    selectedPartId,
    activePin,
    powerOn,
    isRepaired,
    faultPartId: scenario.faultPartId,
    solderFlash: 0
  });
  stateRef.current.explodeTarget = explodePct / 100;
  stateRef.current.selectedPartId = selectedPartId;
  stateRef.current.activePin = activePin;
  stateRef.current.powerOn = powerOn;
  stateRef.current.isRepaired = isRepaired;
  stateRef.current.faultPartId = scenario.faultPartId;

  const resetCamRef = useRef<(() => void) | null>(null);

  const playBenchSfx = useCallback(
    (kind: 'probe' | 'solder' | 'power' | 'error') => {
      if (!soundOn || typeof window === 'undefined') return;
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const now = ctx.currentTime;

        if (kind === 'probe') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1480, now);
          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (kind === 'solder') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1040, now + 0.22);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
        } else if (kind === 'power') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.setValueAtTime(480, now + 0.06);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.18);
        } else {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.linearRampToValueAtTime(135, now + 0.16);
          gain.gain.setValueAtTime(0.045, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.19);
        }

        window.setTimeout(() => {
          try {
            ctx.close();
          } catch {}
        }, 320);
      } catch {}
    },
    [soundOn]
  );

  // Switch device cleanly
  const handleSelectDevice = (nextId: DeviceId) => {
    const nextDev = DEVICES.find((d) => d.id === nextId) || DEVICES[0];
    setDeviceId(nextId);
    setScenarioIdx(0);
    setPowerOn(false);
    setActivePin('TP2');
    setSelectedPartId(nextDev.scenarios[0].faultPartId);
    setRepairFeedback(null);
  };

  const handleToggleScenario = () => {
    const nextIdx = (scenarioIdx + 1) % device.scenarios.length;
    setScenarioIdx(nextIdx);
    setPowerOn(false);
    setActivePin('TP2');
    setSelectedPartId(device.scenarios[nextIdx].faultPartId);
    setRepairFeedback(null);
  };

  const handleAttemptRepair = (choice: RepairChoice) => {
    const isTargetFaultPart = selectedPartId === scenario.faultPartId;
    if (!isTargetFaultPart) {
      playBenchSfx('error');
      setRepairFeedback({
        ok: false,
        text: isEn
          ? `Wrong target component! "${selectedPart.nameEn}" is healthy. Use the VOM Multimeter to locate the faulty pin first.`
          : `Sai linh kiện cần thay! "${selectedPart.nameVi}" vẫn đang hoạt động tốt. Hãy dùng VOM đo kiểm tra lại điểm lỗi.`
      });
      return;
    }

    if (!choice.correct) {
      playBenchSfx('error');
      setRepairFeedback({
        ok: false,
        text: isEn ? choice.feedbackEn : choice.feedbackVi
      });
      return;
    }

    playBenchSfx('solder');
    stateRef.current.solderFlash = 1.0;
    setRepairedMap((prev) => ({ ...prev, [scenarioKey]: true }));
    setRepairFeedback({
      ok: true,
      text: isEn
        ? `${choice.feedbackEn} Now turn ON the Power Switch to verify operation!`
        : `${choice.feedbackVi} Hãy bấm nút BẬT NGUỒN để kiểm nghiệm thiết bị chạy thật!`
    });
  };

  const handleTogglePower = () => {
    setPowerOn((prev) => {
      const next = !prev;
      if (next) {
        if (isRepaired) {
          playBenchSfx('power');
          if (!xpAwardedMap[scenarioKey]) {
            setXpAwardedMap((m) => ({ ...m, [scenarioKey]: true }));
            onEarnXPRef.current?.(40);
          }
        } else {
          playBenchSfx('error');
        }
      }
      return next;
    });
  };

  // ==================== THREE.JS COMPOSITE BENCH SCENE ====================
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const softwareGl = detectSoftwareWebGL();
    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 580;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060b16);
    scene.fog = new THREE.FogExp2(0x060b16, 0.042);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(3.8, 2.75, 4.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGl && perfMode !== 'smooth',
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(
      softwareGl
        ? 1
        : perfMode === 'smooth'
        ? Math.min(window.devicePixelRatio || 1, 1.25)
        : Math.min(window.devicePixelRatio || 1, 1.75)
    );
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !softwareGl && perfMode !== 'smooth';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmrem.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.target.set(0, 0.1, 0);
    controls.minDistance = 2.4;
    controls.maxDistance = 9.5;
    controls.maxPolarAngle = Math.PI * 0.49;

    resetCamRef.current = () => {
      camera.position.set(3.8, 2.75, 4.35);
      controls.target.set(0, 0.1, 0);
      controls.update();
    };

    // Three-point + Ambient workbench lighting
    const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x0f172a, 0.72);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.1);
    keyLight.position.set(4.5, 6.2, 4.0);
    if (!softwareGl && perfMode !== 'smooth') {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -3.5;
      keyLight.shadow.camera.right = 3.5;
      keyLight.shadow.camera.top = 3.5;
      keyLight.shadow.camera.bottom = -3.5;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.05);
    rimLight.position.set(-4.5, 3.2, -4.0);
    scene.add(rimLight);

    // Grounded ESD Anti-Static Lab Workbench Mat
    const benchGroup = new THREE.Group();
    const tableGeo = new THREE.BoxGeometry(10, 0.24, 7);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0b1322,
      roughness: 0.78,
      metalness: 0.15
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -1.62;
    tableMesh.receiveShadow = true;
    benchGroup.add(tableMesh);

    const esdMatGeo = new THREE.BoxGeometry(5.8, 0.035, 4.2);
    const esdMatMat = new THREE.MeshStandardMaterial({
      color: 0x0f2738,
      roughness: 0.85,
      metalness: 0.05
    });
    const esdMat = new THREE.Mesh(esdMatGeo, esdMatMat);
    esdMat.position.y = -1.48;
    esdMat.receiveShadow = true;
    benchGroup.add(esdMat);

    const gridHelper = new THREE.GridHelper(5.6, 18, 0x14b8a6, 0x164e63);
    gridHelper.position.y = -1.46;
    benchGroup.add(gridHelper);

    // Subtle soft contact shadow pad under the device
    const shadowPad = new THREE.Mesh(
      new THREE.CircleGeometry(1.45, 32),
      new THREE.MeshBasicMaterial({
        color: 0x020617,
        transparent: true,
        opacity: 0.55
      })
    );
    shadowPad.rotation.x = -Math.PI / 2;
    shadowPad.position.y = -1.455;
    benchGroup.add(shadowPad);
    scene.add(benchGroup);

    // ==================== BUILD COMPOSITE 3D DEVICE ====================
    const deviceRoot = new THREE.Group();
    deviceRoot.position.y = 0.08;
    scene.add(deviceRoot);

    const partHandles: RuntimePartHandle[] = [];
    const animHandles: DeviceAnimHandles = {
      statusLeds: [],
      coilGlowMats: []
    };
    const testPinGroups = new Map<TestPointId, THREE.Group>();
    const hitObjectToPart = new Map<THREE.Object3D, string>();
    const hitObjectToPin = new Map<THREE.Object3D, TestPointId>();

    // Shared PBR Materials created inside effect and disposed on cleanup
    const matAluminum = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.86 });
    const matDarkSteel = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.42, metalness: 0.78 });
    const matCopper = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.28, metalness: 0.88, emissive: 0x000000 });
    const matPcbGreen = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.55, metalness: 0.15 });
    const matPcbBlue = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.52, metalness: 0.18 });
    const matPcbDark = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.52, metalness: 0.22 });
    const matPlasticDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.1 });
    const matAcrylic = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.34,
      depthWrite: false
    });
    const matGoldPin = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.22,
      metalness: 0.9,
      emissive: 0x78350f,
      emissiveIntensity: 0.35
    });

    const addPart = (spec: PartMeta, group: THREE.Group, basePos = new THREE.Vector3(0, 0, 0)) => {
      group.position.copy(basePos);
      const hitMeshes: THREE.Object3D[] = [];
      group.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          o.castShadow = true;
          o.receiveShadow = true;
          hitMeshes.push(o);
          hitObjectToPart.set(o, spec.id);
        }
      });
      deviceRoot.add(group);
      const handle: RuntimePartHandle = {
        id: spec.id,
        group,
        basePos: basePos.clone(),
        explodeVec: new THREE.Vector3(...spec.explodeVec),
        hitMeshes
      };
      partHandles.push(handle);
      return handle;
    };

    const getSpec = (id: string) => device.parts.find((p) => p.id === id)!;

    // Build Device 1: AC Desk Fan
    if (device.id === 'desk_fan') {
      // 1. Front Grille
      const gGrille = new THREE.Group();
      const grilleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.72 });
      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.032, 10, 42), grilleMat);
      const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.022, 8, 32), grilleMat);
      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.06, 20), matDarkSteel);
      hubCap.rotation.x = Math.PI / 2;
      gGrille.add(outerRing, midRing, hubCap);
      for (let i = 0; i < 6; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.04, 6), grilleMat);
        spoke.rotation.z = (i * Math.PI) / 6;
        gGrille.add(spoke);
      }
      addPart(getSpec('front_grille'), gGrille, new THREE.Vector3(0, 0.15, 0.52));

      // 2. 4-Blade Fan Rotor
      const gBlades = new THREE.Group();
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.32, metalness: 0.2 });
      const spinner = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.22, 20), matAluminum);
      spinner.rotation.x = Math.PI / 2;
      gBlades.add(spinner);
      for (let i = 0; i < 4; i++) {
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI) / 2;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.74, 0.025), bladeMat);
        blade.position.y = 0.5;
        blade.rotation.y = 0.36;
        pivot.add(blade);
        gBlades.add(pivot);
      }
      animHandles.fanRotor = gBlades;
      addPart(getSpec('fan_blades'), gBlades, new THREE.Vector3(0, 0.15, 0.26));

      // 3. Motor Shaft & Bearings
      const gShaft = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.05, 16), matAluminum);
      shaft.rotation.x = Math.PI / 2;
      const rotorDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.38, 22), matDarkSteel);
      rotorDrum.rotation.x = Math.PI / 2;
      rotorDrum.position.z = -0.18;
      gShaft.add(shaft, rotorDrum);
      addPart(getSpec('motor_shaft'), gShaft, new THREE.Vector3(0, 0.15, 0.08));

      // 4. Stator Copper Coil
      const gStator = new THREE.Group();
      const statorMat = matCopper.clone();
      animHandles.coilGlowMats.push(statorMat);
      const coreBlock = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.76, 0.36), matDarkSteel);
      const hole = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.11, 12, 28), statorMat);
      for (let i = 0; i < 4; i++) {
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.34, 14), statorMat);
        coil.rotation.x = Math.PI / 2;
        const a = (i * Math.PI) / 2 + Math.PI / 4;
        coil.position.set(Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
        gStator.add(coil);
      }
      gStator.add(coreBlock, hole);
      addPart(getSpec('stator_coil'), gStator, new THREE.Vector3(0, 0.15, -0.14));

      // 5. Thermal Fuse (faultable)
      const gFuse = new THREE.Group();
      const fuseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.25 });
      const fuseBody = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 14), fuseMat);
      fuseBody.rotation.z = Math.PI / 2;
      const leadL = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 8), matAluminum);
      leadL.rotation.z = Math.PI / 2;
      gFuse.add(leadL, fuseBody);
      const hFuse = addPart(getSpec('thermal_fuse'), gFuse, new THREE.Vector3(-0.34, 0.6, -0.12));
      hFuse.faultMat = fuseMat;
      hFuse.faultOrigColor = 0xf8fafc;

      // 6. Start Capacitor (faultable)
      const gCap = new THREE.Group();
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.2 });
      const capBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.22), capMat);
      const capLabel = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.16, 0.23),
        new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.6 })
      );
      gCap.add(capBox, capLabel);
      const hCap = addPart(getSpec('start_capacitor'), gCap, new THREE.Vector3(0.56, -0.18, -0.24));
      hCap.faultMat = capMat;
      hCap.faultOrigColor = 0x0f172a;

      // 7. Speed Switch & Base Stand
      const gSwitch = new THREE.Group();
      const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.95, 16), matDarkSteel);
      standNeck.position.y = -0.58;
      const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.14, 0.85), matPlasticDark);
      baseFoot.position.y = -1.08;
      for (let i = 0; i < 4; i++) {
        const btn = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.07, 0.16),
          new THREE.MeshStandardMaterial({ color: i === 0 ? 0xef4444 : 0x38bdf8, roughness: 0.35 })
        );
        btn.position.set(-0.27 + i * 0.18, -0.99, 0.24);
        gSwitch.add(btn);
      }
      gSwitch.add(standNeck, baseFoot);
      addPart(getSpec('speed_switch'), gSwitch, new THREE.Vector3(0, 0, 0));

      // 8. Rear Motor Shell
      const gRear = new THREE.Group();
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.36, 0.56, 24), matPlasticDark);
      shell.rotation.x = Math.PI / 2;
      gRear.add(shell);
      addPart(getSpec('rear_housing'), gRear, new THREE.Vector3(0, 0.15, -0.58));
    }

    // Build Device 2: USB-C 65W GaN Charger
    else if (device.id === 'usbc_charger') {
      const gTop = new THREE.Group();
      const topBox = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.28, 1.38), matAcrylic);
      gTop.add(topBox);
      addPart(getSpec('top_shell'), gTop, new THREE.Vector3(0, 0.58, 0));

      const gPcb = new THREE.Group();
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.08, 1.24), matPcbGreen);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 1.05), matDarkSteel);
      slot.position.x = 0.32;
      gPcb.add(board, slot);
      addPart(getSpec('pcb_board'), gPcb, new THREE.Vector3(0, 0, 0));

      // AC Fuse & Bridge (faultable)
      const gAc = new THREE.Group();
      const fuseMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
      const acFuse = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 14), fuseMat);
      acFuse.rotation.z = Math.PI / 2;
      acFuse.position.set(-0.1, 0.18, 0.22);
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.28), matPlasticDark);
      bridge.position.set(0.18, 0.14, -0.18);
      gAc.add(acFuse, bridge);
      const hAc = addPart(getSpec('ac_fuse_bridge'), gAc, new THREE.Vector3(-0.66, 0.04, 0));
      hAc.faultMat = fuseMat;
      hAc.faultOrigColor = 0xdc2626;

      // 400V Bulk Capacitor (faultable)
      const gBulk = new THREE.Group();
      const bulkMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.32, metalness: 0.25 });
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.56, 22), bulkMat);
      cyl.position.y = 0.28;
      const topVent = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 22), matAluminum);
      topVent.position.y = 0.57;
      gBulk.add(cyl, topVent);
      const hBulk = addPart(getSpec('bulk_capacitor'), gBulk, new THREE.Vector3(-0.24, 0.04, -0.24));
      hBulk.faultMat = bulkMat;
      hBulk.faultOrigColor = 0x0f766e;

      // Flyback Transformer
      const gXfrm = new THREE.Group();
      const ferrite = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.48, 0.48), matDarkSteel);
      ferrite.position.y = 0.24;
      const tape = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.24, 0.34),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
      );
      tape.position.y = 0.24;
      gXfrm.add(ferrite, tape);
      addPart(getSpec('flyback_transformer'), gXfrm, new THREE.Vector3(0.22, 0.04, 0.08));

      // GaN MOSFET + Aluminum Heatsink
      const gGan = new THREE.Group();
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), matPlasticDark);
      chip.position.y = 0.06;
      const sink = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.1), matAluminum);
      sink.position.set(0, 0.22, -0.15);
      gGan.add(chip, sink);
      addPart(getSpec('gan_mosfet'), gGan, new THREE.Vector3(0.18, 0.04, -0.34));

      // USB-C Port & Output LED
      const gUsbc = new THREE.Group();
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.32), matAluminum);
      port.position.y = 0.1;
      const outCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.26, 16),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.35 })
      );
      outCap.position.set(-0.18, 0.15, 0.24);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x10b981,
        emissiveIntensity: 0
      });
      animHandles.statusLeds.push(ledMat);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), ledMat);
      led.position.set(0, 0.22, -0.2);
      gUsbc.add(port, outCap, led);
      addPart(getSpec('usbc_port'), gUsbc, new THREE.Vector3(0.75, 0.04, 0));

      const gBot = new THREE.Group();
      const botBox = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.22, 1.38), matPlasticDark);
      const prong1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.08), matGoldPin);
      prong1.position.set(-1.18, 0, -0.2);
      const prong2 = prong1.clone();
      prong2.position.z = 0.2;
      gBot.add(botBox, prong1, prong2);
      addPart(getSpec('bottom_shell'), gBot, new THREE.Vector3(0, -0.34, 0));
    }

    // Build Device 3: 3S Lithium Pack & BMS
    else if (device.id === 'lithium_bms') {
      const gLid = new THREE.Group();
      const lid = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.14, 1.45), matAcrylic);
      gLid.add(lid);
      addPart(getSpec('top_cover'), gLid, new THREE.Vector3(0, 0.68, 0));

      // 3x 18650 Cells + Nickel Busbars
      const gCells = new THREE.Group();
      const cellMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.32, metalness: 0.3 });
      for (let i = -1; i <= 1; i++) {
        const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 1.24, 20), cellMat);
        cell.rotation.z = Math.PI / 2;
        cell.position.set(0, 0, i * 0.42);
        const capEnd = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.26, 16), matAluminum);
        capEnd.rotation.z = Math.PI / 2;
        capEnd.position.set(0, 0, i * 0.42);
        gCells.add(cell, capEnd);
      }
      const nickel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.98), matAluminum);
      nickel.position.set(0.64, 0, 0);
      gCells.add(nickel);
      addPart(getSpec('cell_pack'), gCells, new THREE.Vector3(-0.36, 0, 0));

      const gBms = new THREE.Group();
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 1.28), matPcbBlue);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x22c55e,
        emissiveIntensity: 0
      });
      animHandles.statusLeds.push(ledMat);
      const ledDot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), ledMat);
      ledDot.position.set(0.28, 0.07, -0.45);
      gBms.add(pcb, ledDot);
      addPart(getSpec('bms_pcb'), gBms, new THREE.Vector3(0.65, 0.08, 0));

      // NTC Thermistor (faultable)
      const gNtc = new THREE.Group();
      const ntcMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 });
      const ntcHead = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), ntcMat);
      const ntcLead = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), matPlasticDark);
      ntcLead.rotation.z = Math.PI / 2;
      ntcLead.position.x = 0.22;
      gNtc.add(ntcHead, ntcLead);
      const hNtc = addPart(getSpec('ntc_sensor'), gNtc, new THREE.Vector3(0.05, 0.22, 0.22));
      hNtc.faultMat = ntcMat;
      hNtc.faultOrigColor = 0xf97316;

      // Supervisor IC
      const gIc = new THREE.Group();
      const icBody = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.24), matPlasticDark);
      gIc.add(icBody);
      addPart(getSpec('bms_ic'), gIc, new THREE.Vector3(0.56, 0.16, -0.24));

      // Power MOSFET Bank (faultable)
      const gMos = new THREE.Group();
      const mosMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.4 });
      for (let i = 0; i < 2; i++) {
        const fet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.24), mosMat);
        fet.position.z = i === 0 ? -0.16 : 0.16;
        gMos.add(fet);
      }
      const hMos = addPart(getSpec('mosfet_bank'), gMos, new THREE.Vector3(0.74, 0.16, 0.24));
      hMos.faultMat = mosMat;
      hMos.faultOrigColor = 0x1e293b;

      // XT60 Output Connector
      const gXt = new THREE.Group();
      const xtBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.18, 0.24),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
      );
      gXt.add(xtBody);
      addPart(getSpec('xt60_port'), gXt, new THREE.Vector3(1.12, 0.14, 0));

      const gTray = new THREE.Group();
      const tray = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.16, 1.46), matAluminum);
      gTray.add(tray);
      addPart(getSpec('bottom_tray'), gTray, new THREE.Vector3(0, -0.36, 0));
    }

    // Build Device 4: Industrial 12V Relay Board
    else {
      const gLid = new THREE.Group();
      const lid = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.12, 1.45), matAcrylic);
      gLid.add(lid);
      addPart(getSpec('acrylic_lid'), gLid, new THREE.Vector3(0, 0.72, 0));

      const gPcb = new THREE.Group();
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.32), matPcbDark);
      gPcb.add(pcb);
      addPart(getSpec('control_pcb'), gPcb, new THREE.Vector3(0, 0, 0));

      const gReg = new THREE.Group();
      const domino = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.22, 0.36),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.45 })
      );
      domino.position.y = 0.12;
      const reg7805 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.18), matPlasticDark);
      reg7805.position.set(0.28, 0.16, -0.18);
      gReg.add(domino, reg7805);
      addPart(getSpec('input_regulator'), gReg, new THREE.Vector3(-0.78, 0.04, 0.1));

      // Resistor Bank (faultable)
      const gRes = new THREE.Group();
      const resMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.45 });
      const resBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 14), resMat);
      resBody.rotation.z = Math.PI / 2;
      resBody.position.y = 0.1;
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.46, 8), matAluminum);
      lead.rotation.z = Math.PI / 2;
      lead.position.y = 0.1;
      gRes.add(lead, resBody);
      const hRes = addPart(getSpec('resistor_bank'), gRes, new THREE.Vector3(-0.28, 0.04, 0.24));
      hRes.faultMat = resMat;
      hRes.faultOrigColor = 0x38bdf8;

      const gTr = new THREE.Group();
      const npn = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 12), matPlasticDark);
      npn.position.y = 0.12;
      const diode = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 10), matPlasticDark);
      diode.rotation.z = Math.PI / 2;
      diode.position.set(0, 0.08, -0.24);
      gTr.add(npn, diode);
      addPart(getSpec('driver_transistor'), gTr, new THREE.Vector3(0.08, 0.04, -0.2));

      // Relay Coil & Animated Armature (faultable)
      const gRelay = new THREE.Group();
      const relayCase = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 0.48), matAcrylic);
      relayCase.position.y = 0.24;
      const coilMat = matCopper.clone();
      animHandles.coilGlowMats.push(coilMat);
      const relayCoil = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 18), coilMat);
      relayCoil.position.set(-0.08, 0.2, 0);
      const armature = new THREE.Group();
      armature.position.set(0.14, 0.12, 0);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.12), matGoldPin);
      blade.position.y = 0.14;
      armature.add(blade);
      animHandles.relayArmature = armature;
      gRelay.add(relayCoil, armature, relayCase);
      const hRel = addPart(getSpec('relay_coil'), gRelay, new THREE.Vector3(0.42, 0.04, 0.08));
      hRel.faultMat = coilMat;
      hRel.faultOrigColor = 0xd97706;

      // Tri-color Load LED Array
      const gLeds = new THREE.Group();
      [0xef4444, 0xf59e0b, 0x22c55e].forEach((hex, idx) => {
        const lMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          emissive: hex,
          emissiveIntensity: 0
        });
        animHandles.statusLeds.push(lMat);
        const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16), lMat);
        bulb.position.set(0, 0.12, (idx - 1) * 0.28);
        gLeds.add(bulb);
      });
      addPart(getSpec('led_signal_bar'), gLeds, new THREE.Vector3(0.86, 0.04, 0));

      const gDin = new THREE.Group();
      const din = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.14, 1.38), matAluminum);
      gDin.add(din);
      addPart(getSpec('mounting_base'), gDin, new THREE.Vector3(0, -0.26, 0));
    }

    // Attach 3D Gold Test Pins (TP1..TP4) onto their parent parts!
    device.testPoints.forEach((tp) => {
      const parentHandle = partHandles.find((h) => h.id === tp.partId);
      if (!parentHandle) return;
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...tp.localOffset);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.18, 12), matGoldPin);
      post.position.y = 0.09;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.062, 14, 14),
        new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          emissive: 0x0891b2,
          emissiveIntensity: 0.85,
          roughness: 0.25
        })
      );
      head.position.y = 0.19;
      pinGroup.add(post, head);
      parentHandle.group.add(pinGroup);
      testPinGroups.set(tp.id, pinGroup);
      hitObjectToPin.set(post, tp.id);
      hitObjectToPin.set(head, tp.id);
    });

    // Interactive Red 3D VOM Test Probe Needle
    const probeGroup = new THREE.Group();
    const probeHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.052, 0.65, 14),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 })
    );
    probeHandle.position.y = 0.56;
    const probeTip = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.28, 12), matAluminum);
    probeTip.rotation.x = Math.PI;
    probeTip.position.y = 0.14;
    probeGroup.add(probeHandle, probeTip);
    probeGroup.rotation.z = -0.32;
    scene.add(probeGroup);

    // Solder Repair Flash Ring
    const solderRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const solderRing = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.26, 28), solderRingMat);
    solderRing.rotation.x = -Math.PI / 2;
    scene.add(solderRing);

    // Exploded Leader Lines (dashed lines back to rest assembly center)
    const linePositions = new Float32Array(partHandles.length * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45
    });
    const leaderLines = new THREE.LineSegments(lineGeo, lineMat);
    deviceRoot.add(leaderLines);

    // Selection Bounding Wireframe Helper
    const selBox = new THREE.BoxHelper(new THREE.Object3D(), 0x38bdf8);
    selBox.visible = false;
    scene.add(selBox);

    // Pointer Click Raycasting on 3D Parts and Test Pins
    let downX = 0;
    let downY = 0;
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      _ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_ndc, camera);

      const hits = _raycaster.intersectObjects(deviceRoot.children, true);
      for (const hit of hits) {
        const pinHit = hitObjectToPin.get(hit.object);
        if (pinHit) {
          setActivePin(pinHit);
          setDrawerTab('vom');
          setDrawerCollapsed(false);
          playBenchSfx('probe');
          return;
        }
        const partHit = hitObjectToPart.get(hit.object);
        if (partHit) {
          setSelectedPartId(partHit);
          setDrawerCollapsed(false);
          return;
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Animation loop (Zero-GC, damped transitions)
    let disposed = false;
    let frameId = 0;
    let lastTs = performance.now();
    const afterDraw = (fn: () => void) => setTimeout(fn, 16);

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;

      const st = stateRef.current;
      st.explodeCurrent = THREE.MathUtils.damp(st.explodeCurrent, st.explodeTarget, 7.5, dt);

      // Update Exploded positions + Damaged vs Repaired state + Leader Lines
      const posAttr = lineGeo.getAttribute('position') as THREE.BufferAttribute;
      partHandles.forEach((h, idx) => {
        h.group.position.copy(h.basePos).addScaledVector(h.explodeVec, st.explodeCurrent);

        const baseIdx = idx * 6;
        linePositions[baseIdx] = h.basePos.x;
        linePositions[baseIdx + 1] = h.basePos.y;
        linePositions[baseIdx + 2] = h.basePos.z;
        linePositions[baseIdx + 3] = h.group.position.x;
        linePositions[baseIdx + 4] = h.group.position.y;
        linePositions[baseIdx + 5] = h.group.position.z;

        if (h.faultMat && h.faultOrigColor !== undefined) {
          const isFaulty = h.id === st.faultPartId && !st.isRepaired;
          if (isFaulty) {
            h.faultMat.color.setHex(0x271a14);
            h.faultMat.emissive.setHex(0xef4444);
            h.faultMat.emissiveIntensity = 0.25;
          } else {
            h.faultMat.color.setHex(h.faultOrigColor);
            h.faultMat.emissive.setHex(0x000000);
            h.faultMat.emissiveIntensity = 0;
          }
        }
      });
      posAttr.needsUpdate = true;
      leaderLines.visible = st.explodeCurrent > 0.04;

      // Working Kinematics when Power is ON and Device Repaired
      const running = st.powerOn && st.isRepaired;
      if (animHandles.fanRotor) {
        if (running) {
          animHandles.fanRotor.rotation.z -= dt * 15.5;
        } else if (st.powerOn && st.faultPartId === 'start_capacitor') {
          // Humming stalled rotor vibration
          animHandles.fanRotor.rotation.z = Math.sin(now * 0.06) * 0.035;
        }
      }
      if (animHandles.relayArmature) {
        const targetRot = running ? 0.24 : 0;
        animHandles.relayArmature.rotation.z = THREE.MathUtils.damp(
          animHandles.relayArmature.rotation.z,
          targetRot,
          14,
          dt
        );
      }
      animHandles.statusLeds.forEach((m, i) => {
        m.emissiveIntensity = running ? 1.65 : st.powerOn && i === 0 ? 0.35 : 0;
      });
      animHandles.coilGlowMats.forEach((m) => {
        m.emissive.setHex(0xf59e0b);
        m.emissiveIntensity = running ? 0.22 : 0;
      });

      // Selection bounding box
      const selectedHandle = partHandles.find((h) => h.id === st.selectedPartId);
      if (selectedHandle) {
        selectedHandle.group.updateMatrixWorld(true);
        selBox.setFromObject(selectedHandle.group);
        selBox.visible = true;
      } else {
        selBox.visible = false;
      }

      // Smoothly move red VOM Probe Tip to active 3D Test Pin
      const pinGrp = testPinGroups.get(st.activePin);
      if (pinGrp) {
        pinGrp.updateMatrixWorld(true);
        _vA.set(0, 0.2, 0).applyMatrix4(pinGrp.matrixWorld);
        probeGroup.position.lerp(_vA, Math.min(1, dt * 11));
      }

      // Solder success flash ring
      if (st.solderFlash > 0 && selectedHandle) {
        st.solderFlash = Math.max(0, st.solderFlash - dt * 1.9);
        selectedHandle.group.getWorldPosition(_vB);
        solderRing.position.copy(_vB);
        solderRing.scale.setScalar(1 + (1 - st.solderFlash) * 2.8);
        solderRingMat.opacity = st.solderFlash * 0.85;
        solderRing.visible = true;
      } else {
        solderRing.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);

      if (softwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth || 900;
      const nh = mount.clientHeight || 580;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    if (softwareGl) afterDraw(tick);
    else frameId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh || (obj as THREE.LineSegments).isLineSegments) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mm) => mm.dispose());
          else m.material?.dispose();
        }
      });
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [device, perfMode, playBenchSfx]);

  const pinReading = scenario.readings[activePin][isRepaired ? 'fixed' : 'broken'];
  const pinMeta = device.testPoints.find((t) => t.id === activePin) || device.testPoints[0];
  const displayValue = vomMode === 'V' ? pinReading.V : vomMode === 'R' ? pinReading.R : pinReading.A;

  return (
    <div className="relative w-full h-[660px] sm:h-[720px] rounded overflow-hidden border border-amber-500/45 bg-[#060b16] text-white shadow-2xl select-none">
      {/* Isolated 3D WebGL Workbench Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top-Left Device Switcher & Active Case Status */}
      <div className="pointer-events-none absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[min(560px,calc(100vw-24px))]">
        <div className="pointer-events-auto rounded bg-[#050b1d]/94 border border-amber-500/40 px-3 py-2.5 space-y-2 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
              <Wrench className="w-4 h-4 shrink-0" />
              <span>
                {isEn ? '3D Teardown & Fault Repair Bench' : 'Xưởng Phẫu Thuật & Sửa Chữa Thiết Bị 3D'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => resetCamRef.current?.()}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-sky-400 text-[10px] font-bold text-slate-200 flex items-center gap-1 cursor-pointer"
                title={isEn ? 'Reset 3D Camera' : 'Đặt lại góc nhìn 3D'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>3D</span>
              </button>
              <button
                type="button"
                onClick={() => setSoundOn((v) => !v)}
                className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 cursor-pointer"
                title={isEn ? 'Toggle Sound' : 'Bật/Tắt Âm thanh'}
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 4 Devices Row */}
          <div className="flex flex-wrap items-center gap-1">
            {DEVICES.map((d) => {
              const active = d.id === device.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDevice(d.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-amber-400 border-amber-300 text-slate-950'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400/60'
                  }`}
                >
                  {isEn ? d.titleEn : d.titleVi}
                </button>
              );
            })}
          </div>

          {/* Symptom & Status Bar */}
          <div className="pt-1.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-start gap-1.5 min-w-0 flex-1">
              {isRepaired ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="font-bold text-slate-100 truncate">
                  {isEn ? scenario.titleEn : scenario.titleVi}{' '}
                  <span className="font-mono text-[10px] text-amber-300">({device.ratedBadge})</span>
                </div>
                <div className="text-[10.5px] text-slate-300 leading-snug">
                  {isRepaired
                    ? isEn
                      ? 'Repaired! Switch Power ON to inspect working 3D assembly.'
                      : 'Đã thay đúng linh kiện! Bấm BẬT NGUỒN để kiểm tra thiết bị chạy.'
                    : isEn
                    ? scenario.symptomEn
                    : scenario.symptomVi}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleScenario}
              className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/45 hover:border-cyan-300 text-[10px] font-mono font-bold text-cyan-300 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isEn ? `Case ${scenarioIdx + 1}/2 ↻` : `Đổi Ca (${scenarioIdx + 1}/2)`}
            </button>
          </div>
        </div>
      </div>

      {/* Top-Right VOM Multimeter & Repair Drawer (Collapsible) */}
      <div className="absolute top-3 right-3 z-20 w-[min(320px,calc(100vw-24px))] flex flex-col items-end gap-1.5">
        <button
          type="button"
          onClick={() => setDrawerCollapsed((v) => !v)}
          className="px-2.5 py-1 rounded bg-[#050b1d]/94 border border-cyan-500/45 text-[10px] font-mono font-bold text-cyan-300 cursor-pointer shadow"
        >
          {drawerCollapsed
            ? isEn ? '▴ Open VOM & Repair' : '▴ Mở Đồng Hồ VOM & Sửa'
            : isEn ? '▾ Collapse Bench Panel' : '▾ Thu Gọn Bảng VOM'}
        </button>

        {!drawerCollapsed && (
          <div className="w-full rounded bg-[#050b1d]/95 border border-cyan-500/40 p-3 space-y-2.5 shadow-2xl">
            {/* Switch Tabs */}
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setDrawerTab('vom')}
                className={`py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                  drawerTab === 'vom' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isEn ? 'VOM Probe' : 'Đồng hồ VOM'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab('repair')}
                className={`py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                  drawerTab === 'repair' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{isEn ? 'Solder Repair' : 'Phẫu Thuật Sửa'}</span>
              </button>
            </div>

            {drawerTab === 'vom' ? (
              <div className="space-y-2">
                {/* Digital LCD Screen */}
                <div className="rounded bg-[#022c22] border border-emerald-500/50 px-3 py-2 space-y-0.5 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300/80">
                    <span>{isEn ? pinMeta.labelEn : pinMeta.labelVi}</span>
                    <span>{vomMode === 'V' ? 'VOLT' : vomMode === 'R' ? 'OHM/CAP' : 'AMP'}</span>
                  </div>
                  <div
                    className={`font-mono text-xl font-black tracking-tight tabular-nums ${
                      pinReading.faultyFlag ? 'text-rose-400' : 'text-emerald-300'
                    }`}
                  >
                    {displayValue}
                  </div>
                  <div className="text-[10.5px] font-medium text-emerald-100 leading-snug">
                    {isEn ? pinReading.noteEn : pinReading.noteVi}
                  </div>
                </div>

                {/* VOM Mode Selector (V / Ω / A) */}
                <div className="grid grid-cols-3 gap-1">
                  {(
                    [
                      ['V', isEn ? 'V (Volt)' : 'V (Áp)'],
                      ['R', isEn ? 'Ω (Ohm)' : 'Ω (Trở/Tụ)'],
                      ['A', isEn ? 'A (Amp)' : 'A (Dòng)']
                    ] as const
                  ).map(([m, lbl]) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setVomMode(m);
                        playBenchSfx('probe');
                      }}
                      className={`py-1 rounded border text-[11px] font-mono font-bold cursor-pointer ${
                        vomMode === m
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                {/* 4 Test Point Buttons (syncs 3D Red Probe!) */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">
                    {isEn ? 'Touch 3D Test Pin (or click pin on model):' : 'Chạm Que Đo 3D (hoặc bấm trực tiếp chân trên 3D):'}
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {device.testPoints.map((tp) => {
                      const active = activePin === tp.id;
                      const tpFault = scenario.readings[tp.id][isRepaired ? 'fixed' : 'broken'].faultyFlag;
                      return (
                        <button
                          key={tp.id}
                          type="button"
                          onClick={() => {
                            setActivePin(tp.id);
                            playBenchSfx('probe');
                          }}
                          className={`py-1.5 rounded border text-[11px] font-mono font-extrabold cursor-pointer ${
                            active
                              ? 'bg-rose-500 border-rose-300 text-white'
                              : tpFault
                              ? 'bg-rose-950/50 border-rose-500/50 text-rose-300 hover:border-rose-400'
                              : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-400'
                          }`}
                        >
                          {tp.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-amber-300/90 leading-snug pt-1 border-t border-slate-800">
                  {isEn ? scenario.clueEn : scenario.clueVi}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Selected 3D Component */}
                <div className="rounded bg-slate-900/90 border border-slate-700 p-2 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold text-amber-300 truncate">
                      {isEn ? selectedPart.nameEn : selectedPart.nameVi}
                    </span>
                    <span className="font-mono text-[10px] text-cyan-300 shrink-0">
                      {selectedPart.specs}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-300 leading-snug">
                    {isEn ? selectedPart.roleEn : selectedPart.roleVi}
                  </p>
                </div>

                {/* Replacement Component Choices */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono font-bold text-slate-300">
                    {isEn ? 'Choose Replacement & Solder:' : 'Chọn Linh Kiện Thay Thế & Hàn:'}
                  </div>
                  {scenario.repairChoices.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      disabled={isRepaired}
                      onClick={() => handleAttemptRepair(ch)}
                      className={`w-full text-left px-2.5 py-1.5 rounded border text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-55 ${
                        isRepaired && ch.correct
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-slate-900 border-slate-700 hover:border-amber-400 text-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{isEn ? ch.labelEn : ch.labelVi}</span>
                        <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>

                {repairFeedback && (
                  <div
                    className={`rounded border px-2.5 py-1.5 text-[10.5px] leading-snug ${
                      repairFeedback.ok
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    {repairFeedback.text}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapsible Bottom Control Dock (Explode Slider + Power Test + Part Selector) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[min(940px,95vw)] flex flex-col items-center">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="px-3 py-1 rounded-t bg-[#070f24]/95 border border-b-0 border-amber-500/40 text-[10px] font-mono font-bold text-amber-200 cursor-pointer"
        >
          {dockCollapsed
            ? isEn ? '▴ Show Teardown & Power Dock' : '▴ Mở Thanh Tách Lớp & Nguồn'
            : isEn ? '▾ Hide Dock' : '▾ Thu Gọn Thanh Điều Khiển'}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded bg-[#070f24]/95 border border-amber-500/40 p-2.5 sm:p-3 space-y-2 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Exploded Slider */}
              <div className="flex items-center gap-2.5 flex-1 min-w-[230px]">
                <Layers className="w-4 h-4 text-sky-300 shrink-0" />
                <span className="text-[11px] font-mono font-bold text-sky-200 whitespace-nowrap">
                  {isEn ? `Explode: ${explodePct}%` : `Tách lớp 3D: ${explodePct}%`}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  className="flex-1 accent-sky-400 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setExplodePct((v) => (v > 50 ? 0 : 100))}
                  className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-sky-400 text-[10px] font-bold text-slate-200 cursor-pointer whitespace-nowrap"
                >
                  {explodePct > 50 ? (isEn ? 'Assemble' : 'Lắp Lại') : isEn ? 'Explode All' : 'Tách Hết'}
                </button>
              </div>

              {/* Power ON/OFF Test Button */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setDrawerTab('repair');
                    setDrawerCollapsed(false);
                  }}
                  className="px-2.5 py-1.5 rounded bg-slate-900 border border-amber-400/50 hover:border-amber-300 text-xs font-bold text-amber-200 cursor-pointer whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5 inline mr-1" />
                  {isEn ? 'Part Inspector' : 'Sửa Linh Kiện'}
                </button>

                <button
                  type="button"
                  onClick={handleTogglePower}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-extrabold border cursor-pointer whitespace-nowrap transition-colors ${
                    powerOn && isRepaired
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                      : powerOn
                      ? 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-slate-800 border-slate-600 hover:border-emerald-400 text-slate-100'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>
                    {powerOn
                      ? isRepaired
                        ? isEn ? 'POWER ON · OK (+40 XP)' : 'ĐANG CHẠY TỐT (+40 XP)'
                        : isEn ? 'POWER ON · FAULT!' : 'NGUỒN BẬT · VẪN LỖI!'
                      : isEn ? 'Power Test' : 'Bật Nguồn Kiểm Tra'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Clickable Part Strip */}
            <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-slate-800/90">
              {device.parts.map((p) => {
                const active = p.id === selectedPartId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPartId(p.id);
                      setDrawerTab('repair');
                      setDrawerCollapsed(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-sky-500 border-sky-300 text-slate-950 font-bold'
                        : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-sky-400/60'
                    }`}
                  >
                    {isEn ? p.nameEn : p.nameVi}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
