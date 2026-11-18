import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Brain, Cpu, Play, Pause, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  NeuralGraphSnapshot,
  SiliconDieSnapshot,
  SiliconNeural3DViewport
} from './SiliconNeural3DViewport';

type PlaygroundTab = 'silicon' | 'neural';

// ============================================================================
// TAB A: SILICON DIGITAL LOGIC & 4-BIT ADDER / FLIP-FLOP LAB
// ============================================================================
type CircuitPresetId = 'full_adder' | 'adder_4bit' | 'sr_latch' | 'mux_alu';

// ============================================================================
// TAB B: LIVE NEURAL NETWORK BACKPROP PLAYGROUND
// ============================================================================
type DatasetKind = 'spiral' | 'circle' | 'xor' | 'linear';
type ActivationKind = 'tanh' | 'relu' | 'sigmoid';

interface DataPt {
  x: number;
  y: number;
  label: number; // +1 or -1
}

function generateDataset(kind: DatasetKind, count = 160): DataPt[] {
  const pts: DataPt[] = [];
  for (let i = 0; i < count; i++) {
    const cls = i < count / 2 ? 1 : -1;
    if (kind === 'circle') {
      const r = cls === 1 ? Math.random() * 0.42 : 0.56 + Math.random() * 0.36;
      const a = Math.random() * Math.PI * 2;
      pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, label: cls });
    } else if (kind === 'xor') {
      const x = (Math.random() * 0.8 + 0.12) * (Math.random() < 0.5 ? 1 : -1);
      const y = (Math.random() * 0.8 + 0.12) * (x * cls > 0 ? 1 : -1);
      pts.push({ x, y, label: cls });
    } else if (kind === 'spiral') {
      const half = count / 2;
      const idx = i % half;
      const r = (idx / half) * 0.92;
      const t = (1.75 * idx) / half * 2 * Math.PI + (cls === -1 ? Math.PI : 0) + (Math.random() - 0.5) * 0.25;
      pts.push({ x: r * Math.sin(t), y: r * Math.cos(t), label: cls });
    } else {
      const x = Math.random() * 1.8 - 0.9;
      const y = Math.random() * 1.8 - 0.9;
      pts.push({ x, y, label: x + y * 0.8 > 0 ? 1 : -1 });
    }
  }
  return pts;
}

class TinyMLP {
  sizes: number[];
  weights: number[][][]; // [layer][to][from]
  biases: number[][];
  activation: ActivationKind;

  constructor(hiddenNeurons: number, hiddenLayers: number, activation: ActivationKind) {
    this.activation = activation;
    this.sizes = [2];
    for (let i = 0; i < hiddenLayers; i++) this.sizes.push(hiddenNeurons);
    this.sizes.push(1);

    this.weights = [];
    this.biases = [];
    for (let l = 1; l < this.sizes.length; l++) {
      const prev = this.sizes[l - 1];
      const cur = this.sizes[l];
      const scale = Math.sqrt(2 / (prev + cur));
      const wLayer: number[][] = [];
      const bLayer: number[] = [];
      for (let j = 0; j < cur; j++) {
        const row: number[] = [];
        for (let k = 0; k < prev; k++) {
          row.push((Math.random() * 2 - 1) * scale * 1.4);
        }
        wLayer.push(row);
        bLayer.push((Math.random() - 0.5) * 0.2);
      }
      this.weights.push(wLayer);
      this.biases.push(bLayer);
    }
  }

  act(z: number, isOut: boolean): number {
    if (isOut || this.activation === 'tanh') return Math.tanh(z);
    if (this.activation === 'relu') return z > 0 ? z : 0.05 * z;
    return 1 / (1 + Math.exp(-z)) * 2 - 1;
  }

  actDeriv(a: number, z: number, isOut: boolean): number {
    if (isOut || this.activation === 'tanh') return 1 - a * a;
    if (this.activation === 'relu') return z > 0 ? 1 : 0.05;
    const s = (a + 1) * 0.5;
    return 2 * s * (1 - s);
  }

