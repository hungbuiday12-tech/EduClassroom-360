import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { resolveWsUrl } from '../lib/apiClient';
import { dispatchRemoteCommand, RemoteControlCommand } from '../lib/remoteControlBus';
import { getLocationLabel, useNavigation } from './NavigationContext';
import { useLanguage } from './LanguageContext';
import { SubjectType } from '../types';

const REMOTE_ROOM_STORAGE_KEY = 'synapse_remote_host_room_v1';

function makeRemoteRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function getOrCreateHostRoomCode(): string {
  try {
    const existing = sessionStorage.getItem(REMOTE_ROOM_STORAGE_KEY);
    if (existing && /^[A-Z0-9]{4,12}$/.test(existing)) return existing;
    const fresh = makeRemoteRoomCode();
    sessionStorage.setItem(REMOTE_ROOM_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return makeRemoteRoomCode();
  }
}

interface RemoteControllerContextValue {
  roomCode: string;
  pairUrl: string;
  qrDataUrl: string;
  wsConnected: boolean;
  controllerCount: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  regenerateRoom: () => void;
}

const RemoteControllerContext = createContext<RemoteControllerContextValue | null>(null);

export const useRemoteController = (): RemoteControllerContextValue => {
  const ctx = useContext(RemoteControllerContext);
  if (!ctx) {
    throw new Error('useRemoteController must be used inside RemoteControllerProvider');
  }
  return ctx;
};

interface RemoteControllerProviderProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const RemoteControllerProvider: React.FC<RemoteControllerProviderProps> = ({
  children,
  disabled = false
}) => {
  const { location, selectSubject } = useNavigation();
  const { language } = useLanguage();
  const [roomCode, setRoomCode] = useState<string>(getOrCreateHostRoomCode);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [controllerCount, setControllerCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [laserDot, setLaserDot] = useState<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false
  });

  const wsRef = useRef<WebSocket | null>(null);
  const laserHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLabel = getLocationLabel(location, language);

  const pairUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?remoteRoom=${encodeURIComponent(roomCode)}`;
  }, [roomCode]);

  useEffect(() => {
    if (!pairUrl) return;
    QRCode.toDataURL(pairUrl, {
      width: 240,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [pairUrl]);

  const selectSubjectRef = useRef(selectSubject);
  selectSubjectRef.current = selectSubject;
  const pageStateRef = useRef({ label: currentLabel, subject: location.subject });
  pageStateRef.current = { label: currentLabel, subject: location.subject };

  // Host WebSocket connection (persists across all pages)
  useEffect(() => {
    if (disabled || typeof window === 'undefined' || !roomCode) return;
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
            role: 'host',
            hostPageLabel: pageStateRef.current.label,
            hostSubject: pageStateRef.current.subject
          })
        );
      };

      ws.onmessage = (ev) => {
        if (!alive) return;
        try {
          const msg = JSON.parse(String(ev.data || ''));
          if (msg.type === 'remote:roster') {
            setControllerCount(Number(msg.controllerCount) || 0);
            return;
          }
          if (msg.type === 'remote:cmd' && msg.command) {
            const cmd = msg.command as RemoteControlCommand;
            if (cmd.type === 'laser') {
              setLaserDot({ x: cmd.x, y: cmd.y, active: cmd.active });
              if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
              if (cmd.active) {
                laserHideTimerRef.current = setTimeout(() => {
                  setLaserDot((prev) => ({ ...prev, active: false }));
                }, 4000);
              }
              return;
            }
            if (cmd.type === 'navigate' && cmd.subject) {
              selectSubjectRef.current(cmd.subject as SubjectType);
              return;
            }
            dispatchRemoteCommand(cmd);
          }
        } catch {}
      };

      ws.onclose = () => {
        if (!alive) return;
        setWsConnected(false);
        reconnectTimer = setTimeout(connect, 2400);
      };
    };

    connect();
    return () => {
      alive = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (laserHideTimerRef.current) clearTimeout(laserHideTimerRef.current);
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [disabled, roomCode]);

  // Sync current page name back to paired phone
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(
        JSON.stringify({
          type: 'remote:host_state',
          hostPageLabel: currentLabel,
          hostSubject: location.subject
        })
      );
    } catch {}
  }, [currentLabel, location.subject]);

  const regenerateRoom = useCallback(() => {
    const next = makeRemoteRoomCode();
    try {
      sessionStorage.setItem(REMOTE_ROOM_STORAGE_KEY, next);
    } catch {}
    setControllerCount(0);
    setRoomCode(next);
  }, []);

  const value = useMemo<RemoteControllerContextValue>(
    () => ({
      roomCode,
      pairUrl,
      qrDataUrl,
      wsConnected,
      controllerCount,
      isModalOpen,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
      regenerateRoom
    }),
    [controllerCount, isModalOpen, pairUrl, qrDataUrl, regenerateRoom, roomCode, wsConnected]
  );

  return (
    <RemoteControllerContext.Provider value={value}>
      {children}
      {/* Global Presentation Laser Pointer Overlay */}
      {laserDot.active && (
        <div
          className="fixed z-[300] pointer-events-none"
          style={{
            left: `${(laserDot.x * 100).toFixed(2)}vw`,
            top: `${(laserDot.y * 100).toFixed(2)}vh`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-6 h-6 rounded-full bg-rose-500/35 blur-[2px] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_16px_4px_rgba(244,63,94,0.95)] ring-2 ring-white" />
          </div>
        </div>
      )}
    </RemoteControllerContext.Provider>
  );
};
