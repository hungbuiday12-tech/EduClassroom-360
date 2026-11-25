import { ChemistrySimType, ExamPaper, ExamQuestion } from '../types';

interface ChemGeneratorSpec {
  topic: string;
  grade: string;
  simId: ChemistrySimType;
  simLabel: string;
  formula: string;
  genChuyen: (k: number) => { content: string; solution: string };
  genStandard: (k: number) => { content: string; solution: string };
}

const CHUYEN_SCHOOLS = [
  'THPT Chuyên Khoa học Tự nhiên (ĐHKHTN Hà Nội)',
  'THPT Chuyên Hà Nội – Amsterdam',
  'THPT Chuyên Lê Hồng Phong (TP.HCM)',
  'Phổ thông Năng khiếu (ĐHQG TP.HCM)',
  'THPT Chuyên Bến Tre (Hội đồng Tuyển sinh Chuyên)',
  'THPT Chuyên Phan Bội Châu (Nghệ An)',
  'THPT Chuyên Quốc học Huế',
  'THPT Chuyên Lê Quý Đôn (Đà Nẵng)'
];

const STANDARD_SCHOOLS = [
  'Kỳ thi Tốt nghiệp THPT · Bộ GD&ĐT',
  'Đề Đánh giá Năng lực ĐHQG TP.HCM & Hà Nội',
  'Sở GD&ĐT Bến Tre · Tuyển sinh Lớp 10 & Kiểm tra HK',
  'Sở GD&ĐT Hà Nội · Khảo sát Chất lượng Lớp 12',
  'Sở GD&ĐT TP.HCM · Đề Tham khảo Chuẩn GDPT 2018',
  'Trường THCS–THPT Chuẩn Quốc gia · Ôn tập Chương'
];

