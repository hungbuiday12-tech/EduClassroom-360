import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Expand,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Smartphone,
  Sparkles,
  Wifi,
  WifiOff,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { resolveWsUrl } from '../../lib/apiClient';
import { RemoteControlCommand } from '../../lib/remoteControlBus';
import { useLanguage } from '../../context/LanguageContext';

interface PhoneRemoteControllerScreenProps {
  roomCode: string;
  onExitController?: () => void;
}

type ControllerTab = 'orbit_3d' | 'presenter' | 'navigate';

export const PhoneRemoteControllerScreen: React.FC<PhoneRemoteControllerScreenProps> = ({
  roomCode,
  onExitController
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [tab, setTab] = useState<ControllerTab>('orbit_3d');
  const [wsConnected, setWsConnected] = useState(false);
  const [hostCount, setHostCount] = useState(0);
  const [hostPageLabel, setHostPageLabel] = useState<string>('Synapse STEM');
  const [hostSubject, setHostSubject] = useState<string>('overview');

  const [explodePct, setExplodePct] = useState(0);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [gyroStatus, setGyroStatus] = useState<string>('');
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [laserClickFlash, setLaserClickFlash] = useState<{ x: number; y: number; id: number } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastEmitRef = useRef<number>(0);
  const lastLaserEmitRef = useRef<number>(0);
  const isLaserPressedRef = useRef<boolean>(false);
  const laserClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gyroBaseRef = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);
  const lastGyroSentRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const laserPadRef = useRef<HTMLDivElement | null>(null);

  const sendCmd = useCallback((command: RemoteControlCommand) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(JSON.stringify({ type: 'remote:cmd', command }));
    } catch {}
  }, []);

  // Connect controller WebSocket with auto-reconnect
  useEffect(() => {
    let alive = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (!alive) return;
      const ws = new WebSocket(resolveWsUrl('/ws/remote-control'));
      wsRef.current = ws;

      ws.onopen = () => {
        if (!alive) return;
        setWsConnected(true);
        ws.send(
          JSON.stringify({
            type: 'remote:join',
            roomCode,
            role: 'controller'
          })
        );
      };

      ws.onmessage = (ev) => {
        if (!alive) return;
        try {
          const msg = JSON.parse(String(ev.data || ''));
          if (msg.type === 'remote:roster') {
            setHostCount(Number(msg.hostCount) || 0);
            if (typeof msg.hostPageLabel === 'string' && msg.hostPageLabel) {
              setHostPageLabel(msg.hostPageLabel);
            }
            if (typeof msg.hostSubject === 'string' && msg.hostSubject) {
              setHostSubject(msg.hostSubject);
            }
          }
        } catch {}
      };

      ws.onclose = () => {
        if (!alive) return;
        setWsConnected(false);
        reconnectTimer = setTimeout(connect, 1800);
      };
    };

    connect();
    return () => {
      alive = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [roomCode]);

  // Gyroscope 3D tilt listener
  useEffect(() => {
    if (!gyroEnabled) {
      gyroBaseRef.current = null;
      return;
    }

    let lastSendAt = 0;
    const onOrientation = (ev: DeviceOrientationEvent) => {
      const alpha = Number(ev.alpha) || 0;
      const beta = Number(ev.beta) || 0;
      const gamma = Number(ev.gamma) || 0;

      if (!gyroBaseRef.current) {
        gyroBaseRef.current = { alpha, beta, gamma };
        lastGyroSentRef.current = { yaw: 0, pitch: 0 };
        return;
      }

      const now = performance.now();
      if (now - lastSendAt < 34) return;
      lastSendAt = now;

      let dAlpha = alpha - gyroBaseRef.current.alpha;
      if (dAlpha > 180) dAlpha -= 360;
      if (dAlpha < -180) dAlpha += 360;
      const dGamma = gamma - gyroBaseRef.current.gamma;
      const dBeta = beta - gyroBaseRef.current.beta;

      const curYaw = ((dAlpha * 0.65 + dGamma * 0.55) * Math.PI) / 180;
      const curPitch = (dBeta * 0.6 * Math.PI) / 180;

      const yawDelta = curYaw - lastGyroSentRef.current.yaw;
      const pitchDelta = curPitch - lastGyroSentRef.current.pitch;
      lastGyroSentRef.current = { yaw: curYaw, pitch: curPitch };

      if (Math.abs(yawDelta) > 0.0025 || Math.abs(pitchDelta) > 0.0025) {
        sendCmd({
          type: 'orbit',
          yawDelta: Math.max(-0.22, Math.min(0.22, yawDelta * 1.4)),
          pitchDelta: Math.max(-0.22, Math.min(0.22, pitchDelta * 1.4)),
          zoomDelta: 0
        });
      }
    };

    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [gyroEnabled, sendCmd]);

  const handleToggleGyro = async () => {
    if (gyroEnabled) {
      setGyroEnabled(false);
      setGyroStatus('');
      return;
    }
    try {
      const DevOri = window.DeviceOrientationEvent as any;
      if (DevOri && typeof DevOri.requestPermission === 'function') {
        const perm = await DevOri.requestPermission();
        if (perm !== 'granted') {
          setGyroStatus(
            isEn
              ? 'Motion permission denied — use the touch pad below.'
              : 'Chưa cấp quyền cảm biến — hãy dùng bàn di cảm ứng bên dưới.'
          );
          return;
        }
      }
      gyroBaseRef.current = null;
      setGyroEnabled(true);
      setGyroStatus(
        isEn
          ? 'Gyro active: tilt phone to rotate 3D model'
          : 'Đang bật Gyro: nghiêng điện thoại để xoay mô hình 3D'
      );
    } catch {
      setGyroEnabled(true);
    }
  };

  // 3D Orbit Touchpad handlers
  const handleOrbitPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleOrbitPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lastTouchRef.current) return;
    const now = performance.now();
    if (now - lastEmitRef.current < 24) return;
    lastEmitRef.current = now;

    const dx = e.clientX - lastTouchRef.current.x;
    const dy = e.clientY - lastTouchRef.current.y;
    lastTouchRef.current = { x: e.clientX, y: e.clientY };

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    sendCmd({
      type: 'orbit',
      yawDelta: dx * 0.011,
      pitchDelta: dy * 0.011,
      zoomDelta: 0
    });
  };

  const handleOrbitPointerUp = () => {
    lastTouchRef.current = null;
  };

  // Presentation Laser Touchpad helpers (hover-to-show red dot + press-drag-release-to-click)
  const getNormalizedLaserCoords = (clientX: number, clientY: number) => {
    const el = laserPadRef.current;
    if (!el) return { x: 0.5, y: 0.5, inside: false };
    const rect = el.getBoundingClientRect();
    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
    return { x, y, inside };
  };

  const emitLaserMove = (clientX: number, clientY: number, active: boolean, bypassThrottle = false) => {
    const { x, y, inside } = getNormalizedLaserCoords(clientX, clientY);
    if (active) {
      setLaserPos({ x, y });
    } else {
      setLaserPos(null);
    }
    const now = performance.now();
    if (bypassThrottle || now - lastLaserEmitRef.current >= 18) {
      lastLaserEmitRef.current = now;
      sendCmd({ type: 'laser', x, y, active });
    }
    return { x, y, inside };
  };

  useEffect(() => {
    return () => {
      if (laserClickTimerRef.current) clearTimeout(laserClickTimerRef.current);
    };
  }, []);

  const quickRooms: { id: string; vi: string; en: string }[] = [
    { id: 'overview', vi: 'Trang chủ', en: 'Home' },
    { id: 'math_sims', vi: 'Toán 2D / Oxyz 3D', en: 'Math 2D / Oxyz 3D' },
    { id: 'physics_sims', vi: 'Vật lí 2D / 3D', en: 'Physics 2D / 3D' },
    { id: 'cs_sims', vi: 'Code 2D / 3D', en: 'Code 2D / 3D' },
    { id: 'synapse_v2', vi: 'Synapse Pre 3D', en: 'Synapse Pre 3D' },
    { id: 'spatial_3d', vi: 'Cảm Giác 3D / AR', en: 'Spatial 3D / AR' },
    { id: 'math', vi: 'Bài giảng Toán', en: 'Math Lectures' },
    { id: 'exams', vi: 'Kho Đề Thi', en: 'Exam Vault' }
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Top Controller Header */}
      <header className="px-4 py-3 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-white truncate">
              {isEn ? 'Synapse Remote Controller' : 'Tay Cầm Điều Khiển Synapse'}
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">
              {isEn ? 'Room' : 'Phòng'}: <span className="text-cyan-300 font-bold">{roomCode}</span>
              {' · '}
              {wsConnected ? (
                hostCount > 0 ? (
                  <span className="text-emerald-400">{isEn ? 'Screen paired' : 'Đã ghép màn hình'}</span>
                ) : (
                  <span className="text-amber-300">{isEn ? 'Waiting screen' : 'Chờ màn hình chính'}</span>
                )
              ) : (
                <span className="text-rose-400">{isEn ? 'Reconnecting...' : 'Đang kết nối lại...'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`p-2 rounded-md border ${
              wsConnected
                ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-400'
                : 'border-rose-500/40 bg-rose-950/50 text-rose-400'
            }`}
            title={wsConnected ? 'WebSocket Connected' : 'Disconnected'}
          >
            {wsConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </span>
          {onExitController && (
            <button
              type="button"
              onClick={onExitController}
              className="px-2.5 py-2 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer"
            >
              {isEn ? 'Full Web' : 'Mở Web'}
            </button>
          )}
        </div>
      </header>

      {/* Active Screen Indicator */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-400 shrink-0">{isEn ? 'Projector view:' : 'Màn hình đang mở:'}</span>
        <span className="font-bold text-sky-300 truncate">{hostPageLabel}</span>
      </div>

      {/* Mode Switcher */}
      <div className="px-4 pt-3 pb-2 grid grid-cols-3 gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setTab('orbit_3d')}
          className={`min-h-[42px] rounded-md border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            tab === 'orbit_3d'
              ? 'bg-sky-500 text-slate-950 border-sky-300'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
        >
          <Box className="w-4 h-4 shrink-0" />
          <span>{isEn ? '3D Control' : 'Xoay 3D'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('presenter')}
          className={`min-h-[42px] rounded-md border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            tab === 'presenter'
              ? 'bg-sky-500 text-slate-950 border-sky-300'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
        >
          <Crosshair className="w-4 h-4 shrink-0" />
          <span>{isEn ? 'Slides & Laser' : 'Slide & Laser'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('navigate')}
          className={`min-h-[42px] rounded-md border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
            tab === 'navigate'
              ? 'bg-sky-500 text-slate-950 border-sky-300'
              : 'bg-slate-900 text-slate-300 border-slate-800'
          }`}
        >
          <Compass className="w-4 h-4 shrink-0" />
          <span>{isEn ? 'Switch Page' : 'Chuyển trang'}</span>
        </button>
      </div>

      {/* Main Controller Body */}
      <div className="flex-1 px-4 pb-6 pt-1 flex flex-col gap-3 overflow-y-auto">
        {tab === 'orbit_3d' && (
          <>
            {/* Gyroscope Row */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleToggleGyro}
                  className={`flex-1 min-h-[44px] px-3 rounded-md border text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    gyroEnabled
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-950 text-sky-300 border-sky-500/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    {gyroEnabled
                      ? isEn
                        ? 'Gyro 3D Active (Tap to Stop)'
                        : 'Đang bật Cảm biến Nghiêng 3D'
                      : isEn
                      ? 'Enable Phone Gyro Rotation'
                      : 'Bật Cảm biến Xoay 3D (Gyro)'}
                  </span>
                </button>
                {gyroEnabled && (
                  <button
                    type="button"
                    onClick={() => {
                      gyroBaseRef.current = null;
                      lastGyroSentRef.current = { yaw: 0, pitch: 0 };
                    }}
                    className="min-h-[44px] px-3 rounded-md bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer shrink-0"
                  >
                    {isEn ? 'Zero' : 'Đặt tâm'}
                  </button>
                )}
              </div>
              {gyroStatus && <p className="text-[11px] text-emerald-300">{gyroStatus}</p>}
            </div>

            {/* 3D Orbit Touchpad */}
            <div
              onPointerDown={handleOrbitPointerDown}
              onPointerMove={handleOrbitPointerMove}
              onPointerUp={handleOrbitPointerUp}
              onPointerCancel={handleOrbitPointerUp}
              className="flex-1 min-h-[210px] rounded-xl border border-sky-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/35 flex flex-col items-center justify-center gap-2 text-center p-4 touch-none cursor-grab active:cursor-grabbing"
            >
              <Box className="w-8 h-8 text-sky-400" />
              <div className="text-sm font-extrabold text-white">
                {isEn ? '3D Orbit Touchpad' : 'Bàn Di Xoay Mô Hình 3D'}
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                {isEn
                  ? 'Drag 1 finger here to rotate 3D models on the main screen smoothly 360°.'
                  : 'Vuốt 1 ngón tay tại đây để xoay 360° mô hình trên máy chiếu / laptop theo thời gian thực.'}
              </p>
            </div>

            {/* Explode 3D Slider */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Layers className="w-4 h-4" />
                  <span>{isEn ? 'Explode 3D Assembly' : 'Tách lớp mô hình 3D'}</span>
                </span>
                <span className="font-mono tabular-nums text-white">{explodePct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={explodePct}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setExplodePct(next);
                  sendCmd({ type: 'explode_set', value: next / 100 });
                }}
                className="w-full accent-cyan-400"
              />
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => sendCmd({ type: 'orbit', yawDelta: 0, pitchDelta: 0, zoomDelta: -0.18 })}
                  className="min-h-[44px] rounded-md bg-slate-950 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4 text-sky-400" />
                  <span>+</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendCmd({ type: 'orbit', yawDelta: 0, pitchDelta: 0, zoomDelta: 0.18 })}
                  className="min-h-[44px] rounded-md bg-slate-950 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ZoomOut className="w-4 h-4 text-sky-400" />
                  <span>-</span>
                </button>
                <button
                  type="button"
                  onClick={() => sendCmd({ type: 'toggle_play' })}
                  className="min-h-[44px] rounded-md bg-emerald-600 border border-emerald-400 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <Pause className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExplodePct(0);
                    sendCmd({ type: 'reset_view' });
                  }}
                  className="min-h-[44px] rounded-md bg-slate-800 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'presenter' && (
          <>
            {/* Giant Prev / Next Slide Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => sendCmd({ type: 'slide_prev' })}
                className="min-h-[92px] rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-400 active:bg-sky-950 flex flex-col items-center justify-center gap-1.5 text-sm font-extrabold text-white cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7 text-sky-400" />
                <span>{isEn ? 'Prev Slide' : 'Slide / Bước Trước'}</span>
              </button>
              <button
                type="button"
                onClick={() => sendCmd({ type: 'slide_next' })}
                className="min-h-[92px] rounded-xl bg-sky-600 border border-sky-400 active:bg-sky-500 flex flex-col items-center justify-center gap-1.5 text-sm font-extrabold text-white cursor-pointer"
              >
                <ChevronRight className="w-7 h-7 text-white" />
                <span>{isEn ? 'Next Slide' : 'Slide / Bước Tiếp'}</span>
              </button>
            </div>

            {/* Laser Pointer Touchpad (Mouse Hover = Immediate Dot · Touch Drag + Release = Click) */}
            <div
              ref={laserPadRef}
              data-testid="laser-pad"
              onPointerEnter={(e) => {
                if (e.pointerType !== 'touch') {
                  setLaserActive(true);
                  emitLaserMove(e.clientX, e.clientY, true, true);
                }
              }}
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId);
                } catch {}
                isLaserPressedRef.current = true;
                setLaserActive(true);
                emitLaserMove(e.clientX, e.clientY, true, true);
              }}
              onPointerMove={(e) => {
                if (e.pointerType === 'touch' && !isLaserPressedRef.current) return;
                setLaserActive(true);
                emitLaserMove(e.clientX, e.clientY, true, false);
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {}
                if (!isLaserPressedRef.current) return;
                isLaserPressedRef.current = false;
                const { x, y, inside } = getNormalizedLaserCoords(e.clientX, e.clientY);

                // Emit exact final coordinates & click at release position
                sendCmd({ type: 'laser', x, y, active: e.pointerType !== 'touch' && inside });
                sendCmd({ type: 'laser_click', x, y });

                setLaserClickFlash({ x, y, id: Date.now() });
                if (laserClickTimerRef.current) clearTimeout(laserClickTimerRef.current);
                laserClickTimerRef.current = setTimeout(() => {
                  setLaserClickFlash(null);
                }, 480);

                if (e.pointerType === 'touch' || !inside) {
                  setLaserActive(false);
                  setLaserPos(null);
                } else {
                  setLaserActive(true);
                  setLaserPos({ x, y });
                }
              }}
              onPointerLeave={(e) => {
                if (isLaserPressedRef.current) return;
                setLaserActive(false);
                setLaserPos(null);
                const { x, y } = getNormalizedLaserCoords(e.clientX, e.clientY);
                sendCmd({ type: 'laser', x, y, active: false });
              }}
              onPointerCancel={() => {
                isLaserPressedRef.current = false;
                setLaserActive(false);
                setLaserPos(null);
                sendCmd({ type: 'laser', x: 0.5, y: 0.5, active: false });
              }}
              className={`relative flex-1 min-h-[250px] rounded-xl border-2 flex flex-col items-center justify-center gap-2 text-center p-4 touch-none select-none overflow-hidden transition-colors cursor-crosshair ${
                laserActive
                  ? 'border-rose-500 bg-rose-950/35'
                  : 'border-slate-800 bg-slate-900/90 hover:border-rose-500/60'
              }`}
            >
              {/* Subtle Screen Proportion Crosshair */}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-slate-700/35" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-700/35" />

              {laserActive && laserPos && (
                <span className="pointer-events-none absolute top-2 right-2.5 px-2 py-0.5 rounded bg-slate-950/80 border border-rose-500/40 font-mono text-[10px] text-rose-300 tabular-nums">
                  {Math.round(laserPos.x * 100)}% · {Math.round(laserPos.y * 100)}%
                </span>
              )}

              {/* Live Red Dot inside Touchpad mirroring projector screen position */}
              {laserActive && laserPos && (
                <div
                  data-testid="remote-pad-laser-dot"
                  className="pointer-events-none absolute z-20 w-5 h-5 rounded-full bg-rose-500/35 flex items-center justify-center"
                  style={{
                    left: `${(laserPos.x * 100).toFixed(2)}%`,
                    top: `${(laserPos.y * 100).toFixed(2)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white shadow-[0_0_12px_3px_rgba(244,63,94,0.95)]" />
                </div>
              )}

              {/* Release Click Ripple Feedback inside Touchpad */}
              {laserClickFlash && (
                <div
                  key={laserClickFlash.id}
                  className="pointer-events-none absolute z-20"
                  style={{
                    left: `${(laserClickFlash.x * 100).toFixed(2)}%`,
                    top: `${(laserClickFlash.y * 100).toFixed(2)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="block w-9 h-9 rounded-full border-2 border-rose-400 bg-rose-500/30 animate-ping" />
                </div>
              )}

              <Crosshair className={`relative z-10 w-9 h-9 ${laserActive ? 'text-rose-400' : 'text-slate-400'}`} />
              <div className="relative z-10 text-sm font-extrabold text-white">
                {isEn ? 'Live Laser Pointer & Click Pad' : 'Bàn Di Tia Laser & Click Từ Xa'}
              </div>
              <p className="relative z-10 text-xs text-slate-300/90 max-w-xs leading-relaxed">
                {isEn
                  ? 'Hover mouse to show the red laser dot immediately. On phone: hold & drag the dot onto any button (e.g. Synapse Pre), then release to click!'
                  : 'Di chuột vào ô để hiện ngay chấm đỏ. Trên điện thoại: đè tay rê chấm đỏ tới đúng nút cần bấm (vd: Synapse Pre) rồi buông tay để tự động Click!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => sendCmd({ type: 'toggle_play' })}
                className="min-h-[46px] rounded-lg bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>{isEn ? 'Play / Pause' : 'Phát / Tạm dừng'}</span>
              </button>
              <button
                type="button"
                onClick={() => sendCmd({ type: 'explode_toggle' })}
                className="min-h-[46px] rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Expand className="w-4 h-4" />
                <span>{isEn ? 'Toggle Explode' : 'Bật/Tắt Tách lớp'}</span>
              </button>
            </div>
          </>
        )}

        {tab === 'navigate' && (
          <div className="grid grid-cols-2 gap-2.5">
            {quickRooms.map((item) => {
              const active = hostSubject === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => sendCmd({ type: 'navigate', subject: item.id })}
                  className={`min-h-[58px] p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-sky-600 border-sky-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-sky-500/60'
                  }`}
                >
                  <div className="text-xs font-extrabold">{isEn ? item.en : item.vi}</div>
                  <div className="text-[10px] opacity-75 font-mono mt-0.5">
                    {active ? (isEn ? 'Active on screen' : 'Đang hiển thị') : isEn ? 'Tap to switch' : 'Chạm để mở'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
