import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Activity,
  Download,
  Laptop,
  Play,
  QrCode,
  Radio,
  RefreshCw,
  Smartphone,
  Square,
  Waves,
  Wifi
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { setLiveWorkspaceContext } from '../../lib/liveCoPilotBridge';
import { FormattedText } from '../common/MathRenderer';
import { LivePhoneTelemetry, PhoneSensor3DViewport } from './PhoneSensor3DViewport';

export interface SensorTelemetrySample {
  t: number; // elapsed sec
  ax: number;
  ay: number;
  az: number;
  beta: number;
  gamma: number;
  theo: number;
}

type SensorExpMode = 'shm_spring' | 'pendulum_angle' | 'incline_tilt';

interface PhoneSensorPhysicsLabProps {
  initialRoomCode?: string | null;
}

function makeRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const PhoneSensorPhysicsLab: React.FC<PhoneSensorPhysicsLabProps> = ({ initialRoomCode }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const isAutoMobile = Boolean(initialRoomCode);
  const [role, setRole] = useState<'host' | 'mobile'>(isAutoMobile ? 'mobile' : 'host');
  const [roomCode, setRoomCode] = useState<string>(
    () => (initialRoomCode ? initialRoomCode.toUpperCase() : makeRoomCode())
  );
  const [joinInput, setJoinInput] = useState<string>(initialRoomCode?.toUpperCase() || '');
  const [expMode, setExpMode] = useState<SensorExpMode>('shm_spring');
  const [wsConnected, setWsConnected] = useState(false);
  const [peerCounts, setPeerCounts] = useState({ hosts: 0, mobiles: 0 });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Theory parameters for real-time overlay comparison
  const [ampTheory, setAmpTheory] = useState(2.8); // m/s^2 or deg
  const [freqTheoryHz, setFreqTheoryHz] = useState(1.2);
  const [dampingBeta, setDampingBeta] = useState(0.12);

  // Mobile sensor state
  const [sensorPermState, setSensorPermState] = useState<'idle' | 'active' | 'denied'>('idle');
  const [streamingMobile, setStreamingMobile] = useState(false);

  // Telemetry buffer
  const samplesRef = useRef<SensorTelemetrySample[]>([]);
  const startMsRef = useRef<number>(Date.now());
  const pulseInjectUntilRef = useRef<number>(0);
  const [liveStats, setLiveStats] = useState({
    measuredVal: 0,
    theoVal: 0,
    rmse: 0,
    peakHz: 0,
    sampleCount: 0,
    betaTilt: 0
  });

  const wsRef = useRef<WebSocket | null>(null);
  const oscCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const liveTelemetryRef = useRef<LivePhoneTelemetry>({
    ax: 0,
    ay: 0,
    az: 9.81,
    beta: 0,
    gamma: 0
  });

  const pairUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/?subject=synapse_v2&futureTab=phone_sensor_lab&sensorRoom=${encodeURIComponent(
      roomCode
    )}`;
  }, [roomCode]);

  useEffect(() => {
    if (!pairUrl) return;
    QRCode.toDataURL(pairUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#f8fafc' }
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [pairUrl]);

  useEffect(() => {
    setLiveWorkspaceContext({
      subject: 'physics',
      title: isEn ? 'Live Phone Sensor Telemetry Physics Lab' : 'Phòng Lab Vật lí Cảm biến Điện thoại (WebSocket)',
      summary: `Room ${roomCode} · Mode=${expMode} · Live Sample=${liveStats.measuredVal.toFixed(2)} · RMSE=${liveStats.rmse.toFixed(2)}`,
      formula:
        expMode === 'shm_spring'
          ? 'a(t) = -\\omega^2 A e^{-\\beta t}\\cos(\\omega t)'
          : '\\theta(t) = \\theta_0 e^{-\\beta t}\\cos(\\sqrt{g/l}\\,t)',
      paramsSummary: `A=${ampTheory}, f=${freqTheoryHz}Hz, beta=${dampingBeta}, mobiles=${peerCounts.mobiles}`
    });
  }, [ampTheory, dampingBeta, expMode, freqTheoryHz, isEn, liveStats.measuredVal, liveStats.rmse, peerCounts.mobiles, roomCode]);

  const computeTheoreticalValue = useCallback(
    (tSec: number): number => {
      const omega = 2 * Math.PI * freqTheoryHz;
      if (expMode === 'incline_tilt') {
        return 9.81 * Math.sin((Math.abs(ampTheory * 8) * Math.PI) / 180);
      }
      return ampTheory * Math.exp(-dampingBeta * (tSec % 12)) * Math.cos(omega * tSec);
    },
    [ampTheory, dampingBeta, expMode, freqTheoryHz]
  );

  const pushSample = useCallback(
    (rawAx: number, rawAy: number, rawAz: number, beta: number, gamma: number) => {
      liveTelemetryRef.current = { ax: rawAx, ay: rawAy, az: rawAz, beta, gamma };
      const now = Date.now();
      const t = (now - startMsRef.current) / 1000;
      const theo = computeTheoreticalValue(t);
      const next: SensorTelemetrySample = {
        t,
        ax: rawAx,
        ay: rawAy,
        az: rawAz,
        beta,
        gamma,
        theo
      };
      const arr = samplesRef.current;
      arr.push(next);
      if (arr.length > 260) arr.shift();

      // Calculate live RMSE on active metric
      let sqErr = 0;
      let maxVal = 0;
      let zeroCrossings = 0;
      let prevSign = 0;
      for (let i = 0; i < arr.length; i++) {
        const m =
          expMode === 'pendulum_angle'
            ? arr[i].beta * 0.25
            : expMode === 'incline_tilt'
            ? Math.hypot(arr[i].ax, arr[i].ay)
            : arr[i].ay;
        const diff = m - arr[i].theo;
        sqErr += diff * diff;
        if (Math.abs(m) > maxVal) maxVal = Math.abs(m);
        const s = m >= 0 ? 1 : -1;
        if (prevSign !== 0 && s !== prevSign) zeroCrossings++;
        prevSign = s;
      }
      const spanT = arr.length > 2 ? Math.max(0.5, arr[arr.length - 1].t - arr[0].t) : 1;
      const estHz = zeroCrossings / (2 * spanT);
      const latestMetric =
        expMode === 'pendulum_angle'
          ? beta * 0.25
          : expMode === 'incline_tilt'
          ? Math.hypot(rawAx, rawAy)
          : rawAy;

      setLiveStats({
        measuredVal: latestMetric,
        theoVal: theo,
        rmse: arr.length > 0 ? Math.sqrt(sqErr / arr.length) : 0,
        peakHz: estHz,
        sampleCount: arr.length,
        betaTilt: beta
      });
    },
    [computeTheoreticalValue, expMode]
  );

  // Connect WebSocket room
  useEffect(() => {
    if (typeof window === 'undefined' || !roomCode) return;
    let alive = true;
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${proto}//${window.location.host}/ws/sensor-lab`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!alive) return;
      setWsConnected(true);
      ws.send(
        JSON.stringify({
          type: 'sensor:join',
          roomCode,
          role,
          experimentMode: expMode
        })
      );
    };

    ws.onmessage = (ev) => {
      if (!alive) return;
      try {
        const msg = JSON.parse(String(ev.data || ''));
        if (msg.type === 'sensor:roster') {
          setPeerCounts({
            hosts: Number(msg.hostCount) || 0,
            mobiles: Number(msg.mobileCount) || 0
          });
        } else if (msg.type === 'sensor:sample' && role === 'host') {
          pushSample(
            Number(msg.ax) || 0,
            Number(msg.ay) || 0,
            Number(msg.az) || 0,
            Number(msg.beta) || 0,
            Number(msg.gamma) || 0
          );
        }
      } catch {}
    };

    ws.onclose = () => {
      if (alive) setWsConnected(false);
    };

    return () => {
      alive = false;
      try {
        ws.close();
      } catch {}
    };
  }, [expMode, pushSample, role, roomCode]);

  // Mobile sensor event listener
  useEffect(() => {
    if (!streamingMobile) return;
    let lastEmit = 0;
    let latestOri = { alpha: 0, beta: 0, gamma: 0 };

    const handleOri = (e: DeviceOrientationEvent) => {
      latestOri = {
        alpha: Number(e.alpha) || 0,
        beta: Number(e.beta) || 0,
        gamma: Number(e.gamma) || 0
      };
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastEmit < 33) return;
      lastEmit = now;
      const acc = e.acceleration || e.accelerationIncludingGravity;
      const ax = Number(acc?.x) || 0;
      const ay = Number(acc?.y) || 0;
      const az = Number(acc?.z) || 0;

      pushSample(ax, ay, az, latestOri.beta, latestOri.gamma);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'sensor:sample',
            ax,
            ay,
            az,
            alpha: latestOri.alpha,
            beta: latestOri.beta,
            gamma: latestOri.gamma,
            t: now
          })
        );
      }
    };

    window.addEventListener('deviceorientation', handleOri);
    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('deviceorientation', handleOri);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [pushSample, streamingMobile]);

  const startMobileSensors = async () => {
    try {
      const dm = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof dm?.requestPermission === 'function') {
        const perm = await dm.requestPermission();
        if (perm !== 'granted') {
          setSensorPermState('denied');
          return;
        }
      }
      const dori = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof dori?.requestPermission === 'function') {
        await dori.requestPermission().catch(() => {});
      }
      setSensorPermState('active');
      setStreamingMobile(true);
    } catch {
      setSensorPermState('active');
      setStreamingMobile(true);
    }
  };

  // Optional 5-second laptop test impulse (clearly labeled as local impulse test, distinct from phone WS feed)
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() > pulseInjectUntilRef.current) return;
      const t = (Date.now() - startMsRef.current) / 1000;
      const omega = 2 * Math.PI * freqTheoryHz;
      const noise = (Math.random() - 0.5) * 0.28;
      const ay = ampTheory * Math.exp(-dampingBeta * (t % 8)) * Math.cos(omega * t) + noise;
      const beta = (ay / Math.max(0.5, ampTheory)) * 18;
      pushSample(ay * 0.35, ay, 9.81, beta, beta * 0.4);
    }, 45);
    return () => clearInterval(id);
  }, [ampTheory, dampingBeta, freqTheoryHz, pushSample]);

  // Draw live dual-trace oscilloscope
  useEffect(() => {
    let raf = 0;
    const renderOsc = () => {
      const canvas = oscCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#070b14';
          ctx.fillRect(0, 0, w, h);

          // Grid
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 48) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 36) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          const midY = h * 0.5;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.beginPath();
          ctx.moveTo(0, midY);
          ctx.lineTo(w, midY);
          ctx.stroke();

          const data = samplesRef.current;
          const scaleY = h / 14;
          if (data.length > 1) {
            // Theoretical Curve (dashed amber)
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            data.forEach((pt, idx) => {
              const x = (idx / Math.max(1, data.length - 1)) * (w - 24) + 12;
              const y = midY - Math.max(-6, Math.min(6, pt.theo)) * scaleY;
              if (idx === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.setLineDash([]);

            // Measured Real Telemetry Curve (solid cyan)
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            data.forEach((pt, idx) => {
              const x = (idx / Math.max(1, data.length - 1)) * (w - 24) + 12;
              const val =
                expMode === 'pendulum_angle'
                  ? pt.beta * 0.25
                  : expMode === 'incline_tilt'
                  ? Math.hypot(pt.ax, pt.ay)
                  : pt.ay;
              const y = midY - Math.max(-6, Math.min(6, val)) * scaleY;
              if (idx === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            });
            ctx.stroke();
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 13px monospace';
            ctx.fillText(
              isEn
                ? 'Waiting for live smartphone sensor stream or test impulse...'
                : 'Đang chờ luồng cảm biến từ điện thoại (hoặc bấm Thử xung động)...',
              28,
              midY - 8
            );
          }

          // Legend
          ctx.fillStyle = '#22d3ee';
          ctx.font = '700 11px monospace';
          ctx.fillText(isEn ? '— MEASURED SENSOR STREAM' : '— DỮ LIỆU ĐO THỰC TẾ', 18, 22);
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(isEn ? '-- THEORETICAL MODEL' : '-- ĐƯỜNG LÝ THUYẾT', 240, 22);
        }
      }
      raf = requestAnimationFrame(renderOsc);
    };
    raf = requestAnimationFrame(renderOsc);
    return () => cancelAnimationFrame(raf);
  }, [expMode, isEn]);

  const handleExportCsv = () => {
    const header = 't_sec,ax,ay,az,beta_deg,gamma_deg,theoretical\n';
    const rows = samplesRef.current
      .map((s) => `${s.t.toFixed(3)},${s.ax.toFixed(3)},${s.ay.toFixed(3)},${s.az.toFixed(3)},${s.beta.toFixed(2)},${s.gamma.toFixed(2)},${s.theo.toFixed(3)}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Synapse_Sensor_Lab_${roomCode}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="sci-frame rounded-xl bg-white dark:bg-slate-900 border border-cyan-500/35 p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-500' : ''}`} />
              <span>WEBSOCKET SENSOR TELEMETRY · ROOM {roomCode}</span>
            </div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {isEn
                ? 'Live Phone Sensor Telemetry Physics Lab'
                : 'Phòng Thí Nghiệm Vật Lí Từ Cảm Biến Điện Thoại Thực Tế'}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setRole('host')}
              className={`px-3 py-2 rounded-md text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                role === 'host'
                  ? 'bg-sky-600 border-sky-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{isEn ? 'Laptop Receiver' : 'Máy tính (Nhận)'}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('mobile')}
              className={`px-3 py-2 rounded-md text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                role === 'mobile'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isEn ? 'Phone Sensor Sender' : 'Điện thoại (Phát)'}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(
            [
              {
                id: 'shm_spring',
                titleVi: '1. Con lắc & Dao động (Gia tốc ay)',
                titleEn: '1. Spring / SHM (Accelerometer Y)',
                descVi: 'Lắc điện thoại như con lắc lò xo để đo dao động tắt dần.',
                descEn: 'Oscillate phone vertically to measure damped harmonic acceleration.'
              },
              {
                id: 'pendulum_angle',
                titleVi: '2. Con lắc đơn (Góc nghiêng Con quay)',
                titleEn: '2. Simple Pendulum (Gyroscope β)',
                descVi: 'Nghiêng/lắc cổ tay như con lắc để vẽ đồ thị pha & góc lệch.',
                descEn: 'Tilt phone back and forth to measure angular oscillation.'
              },
              {
                id: 'incline_tilt',
                titleVi: '3. Mặt phẳng nghiêng (|a| & g·sinα)',
                titleEn: '3. Inclined Plane Force Probe',
                descVi: 'Đặt nghiêng điện thoại để đo thành phần gia tốc trọng trường.',
                descEn: 'Tilt phone onto a ramp to measure g·sin(α) component.'
              }
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setExpMode(m.id)}
              className={`p-3 rounded-md border text-left transition cursor-pointer ${
                expMode === m.id
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-slate-900 dark:text-white'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{isEn ? m.titleEn : m.titleVi}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{isEn ? m.descEn : m.descVi}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Pairing/Sender + Live Oscilloscope */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: QR Pairing / Mobile Sender */}
        <div className="lg:col-span-4 sci-frame rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          {role === 'host' ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-sky-500" />
                  {isEn ? 'Scan QR with iPhone / Android' : 'Quét QR bằng Điện thoại'}
                </span>
                <button
                  type="button"
                  onClick={() => setRoomCode(makeRoomCode())}
                  className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{isEn ? 'New Code' : 'Đổi mã'}</span>
                </button>
              </div>

              <div className="flex flex-col items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                {qrDataUrl && <img src={qrDataUrl} alt="QR Sensor Pair" className="w-40 h-40 rounded border border-slate-300" />}
                <div className="mt-2 font-mono text-sm font-extrabold tracking-widest text-sky-700 dark:text-cyan-300">
                  {roomCode}
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Wifi className={`w-3.5 h-3.5 ${wsConnected ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span>
                    {peerCounts.mobiles} {isEn ? 'phones connected' : 'điện thoại đang phát'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>{isEn ? 'Mobile Sensor Transmitter' : 'Bộ Phát Cảm Biến Từ Điện Thoại'}</span>
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                  placeholder={roomCode}
                  className="flex-1 px-2.5 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (joinInput.trim()) setRoomCode(joinInput.trim().toUpperCase());
                  }}
                  className="px-3 py-2 rounded bg-sky-600 text-white text-xs font-bold cursor-pointer"
                >
                  {isEn ? 'Join' : 'Vào phòng'}
                </button>
              </div>
              <button
                type="button"
                onClick={streamingMobile ? () => setStreamingMobile(false) : startMobileSensors}
                className={`w-full py-3 rounded-md font-bold text-xs flex items-center justify-center gap-2 cursor-pointer ${
                  streamingMobile
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {streamingMobile ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>
                  {streamingMobile
                    ? isEn ? 'Stop Streaming Sensor' : 'Dừng Phát Cảm Biến'
                    : isEn ? 'Enable iOS/Android Motion & Stream' : 'Cấp Quyền & Phát Cảm Biến Ngay'}
                </span>
              </button>
              {sensorPermState === 'denied' && (
                <p className="text-[11px] text-rose-500">
                  {isEn ? 'Motion permission denied in browser.' : 'Trình duyệt từ chối quyền cảm biến chuyển động.'}
                </p>
              )}
            </div>
          )}

          {/* Theoretical Fit Sliders */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{isEn ? 'Theoretical Overlay Model' : 'Thông Số Đường Lý Thuyết Đối Chiếu'}</span>
            </div>
            <label className="block space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{isEn ? 'Amplitude A' : 'Biên độ lý thuyết A'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{ampTheory.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={6.0}
                step={0.1}
                value={ampTheory}
                onChange={(e) => setAmpTheory(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{isEn ? 'Frequency f (Hz)' : 'Tần số dao động f (Hz)'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{freqTheoryHz.toFixed(2)} Hz</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={3.0}
                step={0.05}
                value={freqTheoryHz}
                onChange={(e) => setFreqTheoryHz(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
            </label>
            <label className="block space-y-1">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{isEn ? 'Damping β' : 'Hệ số tắt dần β'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{dampingBeta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.6}
                step={0.02}
                value={dampingBeta}
                onChange={(e) => setDampingBeta(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Right: Dual-Trace Oscilloscope & Quantitative Fit */}
        <div className="lg:col-span-8 sci-frame rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>{isEn ? 'Real-Time Dual-Trace Oscilloscope' : 'Dao Động Ký Thời Gian Thực (Thực Tế vs Lý Thuyết)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  startMsRef.current = Date.now();
                  pulseInjectUntilRef.current = Date.now() + 5000;
                }}
                className="px-2.5 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Waves className="w-3.5 h-3.5" />
                <span>{isEn ? 'Test Pulse (5s)' : 'Thử xung kiểm tra (5s)'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  samplesRef.current = [];
                  setLiveStats({ measuredVal: 0, theoVal: 0, rmse: 0, peakHz: 0, sampleCount: 0, betaTilt: 0 });
                }}
                className="px-2.5 py-1.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
              >
                {isEn ? 'Clear' : 'Xóa đồ thị'}
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-2.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <PhoneSensor3DViewport expMode={expMode} telemetryRef={liveTelemetryRef} />

          <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#070b14]">
            <canvas ref={oscCanvasRef} width={760} height={240} className="w-full h-auto block" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">MEASURED LIVE</div>
              <div className="text-sm font-mono font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums mt-0.5">
                {liveStats.measuredVal.toFixed(2)}
              </div>
            </div>
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">FIT RMSE ERROR</div>
              <div className="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mt-0.5">
                {liveStats.rmse.toFixed(3)}
              </div>
            </div>
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">EST. FREQUENCY</div>
              <div className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                {liveStats.peakHz.toFixed(2)} Hz
              </div>
            </div>
            <div className="p-2.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">SAMPLES · TILT β</div>
              <div className="text-sm font-mono font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                {liveStats.sampleCount} · {liveStats.betaTilt.toFixed(0)}°
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <FormattedText
              text={
                expMode === 'shm_spring'
                  ? '$$a(t) = -\\omega^2 A e^{-\\beta t}\\cos(2\\pi f t)$$'
                  : expMode === 'pendulum_angle'
                  ? '$$\\theta(t) = \\theta_0 e^{-\\beta t}\\cos\\left(\\sqrt{\\frac{g}{l}}\\,t\\right)$$'
                  : '$$F_{\\parallel} = m g \\sin\\alpha \\Rightarrow a = g\\sin\\alpha$$'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