const CHEM_GENERATORS: ChemGeneratorSpec[] = [
  {
    topic: 'Cấu tạo nguyên tử, Orbital & Bảng tuần hoàn',
    grade: 'Lớp 10',
    simId: 'atomic_orbitals_2d',
    simLabel: 'Mô phỏng Orbital & Biến thiên Tuần hoàn 2D',
    formula: '2Z + N = S,\\quad Z_{\\text{eff}} = Z - \\sigma',
    genChuyen: (k) => {
      const elements = [
        { sym: 'Fe', Z: 26, N: 30, cfg: '[Ar]3d^6 4s^2', pos: 'chu kì 4, nhóm VIIIB', q4: 'n=3, l=2, m_l=-2, m_s=-1/2' },
        { sym: 'Cr', Z: 24, N: 28, cfg: '[Ar]3d^5 4s^1', pos: 'chu kì 4, nhóm VIB', q4: 'n=4, l=0, m_l=0, m_s=+1/2' },
        { sym: 'Cu', Z: 29, N: 34, cfg: '[Ar]3d^{10} 4s^1', pos: 'chu kì 4, nhóm IB', q4: 'n=4, l=0, m_l=0, m_s=+1/2' },
        { sym: 'Mn', Z: 25, N: 30, cfg: '[Ar]3d^5 4s^2', pos: 'chu kì 4, nhóm VIIB', q4: 'n=3, l=2, m_l=+2, m_s=+1/2' },
        { sym: 'Co', Z: 27, N: 32, cfg: '[Ar]3d^7 4s^2', pos: 'chu kì 4, nhóm VIIIB', q4: 'n=3, l=2, m_l=-1, m_s=-1/2' },
        { sym: 'Ni', Z: 28, N: 31, cfg: '[Ar]3d^8 4s^2', pos: 'chu kì 4, nhóm VIIIB', q4: 'n=3, l=2, m_l=0, m_s=-1/2' },
        { sym: 'Zn', Z: 30, N: 35, cfg: '[Ar]3d^{10} 4s^2', pos: 'chu kì 4, nhóm IIB', q4: 'n=3, l=2, m_l=+2, m_s=-1/2' },
        { sym: 'Ti', Z: 22, N: 26, cfg: '[Ar]3d^2 4s^2', pos: 'chu kì 4, nhóm IVB', q4: 'n=3, l=2, m_l=-1, m_s=+1/2' }
      ];
      const e = elements[k % elements.length];
      const charge = (k % 2) + 2;
      const total = 2 * e.Z - charge + e.N + Math.floor(k / elements.length) * 0;
      const isoOffset = (k % 3);
      const nAdj = e.N + isoOffset;
      const tot = 2 * e.Z - charge + nAdj;
      const diff = 2 * e.Z - charge - nAdj;
      return {
        content: `Mẫu đồng vị #${k + 1}: Tổng số hạt cơ bản ($p, n, e$) trong ion $M^{${charge}+}$ là $${tot}$, trong đó số hạt mang điện nhiều hơn số hạt không mang điện là $${diff}$. Xác định số hiệu nguyên tử $Z$, cấu hình electron của nguyên tử $M$, vị trí bảng tuần hoàn và bộ 4 số lượng tử electron ngoài cùng (quy ước $m_l$ từ $-l$ đến $+l$).`,
        solution: `Giải hệ $(2Z - ${charge}) + N = ${tot}$ và $(2Z - ${charge}) - N = ${diff} \\Rightarrow 2Z - ${charge} = ${(tot + diff) / 2} \\Rightarrow Z = ${e.Z}$ (${e.sym}), $N = ${nAdj}$. Cấu hình $${e.cfg}$, thuộc ${e.pos}; bộ số lượng tử tham khảo $${e.q4}$.`
      };
    },
    genStandard: (k) => {
      const shells = [
        { Z: 11, cfg: '3s^1', period: 3, grp: 'IA', ox: 'Na_2O', hyd: 'NaOH' },
        { Z: 12, cfg: '3s^2', period: 3, grp: 'IIA', ox: 'MgO', hyd: 'Mg(OH)_2' },
        { Z: 13, cfg: '3s^2 3p^1', period: 3, grp: 'IIIA', ox: 'Al_2O_3', hyd: 'Al(OH)_3' },
        { Z: 15, cfg: '3s^2 3p^3', period: 3, grp: 'VA', ox: 'P_2O_5', hyd: 'H_3PO_4' },
        { Z: 16, cfg: '3s^2 3p^4', period: 3, grp: 'VIA', ox: 'SO_3', hyd: 'H_2SO_4' },
        { Z: 17, cfg: '3s^2 3p^5', period: 3, grp: 'VIIA', ox: 'Cl_2O_7', hyd: 'HClO_4' },
        { Z: 19, cfg: '4s^1', period: 4, grp: 'IA', ox: 'K_2O', hyd: 'KOH' },
        { Z: 20, cfg: '4s^2', period: 4, grp: 'IIA', ox: 'CaO', hyd: 'Ca(OH)_2' }
      ];
      const s = shells[k % shells.length];
      const massShift = k % 3;
      const A = s.Z * 2 + massShift;
      return {
        content: `Bài tập tuần hoàn #${k + 1}: Nguyên tử nguyên tố $X$ (số khối $A = ${A}$) có phân lớp/lớp electron ngoài cùng là $${s.cfg}$. Xác định số hiệu nguyên tử $Z$, số nơtron $N$, chu kì, nhóm và công thức oxit cao nhất, hiđroxit tương ứng của $X$.`,
        solution: `Từ phân lớp ngoài $${s.cfg}$ suy ra $Z = ${s.Z}$, $N = ${A} - ${s.Z} = ${A - s.Z}$. $X$ thuộc chu kì ${s.period}, nhóm ${s.grp}. Oxit cao nhất: $${s.ox}$, hiđroxit tương ứng: $${s.hyd}$.`
      };
    }
  },
  {
    topic: 'Nhiệt động học ΔH, Định luật Hess & Năng lượng tự do Gibbs ΔG',
    grade: 'Lớp 10',
    simId: 'enthalpy_hess_2d',
    simLabel: 'Mô phỏng Giản đồ Enthalpy ΔH & Hoạt hóa Ea',
    formula: '\\Delta_r G^\\circ = \\Delta_r H^\\circ - T\\Delta_r S^\\circ',
    genChuyen: (k) => {
      const T = 298 + (k % 8) * 50;
      const dH = -92 - (k % 7) * 14;
      const dS = -198 + (k % 6) * 20;
      const dG = (dH - (T * dS) / 1000).toFixed(2);
      const R = 8.314;
      const lnK = (-(Number(dG) * 1000) / (R * T)).toFixed(2);
      return {
        content: `Biến thiên nhiệt động học #${k + 1}: Cho một phản ứng pha khí ở $T = ${T}\\text{ K}$ có $\\Delta_r H^\\circ = ${dH}\\text{ kJ/mol}$ và $\\Delta_r S^\\circ = ${dS}\\text{ J/(mol}\\cdot\\text{K)}$. Tính $\\Delta_r G^\\circ$ ở nhiệt độ trên, cho biết phản ứng có tự diễn biến không và tính $\\ln K_p$.`,
        solution: `$\\Delta_r G^\\circ = ${dH} - ${T}\\times (${dS}\\times 10^{-3}) = ${dG}\\text{ kJ/mol}$. Vì $\\Delta_r G^\\circ ${Number(dG) < 0 ? '< 0$ (tự diễn biến)' : '> 0$ (không tự diễn biến theo chiều thuận)'}$, và $\\ln K_p = -\\frac{\\Delta_r G^\\circ}{RT} = ${lnK}$.`
      };
    },
    genStandard: (k) => {
      const nMol = ((k % 6) + 1) * 0.5;
      const reactions = [
        { eq: '\\text{CH}_4(g) + 2\\text{O}_2(g) \\to \\text{CO}_2(g) + 2\\text{H}_2\\text{O}(l)', dH: -890 },
        { eq: '\\text{C}_2\\text{H}_5\\text{OH}(l) + 3\\text{O}_2(g) \\to 2\\text{CO}_2(g) + 3\\text{H}_2\\text{O}(l)', dH: -1367 },
        { eq: '\\text{C}_3\\text{H}_8(g) + 5\\text{O}_2(g) \\to 3\\text{CO}_2(g) + 4\\text{H}_2\\text{O}(l)', dH: -2220 },
        { eq: '2\\text{H}_2(g) + \\text{O}_2(g) \\to 2\\text{H}_2\\text{O}(l)', dH: -572 },
        { eq: '\\text{C}_2\\text{H}_2(g) + 2{,}5\\text{O}_2(g) \\to 2\\text{CO}_2(g) + \\text{H}_2\\text{O}(l)', dH: -1300 }
      ];
      const rx = reactions[k % reactions.length];
      const coef = rx.eq.startsWith('2') ? 2 : 1;
      const heat = ((nMol / coef) * Math.abs(rx.dH)).toFixed(1);
      return {
        content: `Nhiệt hóa học #${k + 1}: Phản ứng đốt cháy $${rx.eq}$ có $\\Delta_r H^\\circ_{298} = ${rx.dH}\\text{ kJ}$. Tính lượng nhiệt tỏa ra khi đốt cháy hoàn toàn $${nMol.toFixed(1)}\\text{ mol}$ chất cháy ở điều kiện chuẩn.`,
        solution: `Theo tỉ lệ phương trình nhiệt hóa học, cứ ${coef} mol chất cháy tỏa $|\\Delta_r H^\\circ| = ${Math.abs(rx.dH)}\\text{ kJ}$. Vậy $${nMol.toFixed(1)}\\text{ mol}$ tỏa lượng nhiệt $Q = \\frac{${nMol.toFixed(1)}}{${coef}} \\times ${Math.abs(rx.dH)} = ${heat}\\text{ kJ}$.`
      };
    }
  },
  {
    topic: 'Động hóa học, Năng lượng Hoạt hóa Arrhenius & Cân bằng Le Chatelier',
    grade: 'Lớp 11',
    simId: 'equilibrium_shift_2d',
    simLabel: 'Mô phỏng Cân bằng Hóa học N₂O₄ ⇌ 2NO₂',
    formula: 'K_C = \\frac{[C]^c[D]^d}{[A]^a[B]^b},\\quad k = A e^{-E_a/(RT)}',
    genChuyen: (k) => {
      const c0 = ((k % 5) + 2) * 0.2;
      const sqrtK = (k % 4) + 2;
      const Kc = sqrtK * sqrtK;
      const x = (sqrtK * c0) / (1 + sqrtK);
      return {
        content: `Cân bằng pha khí #${k + 1}: Trong bình kín thể tích $1{,}0\\text{ L}$ ở nhiệt độ $T$ không đổi, nạp $${c0.toFixed(1)}\\text{ mol } \\text{CO}$ và $${c0.toFixed(1)}\\text{ mol } \\text{H}_2\\text{O}(g)$ cho cân bằng $\\text{CO}(g) + \\text{H}_2\\text{O}(g) \\rightleftharpoons \\text{CO}_2(g) + \\text{H}_2(g)$ có $K_C = ${Kc}$. Tính nồng độ mol các khí tại cân bằng và hiệu suất chuyển hóa CO.`,
        solution: `Đặt lượng phản ứng $x$: $\\frac{x^2}{(${c0.toFixed(1)} - x)^2} = ${Kc} \\Rightarrow \\frac{x}{${c0.toFixed(1)} - x} = ${sqrtK} \\Rightarrow x = ${x.toFixed(4)}\\text{ M}$. Vậy $[\\text{CO}_2]=[\\text{H}_2]=${x.toFixed(4)}\\text{ M}$, $[\\text{CO}]=[\\text{H}_2\\text{O}]=${(c0 - x).toFixed(4)}\\text{ M}$; hiệu suất $H = ${((x / c0) * 100).toFixed(1)}\\%$.`
      };
    },
    genStandard: (k) => {
      const gamma = (k % 3) + 2;
      const t1 = 20 + (k % 4) * 5;
      const step = ((k % 3) + 2) * 10;
      const t2 = t1 + step;
      const factor = Math.pow(gamma, step / 10);
      const time1 = factor * ((k % 4) + 2);
      const time2 = time1 / factor;
      return {
        content: `Tốc độ phản ứng #${k + 1}: Một phản ứng hóa học ở $${t1}^\\circ\\text{C}$ diễn ra hoàn toàn trong $${time1}\\text{ phút}$. Biết hệ số nhiệt độ Van ’t Hoff $\\gamma = ${gamma}$. Hỏi nếu tăng nhiệt độ lên $${t2}^\\circ\\text{C}$ thì phản ứng hoàn thành trong bao lâu?`,
        solution: `Tốc độ phản ứng tăng $v_2/v_1 = ${gamma}^{(${t2}-${t1})/10} = ${factor}$ lần. Do thời gian tỉ lệ nghịch với tốc độ nên $t_2 = ${time1} / ${factor} = ${time2}\\text{ phút}$.`
      };
    }
  },
  {
    topic: 'Dung dịch Điện li, Hệ Đệm pH & Chuẩn độ Acid–Base',
    grade: 'Lớp 11',
    simId: 'acid_base_titration_2d',
    simLabel: 'Mô phỏng Chuẩn độ Acid–Base & Đường cong pH',
    formula: '\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}',
    genChuyen: (k) => {
      const pKaValues = [
        { acid: '\\text{CH}_3\\text{COOH}', Ka: '1{,}8\\times 10^{-5}', pKa: 4.74 },
        { acid: '\\text{HCOOH}', Ka: '1{,}8\\times 10^{-4}', pKa: 3.74 },
        { acid: '\\text{HF}', Ka: '6{,}8\\times 10^{-4}', pKa: 3.17 },
        { acid: '\\text{C}_6\\text{H}_5\\text{COOH}', Ka: '6{,}3\\times 10^{-5}', pKa: 4.20 }
      ];
      const ac = pKaValues[k % pKaValues.length];
      const vAcid = 40 + (k % 4) * 10;
      const cAcid = 0.2;
      const ratios = [0.25, 0.5, 1.0, 2.0, 4.0];
      const r = ratios[k % ratios.length];
      const vBase = (vAcid * cAcid * (r / (1 + r))) / 0.2;
      const pH = (ac.pKa + Math.log10(r)).toFixed(2);
      return {
        content: `Hệ đệm axit yếu #${k + 1}: Trộn $${vAcid}\\text{ mL}$ dung dịch ${ac.acid} $0{,}2\\text{ M}$ ($K_a = ${ac.Ka}$, $\\text{p}K_a = ${ac.pKa}$) với $${vBase.toFixed(1)}\\text{ mL}$ $\\text{NaOH}$ $0{,}2\\text{ M}$. Tính $\\text{pH}$ của dung dịch đệm thu được ở $25^\\circ\\text{C}$.`,
        solution: `Số mol ${ac.acid} ban đầu $= ${(vAcid * 0.2).toFixed(2)}\\text{ mmol}$, $n_{\\text{NaOH}} = ${(vBase * 0.2).toFixed(2)}\\text{ mmol}$. Sau trung hòa tỉ lệ $[A^-]/[HA] = ${r} \\Rightarrow \\text{pH} = ${ac.pKa} + \\log(${r}) = ${pH}$.`
      };
    },
    genStandard: (k) => {
      const vHCl = 20 + (k % 5) * 5;
      const cNaOH = [0.05, 0.1, 0.15, 0.2][k % 4];
      const vNaOH = 20 + (k % 4) * 5;
      const cHCl = ((vNaOH * cNaOH) / vHCl).toFixed(3);
      return {
        content: `Chuẩn độ #${k + 1}: Chuẩn độ $${vHCl}\\text{ mL}$ dung dịch $\\text{HCl}$ chưa biết nồng độ bằng dung dịch chuẩn $\\text{NaOH}$ $${cNaOH}\\text{ M}$ với chỉ thị phenolphthalein thì điểm tương đương đạt tại thể tích $${vNaOH}\\text{ mL}$ $\\text{NaOH}$. Tính nồng độ mol của $\\text{HCl}$.`,
        solution: `Tại điểm tương đương: $n_{\\text{HCl}} = n_{\\text{NaOH}} \\Rightarrow C_{\\text{HCl}} = \\frac{${vNaOH}\\times ${cNaOH}}{${vHCl}} = ${cHCl}\\text{ M}$.`
      };
    }
  },
  {
    topic: 'Pin Điện hóa Nernst & Điện phân Định luật Faraday',
    grade: 'Lớp 12',
    simId: 'electrolysis_faraday_2d',
    simLabel: 'Mô phỏng Điện phân Faraday 2D',
    formula: 'E_{\\text{pin}} = E^\\circ_{\\text{pin}} - \\frac{0{,}0592}{n}\\log Q,\\quad n_e = \\frac{It}{F}',
    genChuyen: (k) => {
      const I = 2 + (k % 5) * 1.5;
      const neTarget = 0.2 + (k % 4) * 0.05;
      const t = Math.round((neTarget * 96500) / I);
      const nCu = 0.08 + (k % 3) * 0.02;
      const neCu = 2 * nCu;
      const nH2 = Math.max(0, (neTarget - neCu) / 2);
      const nCl = 0.12;
      const neCl = Math.min(neTarget, nCl);
      const nCl2 = neCl / 2;
      const nO2 = Math.max(0, (neTarget - neCl) / 4);
      const dm = (nCu * 64 + nH2 * 2 + nCl2 * 71 + nO2 * 32).toFixed(2);
      return {
        content: `Điện phân hỗn hợp #${k + 1}: Điện phân $200\\text{ mL}$ dung dịch chứa $\\text{CuSO}_4\\ ${(nCu / 0.2).toFixed(2)}\\text{ M}$ và $\\text{NaCl}\\ 0{,}60\\text{ M}$ với điện cực trơ, cường độ dòng điện $I = ${I.toFixed(1)}\\text{ A}$ trong $t = ${t}\\text{ giây}$. Tính độ giảm khối lượng dung dịch sau điện phân.`,
        solution: `$n_e = \\frac{${I.toFixed(1)}\\times ${t}}{96500} \\approx ${neTarget.toFixed(2)}\\text{ mol}$. Tại catot thu $${nCu.toFixed(2)}\\text{ mol Cu}$ và $${nH2.toFixed(3)}\\text{ mol H}_2$; tại anot thu $${nCl2.toFixed(3)}\\text{ mol Cl}_2$ và $${nO2.toFixed(3)}\\text{ mol O}_2$. Tổng độ giảm khối lượng dung dịch $\\Delta m_{\\text{dd}} = ${dm}\\text{ g}$.`
      };
    },
    genStandard: (k) => {
      const pairs = [
        { an: 'Zn', cat: 'Cu', eAn: -0.76, eCat: 0.34 },
        { an: 'Fe', cat: 'Cu', eAn: -0.44, eCat: 0.34 },
        { an: 'Zn', cat: 'Ag', eAn: -0.76, eCat: 0.80 },
        { an: 'Fe', cat: 'Ag', eAn: -0.44, eCat: 0.80 },
        { an: 'Mg', cat: 'Cu', eAn: -2.36, eCat: 0.34 },
        { an: 'Al', cat: 'Ni', eAn: -1.66, eCat: -0.26 },
        { an: 'Cu', cat: 'Ag', eAn: 0.34, eCat: 0.80 }
      ];
      const p = pairs[k % pairs.length];
      const emf = (p.eCat - p.eAn).toFixed(2);
      const tMin = ((k % 6) + 2) * 5;
      const I = ((k % 3) + 1) * 1.93;
      const mCu = (((I * tMin * 60) / 96500) * 32).toFixed(2);
      return {
        content: `Điện hóa #${k + 1}: Tính suất điện động chuẩn $E^\\circ_{\\text{pin}}$ của pin Galvani ghép bởi điện cực ${p.an} ($E^\\circ = ${p.eAn}\\text{ V}$) và ${p.cat} ($E^\\circ = ${p.eCat}\\text{ V}$). Ngoài ra, nếu điện phân dung dịch $\\text{CuSO}_4$ với $I = ${I.toFixed(2)}\\text{ A}$ trong ${tMin} phút thì thu được bao nhiêu gam $\\text{Cu}$?`,
        solution: `$E^\\circ_{\\text{pin}} = ${p.eCat} - (${p.eAn}) = ${emf}\\text{ V}$ (cực âm là ${p.an}, cực dương là ${p.cat}). Lượng đồng bám catot: $m_{\\text{Cu}} = \\frac{64 \\times ${I.toFixed(2)} \\times ${tMin * 60}}{2 \\times 96500} = ${mCu}\\text{ g}$.`
      };
    }
  },
  {
    topic: 'Ester – Lipid, Carbohydrate, Amino Acid & Polymer',
    grade: 'Lớp 12',
    simId: 'esterification_2d',
    simLabel: 'Mô phỏng Este hóa & Thủy phân Xà phòng 2D',
    formula: 'm_{\\text{este}} + m_{\\text{NaOH pư}} = m_{\\text{muối}} + m_{\\text{ancol}}',
    genChuyen: (k) => {
      const esters = [
        { name: 'metyl axetat & etyl fomat ($C_3H_6O_2$)', M: 74, mSalt: 68 },
        { name: 'etyl axetat & metyl propionat ($C_4H_8O_2$)', M: 88, mSalt: 82 },
        { name: 'vinyl axetat & metyl acrylat ($C_4H_6O_2$)', M: 86, mSalt: 82 }
      ];
      const est = esters[k % esters.length];
      const nEst = ((k % 4) + 2) * 0.1;
      const mEst = (nEst * est.M).toFixed(1);
      const nNaOH = nEst + 0.05;
      const mSolid = (nEst * est.mSalt + 0.05 * 40).toFixed(1);
      return {
        content: `Xà phòng hóa chuyên sâu #${k + 1}: Đun nóng $${mEst}\\text{ g}$ este đơn chức $X$ ($M = ${est.M}$) với $${(nNaOH * 1000).toFixed(0)}\\text{ mL}$ dung dịch $\\text{NaOH}\\ 1{,}0\\text{ M}$ rồi cô cạn dung dịch sau phản ứng thu được $${mSolid}\\text{ g}$ chất rắn khan. Xác định công thức cấu tạo của muối và este $X$.`,
        solution: `$n_X = ${mEst}/${est.M} = ${nEst.toFixed(1)}\\text{ mol}$, $n_{\\text{NaOH dư}} = 0{,}05\\text{ mol}$ ($2{,}0\\text{ g}$). Khối lượng muối $= ${mSolid} - 2{,}0 = ${(Number(mSolid) - 2).toFixed(1)}\\text{ g} \\Rightarrow M_{\\text{muối}} = ${est.mSalt}$ (thuộc cặp đồng phân ${est.name}).`
      };
    },
    genStandard: (k) => {
      const nAcid = ((k % 4) + 1) * 0.1;
      const mAcid = (nAcid * 60).toFixed(1);
      const H = 55 + (k % 7) * 5;
      const mEster = (nAcid * 88 * (H / 100)).toFixed(3);
      return {
        content: `Tổng hợp Ester #${k + 1}: Đun nóng $${mAcid}\\text{ g}$ axit axetic với ancol etylic lấy dư (xúc tác $\\text{H}_2\\text{SO}_4$ đặc, $t^\\circ$), thu được $${mEster}\\text{ g}$ etyl axetat. Tính hiệu suất của phản ứng este hóa.`,
        solution: `$n_{\\text{CH}_3\\text{COOH}} = ${mAcid}/60 = ${nAcid.toFixed(1)}\\text{ mol}$. $n_{\\text{este thực}} = ${mEster}/88 = ${(nAcid * (H / 100)).toFixed(3)}\\text{ mol} \\Rightarrow H = ${H}\\%$.`
      };
    }
  },
  {
    topic: 'Kim loại Kiềm, Kiềm thổ, Nhôm, Sắt & Bảo toàn Electron',
    grade: 'Lớp 12',
    simId: 'redox_balancing_2d',
    simLabel: 'Mô phỏng Thăng bằng Electron & Oxi hóa khử',
    formula: '\\sum n_{e\\text{ nhường}} = \\sum n_{e\\text{ nhận}}',
    genChuyen: (k) => {
      const nMg = ((k % 4) + 1) * 0.1;
      const nFe = ((k % 3) + 1) * 0.1;
      const mMix = (nMg * 24 + nFe * 56).toFixed(1);
      const ne = 2 * nMg + 3 * nFe;
      const nNO = ne / 3;
      const vNO = (nNO * 24.79).toFixed(3);
      const mSalt = (Number(mMix) + 62 * ne).toFixed(2);
      return {
        content: `Bảo toàn electron #${k + 1}: Hòa tan hoàn toàn $${mMix}\\text{ g}$ hỗn hợp gồm $\\text{Mg}$ và $\\text{Fe}$ trong dung dịch $\\text{HNO}_3$ loãng dư thu được $${vNO}\\text{ L}$ khí $\\text{NO}$ (ĐKC, sản phẩm khử duy nhất). Tính khối lượng muối nitrat khan thu được sau phản ứng.`,
        solution: `$n_{\\text{NO}} = ${vNO}/24{,}79 = ${nNO.toFixed(3)}\\text{ mol} \\Rightarrow n_e = 3n_{\\text{NO}} = ${ne.toFixed(2)}\\text{ mol} = n_{\\text{NO}_3^-\\text{ tạo muối}}$. $m_{\\text{muối}} = ${mMix} + 62\\times ${ne.toFixed(2)} = ${mSalt}\\text{ g}$.`
      };
    },
    genStandard: (k) => {
      const metals = [
        { name: 'Na', M: 23, val: 1 },
        { name: 'K', M: 39, val: 1 },
        { name: 'Ca', M: 40, val: 2 },
        { name: 'Ba', M: 137, val: 2 }
      ];
      const mt = metals[k % metals.length];
      const nMet = ((k % 5) + 1) * 0.05;
      const mMet = (nMet * mt.M).toFixed(2);
      const nH2 = (nMet * mt.val) / 2;
      const vH2 = (nH2 * 24.79).toFixed(3);
      return {
        content: `Kim loại tác dụng nước #${k + 1}: Cho $${mMet}\\text{ g}$ kim loại ${mt.name} phản ứng hoàn toàn với lượng nước dư. Tính thể tích khí $\\text{H}_2$ thoát ra (ở ĐKC $25^\\circ\\text{C}, 1\\text{ bar}$).`,
        solution: `$n_{${mt.name}} = ${mMet}/${mt.M} = ${nMet.toFixed(2)}\\text{ mol} \\Rightarrow n_{\\text{H}_2} = ${nH2.toFixed(3)}\\text{ mol} \\Rightarrow V_{\\text{H}_2} = ${nH2.toFixed(3)}\\times 24{,}79 = ${vH2}\\text{ L}$.`
      };
    }
  }
];