  forward(x: number, y: number): { acts: number[][]; zs: number[][] } {
    const acts: number[][] = [[x, y]];
    const zs: number[][] = [[]];
    for (let l = 0; l < this.weights.length; l++) {
      const isOut = l === this.weights.length - 1;
      const prevA = acts[l];
      const nextA: number[] = [];
      const nextZ: number[] = [];
      for (let j = 0; j < this.weights[l].length; j++) {
        let z = this.biases[l][j];
        for (let k = 0; k < prevA.length; k++) {
          z += this.weights[l][j][k] * prevA[k];
        }
        nextZ.push(z);
        nextA.push(this.act(z, isOut));
      }
      zs.push(nextZ);
      acts.push(nextA);
    }
    return { acts, zs };
  }

  trainEpoch(data: DataPt[], lr: number): number {
    let totalLoss = 0;
    for (const pt of data) {
      const { acts, zs } = this.forward(pt.x, pt.y);
      const L = this.weights.length;
      const pred = acts[L][0];
      const err = pred - pt.label;
      totalLoss += 0.5 * err * err;

      // Backprop deltas
      let deltaNext = [err * this.actDeriv(pred, zs[L][0], true)];
      for (let l = L - 1; l >= 0; l--) {
        const deltaCur = new Array(this.sizes[l]).fill(0);
        for (let j = 0; j < this.weights[l].length; j++) {
          const d = deltaNext[j];
          this.biases[l][j] -= lr * d;
          for (let k = 0; k < this.sizes[l]; k++) {
            deltaCur[k] += this.weights[l][j][k] * d;
            this.weights[l][j][k] -= lr * d * acts[l][k];
          }
        }
        if (l > 0) {
          for (let k = 0; k < this.sizes[l]; k++) {
            deltaCur[k] *= this.actDeriv(acts[l][k], zs[l][k], false);
          }
          deltaNext = deltaCur;
        }
      }
    }
    return totalLoss / Math.max(1, data.length);
  }
}