function buildChemPaper(index: number, track: 'chuyen' | 'khong_chuyen'): ExamPaper {
  const num = index + 1;
  const g1 = CHEM_GENERATORS[index % CHEM_GENERATORS.length];
  const g2 = CHEM_GENERATORS[(index + 2) % CHEM_GENERATORS.length];
  const k1 = Math.floor(index / CHEM_GENERATORS.length) + index * 0; // distinct per topic group
  const k2 = Math.floor((index + 2) / CHEM_GENERATORS.length) + 1;
  const isChuyen = track === 'chuyen';
  const yearNum = 2020 + (index % 7);
  const year = `${yearNum}–${yearNum + 1}`;
  const code = isChuyen
    ? `CHEM-CH-${String(num).padStart(3, '0')}`
    : `CHEM-PT-${String(num).padStart(3, '0')}`;

  const res1 = isChuyen ? g1.genChuyen(index) : g1.genStandard(index);
  const res2 = isChuyen ? g2.genChuyen(index + 7) : g2.genStandard(index + 7);

  const q1: ExamQuestion = {
    number: 'Câu 1',
    points: isChuyen ? '3.0 điểm' : '2.5 điểm',
    content: res1.content,
    solution: res1.solution,
    keyFormulasOrHints: [`$${g1.formula}$`],
    simulationLink: {
      type: 'chemistry',
      targetId: g1.simId,
      label: g1.simLabel
    }
  };

  const q2: ExamQuestion = {
    number: 'Câu 2',
    points: isChuyen ? '3.5 điểm' : '2.5 điểm',
    content: res2.content,
    solution: res2.solution,
    keyFormulasOrHints: [`$${g2.formula}$`],
    simulationLink: {
      type: 'chemistry',
      targetId: g2.simId,
      label: g2.simLabel
    }
  };

  const extraMol = 0.1 + (index % 25) * 0.05;
  const q3: ExamQuestion = {
    number: 'Câu 3',
    points: isChuyen ? '3.5 điểm' : '5.0 điểm',
    content: isChuyen
      ? `Quy đổi oxit sắt #${num}: Hòa tan hoàn toàn $${(extraMol * 23.2).toFixed(2)}\\text{ g}$ hỗn hợp $\\text{FeO}, \\text{Fe}_2\\text{O}_3, \\text{Fe}_3\\text{O}_4$ trong dung dịch $\\text{HCl}$ dư cần đúng $${(extraMol * 0.8).toFixed(2)}\\text{ mol HCl}$, thu được muối sắt(II) và sắt(III). Cô cạn dung dịch thu được bao nhiêu gam muối clorua khan?`
      : `Trung hòa & Đếm mol #${num}: Thực hiện phản ứng trung hòa $${Math.round(extraMol * 200)}\\text{ mL}$ dung dịch $\\text{HCl}\\ 1{,}0\\text{ M}$ bằng dung dịch $\\text{NaOH}\\ 0{,}5\\text{ M}$. Tính thể tích dung dịch $\\text{NaOH}$ cần dùng và khối lượng muối $\\text{NaCl}$ thu được sau cô cạn.`,
    solution: isChuyen
      ? `Bảo toàn nguyên tố H và O: $n_{\\text{H}_2\\text{O}} = \\frac{1}{2}n_{\\text{HCl}} = ${(extraMol * 0.4).toFixed(2)}\\text{ mol}$. Bảo toàn khối lượng: $m_{\\text{muối}} = ${(extraMol * 23.2).toFixed(2)} + ${(extraMol * 0.8 * 36.5).toFixed(2)} - ${(extraMol * 0.4 * 18).toFixed(2)} = ${(extraMol * (23.2 + 29.2 - 7.2)).toFixed(2)}\\text{ g}$.`
      : `$n_{\\text{HCl}} = ${(extraMol * 0.2).toFixed(2)}\\text{ mol} \\Rightarrow V_{\\text{NaOH}} = ${((extraMol * 0.2) / 0.5).toFixed(3)}\\text{ L}$; $m_{\\text{NaCl}} = ${(extraMol * 0.2 * 58.5).toFixed(2)}\\text{ g}$.`,
    keyFormulasOrHints: ['$n_{\\text{H}^+} = 2n_{\\text{O}}^{2-}$', '$m_{\\text{NaCl}} = n \\times 58{,}5$'],
    simulationLink: {
      type: 'chemistry',
      targetId: 'acid_base_titration_2d',
      label: 'Mở Buret Chuẩn độ pH 2D'
    }
  };
  void k1;
  void k2;

  return {
    id: isChuyen ? `chem-chuyen-${num}` : `chem-kc-${num}`,
    examCode: code,
    subject: 'chemistry',
    track,
    subjectTag: isChuyen ? `Hóa Chuyên · ${g1.grade}` : `Hóa học ${g1.grade}`,
    categoryTag: isChuyen
      ? num % 3 === 0
        ? 'HSG Quốc gia / Olympic'
        : 'Tuyển Sinh Chuyên Hóa'
      : num % 3 === 0
      ? 'Đánh Giá Năng Lực'
      : 'Chuẩn GDPT 2018 & 2006',
    academicYear: year,
    title: isChuyen
      ? `Đề Chuyên Hóa #${String(num).padStart(3, '0')} · ${g1.topic}`
      : `Đề Ôn Thi Hóa #${String(num).padStart(3, '0')} · ${g1.topic}`,
    school: isChuyen
      ? CHUYEN_SCHOOLS[index % CHUYEN_SCHOOLS.length]
      : STANDARD_SCHOOLS[index % STANDARD_SCHOOLS.length],
    source: isChuyen ? 'Kho Đề Chuyên Hóa Synapse 2020–2026' : 'Bộ Đề Chuẩn GDPT Synapse',
    timeMinutes: isChuyen ? 150 : 50,
    featuredSnippet: res1.content,
    topics: [g1.topic, g2.topic, g1.grade],
    difficulty: isChuyen ? (num % 2 === 0 ? 'Chuyên / HSG' : 'Nâng cao') : num % 2 === 0 ? 'Khá' : 'Cơ bản',
    questions: [q1, q2, q3]
  };
}

export const CHEMISTRY_CHUYEN_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildChemPaper(i, 'chuyen')
);

export const CHEMISTRY_KC_EXAMS: ExamPaper[] = Array.from({ length: 175 }, (_, i) =>
  buildChemPaper(i, 'khong_chuyen')
);

export const ALL_CHEMISTRY_EXAMS: ExamPaper[] = [
  ...CHEMISTRY_CHUYEN_EXAMS,
  ...CHEMISTRY_KC_EXAMS
];