export const SiliconNeuralPlayground: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [tab, setTab] = useState<PlaygroundTab>('neural');

  // === Silicon Logic State ===
  const [circuitPreset, setCircuitPreset] = useState<CircuitPresetId>('adder_4bit');
  const [bitsA, setBitsA] = useState<[number, number, number, number]>([0, 1, 0, 1]); // 5
  const [bitsB, setBitsB] = useState<[number, number, number, number]>([0, 0, 1, 1]); // 3
  const [carryIn, setCarryIn] = useState<number>(0);
  const [srSet, setSrSet] = useState<number>(1);
  const [srReset, setSrReset] = useState<number>(0);
  const [srQ, setSrQ] = useState<number>(1);
  const [clockTick, setClockTick] = useState<number>(0);
  const [autoClock, setAutoClock] = useState<boolean>(false);

  useEffect(() => {
    if (!autoClock || tab !== 'silicon') return;
    const id = window.setInterval(() => {
      setClockTick((t) => t + 1);
      setBitsA((prev) => {
        const val = (prev[0] * 8 + prev[1] * 4 + prev[2] * 2 + prev[3] + 1) % 16;
        return [(val >> 3) & 1, (val >> 2) & 1, (val >> 1) & 1, val & 1];
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [autoClock, tab]);

  const adder4Result = useMemo(() => {
    let c = carryIn;
    const sumBits = [0, 0, 0, 0];
    const carries = [0, 0, 0, 0];
    for (let i = 3; i >= 0; i--) {
      const s = bitsA[i] ^ bitsB[i] ^ c;
      c = (bitsA[i] & bitsB[i]) | (c & (bitsA[i] ^ bitsB[i]));
      sumBits[i] = s;
      carries[i] = c;
    }
    const decA = bitsA[0] * 8 + bitsA[1] * 4 + bitsA[2] * 2 + bitsA[3];
    const decB = bitsB[0] * 8 + bitsB[1] * 4 + bitsB[2] * 2 + bitsB[3];
    const decSum = c * 16 + sumBits[0] * 8 + sumBits[1] * 4 + sumBits[2] * 2 + sumBits[3];
    return { sumBits, carries, cout: c, decA, decB, decSum };
  }, [bitsA, bitsB, carryIn]);

  const siliconSnap: SiliconDieSnapshot = useMemo(
    () => ({
      circuitPreset,
      bitsA,
      bitsB,
      carryIn,
      sumBits: adder4Result.sumBits,
      carries: adder4Result.carries,
      cout: adder4Result.cout,
      srSet,
      srReset,
      srQ
    }),
    [adder4Result, bitsA, bitsB, carryIn, circuitPreset, srQ, srReset, srSet]
  );

  // === Neural Playground State ===
  const [datasetKind, setDatasetKind] = useState<DatasetKind>('spiral');
  const [hiddenLayers, setHiddenLayers] = useState<number>(2);
  const [hiddenNeurons, setHiddenNeurons] = useState<number>(6);
  const [activation, setActivation] = useState<ActivationKind>('tanh');
  const [learningRate, setLearningRate] = useState<number>(0.04);
  const [isTraining, setIsTraining] = useState<boolean>(true);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossVal, setLossVal] = useState<number>(0.5);

  const dataRef = useRef<DataPt[]>(generateDataset('spiral'));
  const mlpRef = useRef<TinyMLP>(new TinyMLP(6, 2, 'tanh'));

  const buildSnapshot = (): NeuralGraphSnapshot => {
    const mlp = mlpRef.current;
    return {
      sizes: mlp.sizes,
      weights: mlp.weights,
      predict: (x: number, y: number) => {
        const { acts } = mlp.forward(x, y);
        return acts[acts.length - 1][0];
      },
      points: dataRef.current
    };
  };

  const neuralSnapRef = useRef<NeuralGraphSnapshot>(buildSnapshot());

  const rebuildNetwork = (nextDataset?: DatasetKind, hLayers = hiddenLayers, hNeurons = hiddenNeurons, act = activation) => {
    if (nextDataset) {
      dataRef.current = generateDataset(nextDataset);
    }
    mlpRef.current = new TinyMLP(hNeurons, hLayers, act);
    neuralSnapRef.current = buildSnapshot();
    setEpoch(0);
    setLossVal(0.5);
  };

  useEffect(() => {
    rebuildNetwork(datasetKind, hiddenLayers, hiddenNeurons, activation);
  }, [datasetKind, hiddenLayers, hiddenNeurons, activation]);

  useEffect(() => {
    if (tab !== 'neural') return;
    let rafId = 0;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (document.hidden) return;
      if (isTraining) {
        const loss = mlpRef.current.trainEpoch(dataRef.current, learningRate);
        neuralSnapRef.current = buildSnapshot();
        setEpoch((e) => e + 1);
        setLossVal(loss);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [tab, isTraining, learningRate]);

  return (
    <div className="sci-frame rounded-lg bg-slate-950 text-slate-100 border border-cyan-500/40 overflow-hidden shadow-lg">
      {/* Header & Mode Tabs */}
      <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {isEn
                ? 'SILICON LOGIC CPU & LIVE NEURAL NET PLAYGROUND'
                : 'XƯỞNG MẠCH LOGIC SILICON & MẠNG NƠ-RON HỌC SÂU TRỰC TIẾP'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isEn
              ? 'Switch between live Backprop Neural Networks and interactive Binary Adder / Flip-Flop digital logic.'
              : 'Chuyển đổi giữa Mạng Nơ-ron học trực tiếp từng Epoch và Mô phỏng Cổng Logic / Bộ Cộng 4-bit.'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => setTab('neural')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              tab === 'neural' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{isEn ? 'Live Neural Net' : 'Mạng Nơ-ron Sống'}</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('silicon')}
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              tab === 'silicon' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isEn ? 'Silicon Logic CPU' : 'Mạch Logic 4-Bit'}</span>
          </button>
        </div>
      </div>

      {/* Persistent WebGL 3D Stage across both Neural Manifold and Silicon Die modes */}
      <div className="px-4 pt-4">
        <SiliconNeural3DViewport
          mode={tab}
          neuralSnapRef={neuralSnapRef}
          siliconSnap={siliconSnap}
        />
      </div>

      {/* === TAB 1: LIVE NEURAL NET === */}
      {tab === 'neural' && (
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/75 p-3 rounded border border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTraining((v) => !v)}
                className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 cursor-pointer ${
                  isTraining ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                }`}
              >
                {isTraining ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isTraining ? (isEn ? 'Pause' : 'Tạm dừng') : isEn ? 'Train' : 'Huấn luyện'}</span>
              </button>
              <button
                type="button"
                onClick={() => rebuildNetwork(datasetKind)}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <span className="font-mono text-cyan-300 font-bold ml-1 tabular-nums">
                Epoch: {epoch} · Loss: {lossVal.toFixed(4)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={datasetKind}
                onChange={(e) => setDatasetKind(e.target.value as DatasetKind)}
                className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-semibold"
              >
                <option value="spiral">Dataset: Xoắn ốc (Spiral)</option>
                <option value="circle">Dataset: Vòng tròn (Circle)</option>
                <option value="xor">Dataset: XOR</option>
                <option value="linear">Dataset: Tuyến tính</option>
              </select>

              <select
                value={activation}
                onChange={(e) => setActivation(e.target.value as ActivationKind)}
                className="px-2 py-1 rounded bg-slate-800 border border-slate-700 font-semibold"
              >
                <option value="tanh">Act: Tanh</option>
                <option value="relu">Act: ReLU</option>
                <option value="sigmoid">Act: Sigmoid</option>
              </select>

              <label className="flex items-center gap-1.5 font-mono">
                <span>Layers: {hiddenLayers}</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={hiddenLayers}
                  onChange={(e) => setHiddenLayers(Number(e.target.value))}
                  className="w-16 accent-cyan-500"
                />
              </label>

              <label className="flex items-center gap-1.5 font-mono">
                <span>Neurons: {hiddenNeurons}</span>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={hiddenNeurons}
                  onChange={(e) => setHiddenNeurons(Number(e.target.value))}
                  className="w-16 accent-violet-500"
                />
              </label>

              <label className="flex items-center gap-1.5 font-mono">
                <span>LR: {learningRate.toFixed(2)}</span>
                <input
                  type="range"
                  min={0.01}
                  max={0.12}
                  step={0.01}
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-16 accent-emerald-500"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-slate-900/75 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">
                {isEn ? '3D Topology Architecture' : 'Kiến trúc Mạng 3D'}
              </span>
              <span className="text-cyan-300 font-bold">
                2 → {Array(hiddenLayers).fill(hiddenNeurons).join(' → ')} → 1
              </span>
            </div>
            <div className="p-3 rounded bg-slate-900/75 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">
                {isEn ? 'Decision Manifold Heightfield' : 'Mặt cong Quyết định 3D'}
              </span>
              <span className="text-sky-400 font-bold">Cyan (+1) / Rose (-1)</span>
            </div>
          </div>
        </div>
      )}

      {/* === TAB 2: SILICON DIGITAL LOGIC === */}
      {tab === 'silicon' && (
        <div className="p-4 space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/75 p-3 rounded border border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'adder_4bit', labelVi: 'Bộ Cộng 4-Bit (ALU)', labelEn: '4-Bit Ripple Adder' },
                  { id: 'full_adder', labelVi: 'Full-Adder 1-Bit (XOR/AND)', labelEn: '1-Bit Full Adder' },
                  { id: 'sr_latch', labelVi: 'Flip-Flop Nhớ Bit (SR Latch)', labelEn: 'SR Memory Latch' }
                ] as { id: CircuitPresetId; labelVi: string; labelEn: string }[]
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCircuitPreset(c.id)}
                  className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                    circuitPreset === c.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isEn ? c.labelEn : c.labelVi}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setAutoClock((v) => !v)}
              className={`px-3 py-1.5 rounded font-mono font-bold border cursor-pointer ${
                autoClock
                  ? 'bg-cyan-600 border-cyan-400 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              CLK {autoClock ? `AUTO (#${clockTick})` : 'OFF'}
            </button>
          </div>

          {circuitPreset !== 'sr_latch' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Inputs & Bit Toggles */}
              <div className="lg:col-span-5 p-4 rounded bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono font-bold text-sky-300">
                    <span>Thanh ghi A (4-bit)</span>
                    <span>Dec = {adder4Result.decA}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {bitsA.map((bit, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setBitsA((prev) => {
                            const copy = [...prev] as [number, number, number, number];
                            copy[i] = copy[i] ? 0 : 1;
                            return copy;
                          })
                        }
                        className={`py-2.5 rounded font-mono text-sm font-extrabold border cursor-pointer transition-colors ${
                          bit
                            ? 'bg-sky-600 border-sky-300 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-700 text-slate-500'
                        }`}
                      >
                        A{3 - i} = {bit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono font-bold text-amber-300">
                    <span>Thanh ghi B (4-bit)</span>
                    <span>Dec = {adder4Result.decB}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {bitsB.map((bit, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setBitsB((prev) => {
                            const copy = [...prev] as [number, number, number, number];
                            copy[i] = copy[i] ? 0 : 1;
                            return copy;
                          })
                        }
                        className={`py-2.5 rounded font-mono text-sm font-extrabold border cursor-pointer transition-colors ${
                          bit
                            ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-sm'
                            : 'bg-slate-950 border-slate-700 text-slate-500'
                        }`}
                      >
                        B{3 - i} = {bit}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCarryIn((c) => (c ? 0 : 1))}
                  className={`w-full py-2 rounded font-mono font-bold border cursor-pointer ${
                    carryIn
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-950 border-slate-700 text-slate-400'
                  }`}
                >
                  Carry-In (C₀) = {carryIn}
                </button>
              </div>

              {/* Logic Cascade & Binary Result */}
              <div className="lg:col-span-7 p-4 rounded bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>ALU Ripple-Carry Bus Output</span>
                  </span>
                  <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-500/50 font-mono font-extrabold text-sm text-emerald-300 tabular-nums">
                    {adder4Result.decA} + {adder4Result.decB} + {carryIn} = {adder4Result.decSum}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div
                    className={`p-2.5 rounded border text-center font-mono ${
                      adder4Result.cout
                        ? 'bg-rose-950/70 border-rose-400 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px]">C_out</div>
                    <div className="text-lg font-extrabold">{adder4Result.cout}</div>
                  </div>
                  {adder4Result.sumBits.map((sb, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded border text-center font-mono ${
                        sb
                          ? 'bg-emerald-600/35 border-emerald-400 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px]">S{3 - i} (c={adder4Result.carries[i]})</div>
                      <div className="text-lg font-extrabold">{sb}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div>Sᵢ = Aᵢ ⊕ Bᵢ ⊕ Cᵢ (Cổng XOR kép)</div>
                  <div>Cᵢ₊₁ = (Aᵢ · Bᵢ) + (Cᵢ · (Aᵢ ⊕ Bᵢ)) (Cổng AND + OR truyền nhớ)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded bg-slate-900/70 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2.5">
                <div className="font-mono font-bold text-cyan-300">
                  Flip-Flop Nhớ 1-Bit (NOR SR-Latch)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextS = srSet ? 0 : 1;
                      setSrSet(nextS);
                      if (nextS === 1 && srReset === 0) setSrQ(1);
                    }}
                    className={`py-3 rounded font-mono font-bold border cursor-pointer ${
                      srSet ? 'bg-emerald-600 border-emerald-300 text-white' : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    SET (S) = {srSet}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const nextR = srReset ? 0 : 1;
                      setSrReset(nextR);
                      if (nextR === 1 && srSet === 0) setSrQ(0);
                    }}
                    className={`py-3 rounded font-mono font-bold border cursor-pointer ${
                      srReset ? 'bg-rose-600 border-rose-300 text-white' : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                  >
                    RESET (R) = {srReset}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-slate-800 flex items-center justify-around font-mono">
                <div className="text-center">
                  <div className="text-[11px] text-slate-400">Ngõ nhớ Q</div>
                  <div className={`text-3xl font-extrabold ${srQ ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {srSet && srReset ? '?' : srQ}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-slate-400">Đảo Q̄</div>
                  <div className={`text-3xl font-extrabold ${!srQ ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {srSet && srReset ? '?' : srQ ? 0 : 1}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 max-w-[160px]">
                  {srSet && srReset
                    ? 'Trạng thái cấm (S=1, R=1)!'
                    : srSet === 0 && srReset === 0
                    ? 'Đang GIỮ NGUYÊN bit nhớ cũ!'
                    : srSet === 1
                    ? 'Đã nạp bit 1 vào ô nhớ'
                    : 'Đã xóa ô nhớ về 0'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
