import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Check,
  Copy,
  Hand,
  LayoutGrid,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  Plus,
  RefreshCw,
  Send,
  Smile,
  Sparkles,
  Users,
  Video,
  VideoOff,
  X,
} from 'lucide-react';
import { MeetShared3DStage } from './MeetShared3DStage';
import { usePremium } from '../../context/PremiumContext';
import {
  MeetChatMessage,
  MeetFloatingReaction,
  MeetGraphicsQuality,
  MeetPeerInfo,
  MeetRoomSummary,
  MeetShared3DState,
  MeetStageMode,
} from './meetTypes';
import { resolveApiUrl, resolveWsUrl } from '../../lib/apiClient';

const DEFAULT_SHARED_3D_STATE: MeetShared3DState = {
  modelId: 'turbofan',
  rotX: 0.28,
  rotY: 0.65,
  zoom: 1,
  explode: 0,
  autoSpin: true,
};

interface LiveMeetClassroomProps {
  currentUserName?: string;
}

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

const QUICK_REACTIONS = ['👍', '👏', '🔥', '💡', '❓', '❤️'];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'HS';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface RemoteVideoTileProps {
  peer: MeetPeerInfo;
  stream?: MediaStream;
  compact?: boolean;
  pinned?: boolean;
  onPin?: () => void;
}

const PeerVideoTile: React.FC<RemoteVideoTileProps & { isLocal?: boolean }> = ({
  peer,
  stream,
  compact = false,
  pinned = false,
  isLocal = false,
  onPin,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const trackIdsKey = stream ? stream.getVideoTracks().map((t) => t.id).join(',') : '';

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [stream, trackIdsKey, peer.camOn, peer.screenSharing]);

  const hasLiveVideo = Boolean(
    stream &&
      stream.getVideoTracks().some((t) => t.readyState === 'live' && t.enabled)
  );

  return (
    <div
      onClick={onPin}
      className={`relative overflow-hidden rounded-2xl border bg-slate-900 select-none transition-colors ${
        pinned
          ? 'border-sky-400/70'
          : peer.handRaised
          ? 'border-amber-400/70'
          : 'border-slate-800 hover:border-slate-700'
      } ${onPin ? 'cursor-pointer' : ''} ${compact ? 'h-28 w-44 shrink-0' : 'h-full w-full min-h-[180px]'}`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`h-full w-full ${
          peer.screenSharing ? 'object-contain bg-black' : 'object-cover'
        } ${isLocal && !peer.screenSharing ? '-scale-x-100' : ''} ${
          hasLiveVideo ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {!hasLiveVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
          <div
            className={`flex items-center justify-center rounded-full font-bold text-white shadow-lg ${
              compact ? 'h-11 w-11 text-sm' : 'h-20 w-20 text-2xl'
            }`}
            style={{ backgroundColor: peer.colorHex || '#0ea5e9' }}
          >
            {getInitials(peer.name)}
          </div>
          {!compact && (
            <span className="mt-3 text-xs font-medium text-slate-400">
              {peer.camOn ? 'Đang kết nối camera...' : 'Camera đang tắt'}
            </span>
          )}
        </div>
      )}

      {/* Top badges */}
      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
        {peer.screenSharing && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap">
            <Monitor className="h-3 w-3" />
            Đang chia sẻ màn hình
          </span>
        )}
        {peer.handRaised && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-slate-950 whitespace-nowrap">
            <Hand className="h-3 w-3" />
            Giơ tay
          </span>
        )}
      </div>

      {/* Bottom name bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2">
        <span className="truncate text-xs font-semibold text-white">
          {peer.name} {isLocal ? '(Bạn)' : ''}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            peer.micOn ? 'bg-slate-800/80 text-emerald-400' : 'bg-rose-600/90 text-white'
          }`}
        >
          {peer.micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
        </span>
      </div>
    </div>
  );
};

export const LiveMeetClassroom: React.FC<LiveMeetClassroomProps> = ({ currentUserName }) => {
  const { hasPremiumAccess } = usePremium();
  // Lobby state
  const [displayName, setDisplayName] = useState<string>(() => {
    const saved = localStorage.getItem('synapse_meet_name');
    return currentUserName?.trim() || saved || 'Học viên STEM';
  });
  const [roomTitleInput, setRoomTitleInput] = useState<string>('Nhóm học Toán - Lí - Tin 3D');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [publicRooms, setPublicRooms] = useState<MeetRoomSummary[]>([]);
  const [loadingRooms, setLoadingRooms] = useState<boolean>(false);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  // Active room state
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [selfPeerId, setSelfPeerId] = useState<string | null>(null);
  const [peers, setPeers] = useState<MeetPeerInfo[]>([]);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Media controls
  const [micOn, setMicOn] = useState<boolean>(false);
  const [camOn, setCamOn] = useState<boolean>(false);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);

  // Graphics quality ('medium' | 'high')
  const [graphicsQuality, setGraphicsQuality] = useState<MeetGraphicsQuality>(() => {
    const saved = localStorage.getItem('synapse_meet_graphics');
    return saved === 'high' ? 'high' : 'medium';
  });

  const handleSetGraphicsQuality = (q: MeetGraphicsQuality) => {
    setGraphicsQuality(q);
    localStorage.setItem('synapse_meet_graphics', q);
  };

  // Stage & 3D sync
  const [stageMode, setStageMode] = useState<MeetStageMode>('3d');
  const [shared3D, setShared3D] = useState<MeetShared3DState>(DEFAULT_SHARED_3D_STATE);
  const [pinnedPeerId, setPinnedPeerId] = useState<string | null>(null);

  // Side drawer (chat / participants)
  const [drawerTab, setDrawerTab] = useState<'chat' | 'people' | null>('chat');
  const [messages, setMessages] = useState<MeetChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Reactions & UI helpers
  const [showReactions, setShowReactions] = useState<boolean>(false);
  const [floatingReactions, setFloatingReactions] = useState<MeetFloatingReaction[]>([]);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // Refs for WebSocket & WebRTC
  const wsRef = useRef<WebSocket | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const selfPeerIdRef = useRef<string | null>(null);
  const drawerTabRef = useRef<'chat' | 'people' | null>(drawerTab);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    drawerTabRef.current = drawerTab;
    if (drawerTab === 'chat') {
      setUnreadCount(0);
    }
  }, [drawerTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, drawerTab]);

  // Fetch public active rooms
  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const res = await fetch(resolveApiUrl('/api/meet/rooms'));
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        setPublicRooms(Array.isArray(data.rooms) ? data.rooms : []);
      }
    } catch {
      // Ignore network hiccup
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    if (!roomCode) {
      fetchRooms();
      const timer = window.setInterval(fetchRooms, 10000);
      return () => window.clearInterval(timer);
    }
  }, [roomCode, fetchRooms]);

  const sendWs = useCallback((payload: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }, []);

  const getActiveOutgoingVideoTrack = useCallback((): MediaStreamTrack | null => {
    const scr = screenStreamRef.current?.getVideoTracks().find((t) => t.readyState === 'live');
    if (scr) return scr;
    const cam = localStreamRef.current?.getVideoTracks().find((t) => t.readyState === 'live');
    return cam || null;
  }, []);

  const getActiveOutgoingAudioTrack = useCallback((): MediaStreamTrack | null => {
    const aud = localStreamRef.current?.getAudioTracks().find((t) => t.readyState === 'live');
    return aud || null;
  }, []);

  const closePeerConnection = useCallback((remotePeerId: string) => {
    const pc = pcsRef.current.get(remotePeerId);
    if (pc) {
      try {
        pc.onicecandidate = null;
        pc.ontrack = null;
        pc.onconnectionstatechange = null;
        pc.close();
      } catch {}
      pcsRef.current.delete(remotePeerId);
    }
    setRemoteStreams((prev) => {
      if (!prev[remotePeerId]) return prev;
      const next = { ...prev };
      delete next[remotePeerId];
      return next;
    });
  }, []);

  const ensurePeerConnection = useCallback(
    (remotePeerId: string): RTCPeerConnection => {
      const existing = pcsRef.current.get(remotePeerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection(RTC_CONFIG);

      // Add current local tracks if available
      const audioTrack = getActiveOutgoingAudioTrack();
      const videoTrack = getActiveOutgoingVideoTrack();
      const mediaStream = new MediaStream();
      if (audioTrack) {
        mediaStream.addTrack(audioTrack);
        pc.addTrack(audioTrack, mediaStream);
      }
      if (videoTrack) {
        mediaStream.addTrack(videoTrack);
        pc.addTrack(videoTrack, mediaStream);
      }

      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          sendWs({
            type: 'rtc:ice',
            targetPeerId: remotePeerId,
            candidate: ev.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (ev) => {
        setRemoteStreams((prev) => {
          const stream = ev.streams[0] || prev[remotePeerId] || new MediaStream();
          if (!ev.streams[0] && !stream.getTracks().includes(ev.track)) {
            stream.addTrack(ev.track);
          }
          return { ...prev, [remotePeerId]: stream };
        });
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          closePeerConnection(remotePeerId);
        }
      };

      pcsRef.current.set(remotePeerId, pc);
      return pc;
    },
    [closePeerConnection, getActiveOutgoingAudioTrack, getActiveOutgoingVideoTrack, sendWs]
  );

  const renegotiatePeer = useCallback(
    async (remotePeerId: string) => {
      const pc = ensurePeerConnection(remotePeerId);
      try {
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);
        sendWs({
          type: 'rtc:offer',
          targetPeerId: remotePeerId,
          sdp: pc.localDescription,
        });
      } catch {
        // Ignore transient negotiation race
      }
    },
    [ensurePeerConnection, sendWs]
  );

  const syncTrackToAllPeers = useCallback(
    async (kind: 'audio' | 'video', newTrack: MediaStreamTrack | null) => {
      const entries = Array.from(pcsRef.current.entries());
      for (const [remotePeerId, pc] of entries) {
        const transceiver = pc
          .getTransceivers()
          .find((t) => t.sender.track?.kind === kind || t.receiver.track?.kind === kind);
        if (transceiver?.sender) {
          try {
            await transceiver.sender.replaceTrack(newTrack);
          } catch {
            if (newTrack) {
              pc.addTrack(newTrack, new MediaStream([newTrack]));
              await renegotiatePeer(remotePeerId);
            }
          }
        } else if (newTrack) {
          const stream = new MediaStream([newTrack]);
          pc.addTrack(newTrack, stream);
          await renegotiatePeer(remotePeerId);
        }
      }
    },
    [renegotiatePeer]
  );

  const patchLocalPeerOptimistic = useCallback((patch: Partial<MeetPeerInfo>) => {
    const id = selfPeerIdRef.current;
    if (!id) return;
    setPeers((prev) => prev.map((p) => (p.peerId === id ? { ...p, ...patch } : p)));
  }, []);

  const stopAllMedia = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    setMicOn(false);
    setCamOn(false);
    setScreenSharing(false);
  }, []);

  const leaveRoom = useCallback(() => {
    sendWs({ type: 'leave' });
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    Array.from(pcsRef.current.keys()).forEach((id) => closePeerConnection(id));
    stopAllMedia();
    setRoomCode(null);
    setRoomTitle('');
    setSelfPeerId(null);
    selfPeerIdRef.current = null;
    setPeers([]);
    setRemoteStreams({});
    setMessages([]);
    setPinnedPeerId(null);
    setHandRaised(false);
    setWsConnected(false);
    setMediaNotice(null);
  }, [closePeerConnection, sendWs, stopAllMedia]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
      }
      Array.from(pcsRef.current.keys()).forEach((id) => {
        try {
          pcsRef.current.get(id)?.close();
        } catch {}
      });
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const connectToRoom = useCallback(
    (code: string, titleHint?: string, forceRemote = false) => {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return;
      const cleanName = displayName.trim() || 'Học viên STEM';
      localStorage.setItem('synapse_meet_name', cleanName);

      setIsJoining(true);
      setLobbyError(null);

      let joined = false;
      const wsUrl = resolveWsUrl('/ws/meet', forceRemote);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        ws.send(
          JSON.stringify({
            type: 'join',
            roomCode: cleanCode,
            title: titleHint || roomTitleInput.trim() || 'Phòng học trực tuyến',
            name: cleanName,
            micOn: false,
            camOn: false,
          })
        );
      };

      ws.onmessage = async (event) => {
        let msg: any;
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }

        switch (msg.type) {
          case 'room:joined': {
            joined = true;
            setIsJoining(false);
            setRoomCode(msg.roomCode);
            setRoomTitle(msg.title || 'Phòng học trực tuyến');
            setSelfPeerId(msg.selfPeerId);
            selfPeerIdRef.current = msg.selfPeerId;
            setPeers(Array.isArray(msg.peers) ? msg.peers : []);
            setMessages(Array.isArray(msg.messages) ? msg.messages : []);
            if (msg.stageMode === 'grid' || msg.stageMode === '3d') {
              setStageMode(msg.stageMode);
            }
            if (msg.shared3D) {
              setShared3D(msg.shared3D);
            }
            // Initiate WebRTC offers to existing peers
            const others: MeetPeerInfo[] = (msg.peers || []).filter(
              (p: MeetPeerInfo) => p.peerId !== msg.selfPeerId
            );
            for (const other of others) {
              await renegotiatePeer(other.peerId);
            }
            break;
          }

          case 'peer:joined': {
            const peer: MeetPeerInfo = msg.peer;
            if (!peer) break;
            setPeers((prev) => {
              const filtered = prev.filter((p) => p.peerId !== peer.peerId);
              return [...filtered, peer];
            });
            break;
          }

          case 'peer:left': {
            const peerId: string = msg.peerId;
            setPeers((prev) => prev.filter((p) => p.peerId !== peerId));
            closePeerConnection(peerId);
            setPinnedPeerId((prev) => (prev === peerId ? null : prev));
            break;
          }

          case 'peer:updated': {
            const peer: MeetPeerInfo = msg.peer;
            if (!peer) break;
            setPeers((prev) => prev.map((p) => (p.peerId === peer.peerId ? peer : p)));
            break;
          }

          case 'stage:mode': {
            if (msg.stageMode === 'grid' || msg.stageMode === '3d') {
              setStageMode(msg.stageMode);
            }
            break;
          }

          case 'shared3d:state': {
            if (msg.shared3D) {
              setShared3D(msg.shared3D);
            }
            break;
          }

          case 'chat:message': {
            if (msg.message) {
              setMessages((prev) => [...prev.slice(-119), msg.message]);
              if (drawerTabRef.current !== 'chat') {
                setUnreadCount((c) => c + 1);
              }
            }
            break;
          }

          case 'reaction:event': {
            if (msg.emoji) {
              const item: MeetFloatingReaction = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                emoji: msg.emoji,
                senderName: msg.senderName || 'Bạn học',
                xPercent: 18 + Math.round(Math.random() * 64),
              };
              setFloatingReactions((prev) => [...prev.slice(-10), item]);
              window.setTimeout(() => {
                setFloatingReactions((prev) => prev.filter((r) => r.id !== item.id));
              }, 2600);
            }
            break;
          }

          case 'rtc:offer': {
            const fromPeerId: string = msg.fromPeerId;
            if (!fromPeerId || !msg.sdp) break;
            const pc = ensurePeerConnection(fromPeerId);
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendWs({
                type: 'rtc:answer',
                targetPeerId: fromPeerId,
                sdp: pc.localDescription,
              });
            } catch {}
            break;
          }

          case 'rtc:answer': {
            const fromPeerId: string = msg.fromPeerId;
            if (!fromPeerId || !msg.sdp) break;
            const pc = pcsRef.current.get(fromPeerId);
            if (pc) {
              try {
                await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
              } catch {}
            }
            break;
          }

          case 'rtc:ice': {
            const fromPeerId: string = msg.fromPeerId;
            if (!fromPeerId || !msg.candidate) break;
            const pc = ensurePeerConnection(fromPeerId);
            try {
              await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            } catch {}
            break;
          }

          case 'error': {
            setIsJoining(false);
            setLobbyError(msg.message || 'Không thể kết nối phòng học.');
            break;
          }
        }
      };

      ws.onerror = () => {
        if (!joined && !forceRemote) {
          const remoteUrl = resolveWsUrl('/ws/meet', true);
          if (remoteUrl !== wsUrl) {
            try {
              ws.close();
            } catch {}
            connectToRoom(cleanCode, titleHint, true);
            return;
          }
        }
        setIsJoining(false);
        setLobbyError('Không thể kết nối máy chủ phòng học trực tuyến. Vui lòng thử lại sau vài giây.');
      };

      ws.onclose = () => {
        setWsConnected(false);
      };
    },
    [closePeerConnection, displayName, ensurePeerConnection, renegotiatePeer, roomTitleInput, sendWs]
  );

  const handleCreateRoom = async () => {
    setLobbyError(null);
    setIsJoining(true);
    const title = roomTitleInput.trim() || 'Phòng học STEM 3D';
    const generateLocalCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let out = '';
      for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
      return out;
    };
    try {
      const res = await fetch(resolveApiUrl('/api/meet/rooms'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          hostName: displayName.trim() || 'Học viên STEM',
        }),
      });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        if (data?.roomCode) {
          connectToRoom(data.roomCode, data.title || title);
          return;
        }
      }
      // Fallback: /ws/meet auto-creates the room on join
      connectToRoom(generateLocalCode(), title);
    } catch {
      connectToRoom(generateLocalCode(), title);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      setLobbyError('Vui lòng nhập mã phòng gồm 6 ký tự.');
      return;
    }
    connectToRoom(joinCodeInput.trim().toUpperCase());
  };

  // Toggle Microphone
  const toggleMic = async () => {
    setMediaNotice(null);
    if (micOn) {
      localStreamRef.current?.getAudioTracks().forEach((t) => {
        t.enabled = false;
      });
      setMicOn(false);
      sendWs({ type: 'peer:status', micOn: false });
      return;
    }

    try {
      const existingAudio = localStreamRef.current
        ?.getAudioTracks()
        .find((t) => t.readyState === 'live');
      if (existingAudio) {
        existingAudio.enabled = true;
      } else {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const track = audioStream.getAudioTracks()[0];
        if (!localStreamRef.current) {
          localStreamRef.current = new MediaStream();
        }
        localStreamRef.current.addTrack(track);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        await syncTrackToAllPeers('audio', track);
      }
      setMicOn(true);
      sendWs({ type: 'peer:status', micOn: true });
    } catch {
      setMediaNotice('Không thể truy cập Micro. Hãy cấp quyền Micro trong trình duyệt.');
    }
  };

  // Toggle Camera
  const toggleCam = async () => {
    setMediaNotice(null);
    if (camOn) {
      localStreamRef.current?.getVideoTracks().forEach((t) => {
        t.stop();
        localStreamRef.current?.removeTrack(t);
      });
      setLocalStream(
        localStreamRef.current ? new MediaStream(localStreamRef.current.getTracks()) : null
      );
      if (!screenSharing) {
        await syncTrackToAllPeers('video', null);
      }
      setCamOn(false);
      sendWs({ type: 'peer:status', camOn: false });
      return;
    }

    try {
      const camStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 24 } },
      });
      const track = camStream.getVideoTracks()[0];
      if (!localStreamRef.current) {
        localStreamRef.current = new MediaStream();
      }
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.stop();
        localStreamRef.current?.removeTrack(t);
      });
      localStreamRef.current.addTrack(track);
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      if (!screenSharing) {
        await syncTrackToAllPeers('video', track);
      }
      setCamOn(true);
      sendWs({ type: 'peer:status', camOn: true });
    } catch {
      setMediaNotice('Không thể bật Camera. Hãy cấp quyền Camera trong trình duyệt.');
    }
  };

  // Toggle Screen Sharing
  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
    }
    setScreenSharing(false);
    patchLocalPeerOptimistic({ screenSharing: false });
    sendWs({ type: 'peer:status', screenSharing: false });
    const fallbackCam =
      localStreamRef.current?.getVideoTracks().find((t) => t.readyState === 'live') || null;
    await syncTrackToAllPeers('video', fallbackCam);
  }, [patchLocalPeerOptimistic, sendWs, syncTrackToAllPeers]);

  const toggleScreenShare = async () => {
    setMediaNotice(null);
    if (screenSharing) {
      await stopScreenShare();
      return;
    }

    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getDisplayMedia !== 'function') {
      setMediaNotice('Trình duyệt hiện tại không hỗ trợ chia sẻ màn hình (getDisplayMedia).');
      return;
    }

    try {
      let displayStream: MediaStream;
      try {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: 24 } },
          audio: false,
        });
      } catch {
        displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      }
      const screenTrack = displayStream.getVideoTracks()[0];
      if (!screenTrack) {
        throw new Error('Không nhận được luồng video màn hình.');
      }
      screenStreamRef.current = displayStream;
      setScreenStream(new MediaStream([screenTrack]));
      setScreenSharing(true);
      patchLocalPeerOptimistic({ screenSharing: true });
      setStageMode('grid');
      if (selfPeerIdRef.current) {
        setPinnedPeerId(selfPeerIdRef.current);
      }
      sendWs({ type: 'peer:status', screenSharing: true });
      sendWs({ type: 'stage:mode', stageMode: 'grid' });
      await syncTrackToAllPeers('video', screenTrack);

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        setMediaNotice('Bạn đã hủy chia sẻ màn hình hoặc trình duyệt chặn quyền chia sẻ màn hình trong khung nhúng.');
      } else {
        setMediaNotice('Không thể chia sẻ màn hình. Hãy thử mở ứng dụng trong tab riêng hoặc kiểm tra quyền trình duyệt.');
      }
    }
  };

  const toggleHand = () => {
    const next = !handRaised;
    setHandRaised(next);
    sendWs({ type: 'peer:status', handRaised: next });
  };

  const handleStageModeChange = (nextMode: MeetStageMode) => {
    setStageMode(nextMode);
    sendWs({ type: 'stage:mode', stageMode: nextMode });
  };

  const handleShared3DPatch = useCallback(
    (patch: Partial<MeetShared3DState>) => {
      setShared3D((prev) => ({
        ...prev,
        ...patch,
        updatedBy: displayName,
      }));
      sendWs({ type: 'shared3d:patch', patch });
    },
    [displayName, sendWs]
  );

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;
    sendWs({ type: 'chat:send', text });
    setChatInput('');
  };

  const handleSendReaction = (emoji: string) => {
    sendWs({ type: 'reaction:send', emoji });
    setShowReactions(false);
  };

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 1800);
  };

  // Compute local combined display stream (screen takes priority over camera)
  const localDisplayStream = useMemo(() => {
    if (screenSharing && screenStream) return screenStream;
    return localStream || undefined;
  }, [localStream, screenSharing, screenStream]);

  // Auto-pin any peer that starts screen sharing
  const activeScreenSharer = useMemo(
    () => peers.find((p) => p.screenSharing) || null,
    [peers]
  );

  const effectivePinnedId = pinnedPeerId || activeScreenSharer?.peerId || null;

  // ==========================
  // LOBBY VIEW
  // ==========================
  if (!roomCode) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 text-slate-100 p-4 md:p-8">
        {/* Ambient Graphics Backdrop (Medium vs High) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className={`absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl transition-transform duration-1000 ${
              graphicsQuality === 'high' ? 'animate-pulse scale-110' : ''
            }`}
          />
          <div
            className={`absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl transition-transform duration-1000 ${
              graphicsQuality === 'high' ? 'animate-pulse scale-110' : ''
            }`}
          />
          {graphicsQuality === 'high' && (
            <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
          )}
        </div>

        <div className="relative z-10 mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
                <Video className="h-3.5 w-3.5" />
                Phòng Học Trực Tuyến · WebRTC & 3D Đồng Bộ
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Học nhóm trực tuyến cùng mô hình 3D chung
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Gọi video/thoại trực tiếp, chia sẻ màn hình, trò chuyện và cùng nghiên cứu mô hình 3D theo thời gian thực.
              </p>
            </div>

            {/* Graphics Quality Selector */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1 self-start md:self-auto">
              <button
                type="button"
                onClick={() => handleSetGraphicsQuality('medium')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                  graphicsQuality === 'medium'
                    ? 'bg-sky-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                Đồ họa Trung bình
              </button>
              <button
                type="button"
                onClick={() => handleSetGraphicsQuality('high')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                  graphicsQuality === 'high'
                    ? 'bg-gradient-to-r from-sky-400 to-violet-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Đồ họa Cao
              </button>
            </div>
          </div>

          {lobbyError && (
            <div className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              <span>{lobbyError}</span>
              <button onClick={() => setLobbyError(null)} className="text-rose-300 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Main 2-column Lobby */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Create or Join */}
            <div className="space-y-5 lg:col-span-7">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tên hiển thị của bạn
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    maxLength={32}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  {/* Create room card */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <div>
                      <h2 className="text-sm font-bold text-white">Tạo phòng học mới</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Tạo mã phòng 6 ký tự để gửi cho bạn bè cùng vào học.
                      </p>
                      <input
                        type="text"
                        value={roomTitleInput}
                        onChange={(e) => setRoomTitleInput(e.target.value)}
                        placeholder="Tên phòng học..."
                        maxLength={48}
                        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                      />
                    </div>
                    <button
                      onClick={handleCreateRoom}
                      disabled={isJoining}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50 whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      {isJoining ? 'Đang tạo phòng...' : 'Tạo phòng ngay'}
                    </button>
                  </div>

                  {/* Join by code card */}
                  <form
                    onSubmit={handleJoinByCode}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
                  >
                    <div>
                      <h2 className="text-sm font-bold text-white">Tham gia bằng mã phòng</h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Nhập mã 6 ký tự từ bạn học để kết nối ngay lập tức.
                      </p>
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                        placeholder="VD: ABC123"
                        maxLength={8}
                        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-sm uppercase tracking-widest text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50 whitespace-nowrap"
                    >
                      <Video className="h-4 w-4" />
                      Vào phòng
                    </button>
                  </form>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <Monitor className="h-4 w-4 text-sky-400" />
                  <div className="mt-2 text-xs font-semibold text-white">Chia sẻ màn hình</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    Trình chiếu bài giảng, code hoặc slide trực tiếp.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <Box className="h-4 w-4 text-emerald-400" />
                  <div className="mt-2 text-xs font-semibold text-white">Mô hình 3D dùng chung</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    Mọi người cùng xoay, phóng to và tách lớp đồng bộ.
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <MessageSquare className="h-4 w-4 text-amber-400" />
                  <div className="mt-2 text-xs font-semibold text-white">Chat & Giơ tay</div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    Nhắn tin, thả cảm xúc và giơ tay phát biểu.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Active Public Rooms */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 lg:col-span-5 flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-400" />
                  Phòng đang hoạt động ({publicRooms.length})
                </h2>
                <button
                  onClick={fetchRooms}
                  disabled={loadingRooms}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingRooms ? 'animate-spin' : ''}`} />
                  Làm mới
                </button>
              </div>

              <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto max-h-[340px]">
                {publicRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-12 text-center">
                    <Video className="h-8 w-8 text-slate-600" />
                    <p className="mt-2 text-sm font-medium text-slate-400">
                      Chưa có phòng nào đang mở
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Hãy nhấn &ldquo;Tạo phòng ngay&rdquo; để bắt đầu buổi học đầu tiên.
                    </p>
                  </div>
                ) : (
                  publicRooms.map((room) => (
                    <div
                      key={room.roomId}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 hover:border-slate-700"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {room.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-sky-300">
                            {room.roomId}
                          </span>
                          <span>· {room.memberCount} thành viên</span>
                          {room.stageMode === '3d' && (
                            <span className="text-emerald-400">· Đang xem 3D</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => connectToRoom(room.roomId, room.title)}
                        className="shrink-0 rounded-lg bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500 hover:text-slate-950 transition whitespace-nowrap"
                      >
                        Tham gia
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // IN-CALL VIEW (GOOGLE MEET STYLE)
  // ==========================
  const pinnedPeer = effectivePinnedId
    ? peers.find((p) => p.peerId === effectivePinnedId) || null
    : null;
  const unpinnedPeers = pinnedPeer
    ? peers.filter((p) => p.peerId !== pinnedPeer.peerId)
    : peers;

  const gridColsClass =
    peers.length <= 1
      ? 'grid-cols-1 max-w-4xl mx-auto'
      : peers.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : peers.length <= 4
      ? 'grid-cols-2'
      : 'grid-cols-2 lg:grid-cols-3';

  return (
    <div className="relative flex h-[calc(100vh-4.5rem)] w-full flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-900/95 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
            <Video className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white">{roomTitle}</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{wsConnected ? 'Đã kết nối' : 'Đang kết nối lại...'}</span>
              <span>·</span>
              <span>{peers.length} người trong phòng</span>
            </div>
          </div>
        </div>

        {/* Center: Stage Mode Switcher */}
        <div className="hidden sm:flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => handleStageModeChange('grid')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              stageMode === 'grid'
                ? 'bg-sky-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Lưới Video & Màn hình
          </button>
          <button
            onClick={() => handleStageModeChange('3d')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              stageMode === '3d'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            Mô hình 3D chung
          </button>
        </div>

        {/* Right: Graphics Quality + Copy Room Code */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => handleSetGraphicsQuality(graphicsQuality === 'high' ? 'medium' : 'high')}
            className={`hidden md:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              graphicsQuality === 'high'
                ? 'border-violet-400/50 bg-violet-500/20 text-violet-200'
                : 'border-slate-700 bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
            title="Chuyển đổi mức đồ họa Trung bình / Cao"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {graphicsQuality === 'high' ? 'Đồ họa Cao' : 'Trung bình'}
          </button>

          <button
            onClick={handleCopyCode}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 whitespace-nowrap"
            title="Sao chép mã phòng"
          >
            <span className="font-mono tracking-widest text-sky-300">{roomCode}</span>
            {copiedCode ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        </div>
      </header>

      {mediaNotice && (
        <div className="flex shrink-0 items-center justify-between bg-amber-500/15 px-4 py-2 text-xs text-amber-200 border-b border-amber-500/30">
          <span>{mediaNotice}</span>
          <button onClick={() => setMediaNotice(null)} className="text-amber-300 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Stage Column */}
        <div className="relative flex min-w-0 flex-1 flex-col p-3 gap-3 overflow-hidden">
          {stageMode === '3d' ? (
            <>
              {/* Shared 3D Stage */}
              <div
                className={`relative min-h-0 flex-1 overflow-hidden rounded-2xl border transition-all duration-300 ${
                  graphicsQuality === 'high'
                    ? 'border-sky-500/40 shadow-[0_0_30px_rgba(14,165,233,0.12)]'
                    : 'border-slate-800'
                }`}
              >
                {hasPremiumAccess ? (
                  <MeetShared3DStage
                    isEn={false}
                    graphicsQuality={graphicsQuality}
                    sharedState={shared3D}
                    onPatchState={handleShared3DPatch}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950/95 p-6 text-center space-y-3">
                    <div className="rounded-xl border border-amber-400/50 bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-amber-300">
                      TÍNH NĂNG ĐỘC QUYỀN SYNAPSE PRE (120K / 3 THÁNG)
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white">
                      Chiếu Mô Hình 3D Tương Tác Nhiều Người
                    </h3>
                    <p className="max-w-md text-xs text-slate-300 leading-relaxed">
                      Bản Miễn Phí (Free) hỗ trợ gọi Video/Thoại và <strong>Chia sẻ màn hình</strong>. Nâng cấp lên <strong>Synapse Pre</strong> để cùng xoay, tách lớp, soi chi tiết mô hình 3D đồng bộ nhiều người và tải file .glb/.obj!
                    </p>
                    <button
                      type="button"
                      onClick={() => setStageMode('grid')}
                      className="rounded-xl bg-sky-500 hover:bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 cursor-pointer"
                    >
                      Quay lại Lưới Video & Chia sẻ màn hình
                    </button>
                  </div>
                )}
              </div>

              {/* Compact Filmstrip of Participants */}
              <div className="flex shrink-0 items-center gap-2.5 overflow-x-auto pb-1">
                {peers.map((peer) => {
                  const isLocal = peer.peerId === selfPeerId;
                  return (
                    <PeerVideoTile
                      key={peer.peerId}
                      peer={peer}
                      stream={isLocal ? localDisplayStream : remoteStreams[peer.peerId]}
                      isLocal={isLocal}
                      compact
                    />
                  );
                })}
              </div>
            </>
          ) : pinnedPeer ? (
            /* Pinned Video / Screen Share Layout */
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
              <div className="relative min-h-0 flex-1">
                <PeerVideoTile
                  peer={pinnedPeer}
                  stream={
                    pinnedPeer.peerId === selfPeerId
                      ? localDisplayStream
                      : remoteStreams[pinnedPeer.peerId]
                  }
                  isLocal={pinnedPeer.peerId === selfPeerId}
                  pinned
                  onPin={() => setPinnedPeerId(null)}
                />
              </div>
              {unpinnedPeers.length > 0 && (
                <div className="flex shrink-0 gap-2.5 overflow-x-auto lg:w-52 lg:flex-col lg:overflow-y-auto">
                  {unpinnedPeers.map((peer) => {
                    const isLocal = peer.peerId === selfPeerId;
                    return (
                      <PeerVideoTile
                        key={peer.peerId}
                        peer={peer}
                        stream={isLocal ? localDisplayStream : remoteStreams[peer.peerId]}
                        isLocal={isLocal}
                        compact
                        onPin={() => setPinnedPeerId(peer.peerId)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Responsive Video Grid */
            <div className={`grid min-h-0 flex-1 gap-3 ${gridColsClass}`}>
              {peers.map((peer) => {
                const isLocal = peer.peerId === selfPeerId;
                return (
                  <PeerVideoTile
                    key={peer.peerId}
                    peer={peer}
                    stream={isLocal ? localDisplayStream : remoteStreams[peer.peerId]}
                    isLocal={isLocal}
                    onPin={() => setPinnedPeerId(peer.peerId)}
                  />
                );
              })}
            </div>
          )}

          {/* Floating Reactions Overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {floatingReactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.xPercent}%` }}
                className="absolute bottom-6 flex flex-col items-center animate-bounce"
              >
                <span className="text-3xl drop-shadow-lg">{r.emoji}</span>
                <span className="mt-0.5 rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {r.senderName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Drawer (Chat / Participants) */}
        {drawerTab && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDrawerTab('chat')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    drawerTab === 'chat'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Trò chuyện
                </button>
                <button
                  onClick={() => setDrawerTab('people')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    drawerTab === 'people'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thành viên ({peers.length})
                </button>
              </div>
              <button
                onClick={() => setDrawerTab(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {drawerTab === 'chat' ? (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto p-3">
                  {messages.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-500">
                      Chưa có tin nhắn nào. Hãy gửi lời chào đến cả phòng!
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMine = m.peerId === selfPeerId;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">
                              {isMine ? 'Bạn' : m.senderName}
                            </span>
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div
                            className={`mt-1 max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                              isMine
                                ? 'bg-sky-500 text-slate-950 font-medium'
                                : 'bg-slate-800 text-slate-100'
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form
                  onSubmit={handleSendChat}
                  className="flex items-center gap-2 border-t border-slate-800 p-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhắn tin cho cả phòng..."
                    maxLength={500}
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {peers.map((p) => (
                  <div
                    key={p.peerId}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: p.colorHex || '#0ea5e9' }}
                      >
                        {getInitials(p.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-white">
                          {p.name} {p.peerId === selfPeerId ? '(Bạn)' : ''}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {p.screenSharing
                            ? 'Đang chia sẻ màn hình'
                            : p.handRaised
                            ? 'Đang giơ tay'
                            : 'Đang tham gia'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      {p.micOn ? (
                        <Mic className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="h-3.5 w-3.5 text-rose-400" />
                      )}
                      {p.camOn ? (
                        <Video className="h-3.5 w-3.5 text-sky-400" />
                      ) : (
                        <VideoOff className="h-3.5 w-3.5 text-slate-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Google Meet Control Bar */}
      <footer className="relative flex shrink-0 items-center justify-center gap-2 border-t border-slate-800/90 bg-slate-900/95 px-4 py-3">
        {/* Mic */}
        <button
          onClick={toggleMic}
          title={micOn ? 'Tắt Micro' : 'Bật Micro'}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            micOn
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-rose-600 text-white hover:bg-rose-500'
          }`}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCam}
          title={camOn ? 'Tắt Camera' : 'Bật Camera'}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            camOn
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-rose-600 text-white hover:bg-rose-500'
          }`}
        >
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          title={screenSharing ? 'Dừng chia sẻ màn hình' : 'Chia sẻ màn hình'}
          className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold transition whitespace-nowrap ${
            screenSharing
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {screenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          <span className="hidden md:inline">
            {screenSharing ? 'Dừng chia sẻ' : 'Chia sẻ màn hình'}
          </span>
        </button>

        {/* Shared 3D Model Toggle */}
        <button
          onClick={() => handleStageModeChange(stageMode === '3d' ? 'grid' : '3d')}
          title="Chuyển đổi Mô hình 3D chung"
          className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold transition whitespace-nowrap ${
            stageMode === '3d'
              ? 'bg-sky-500 text-slate-950 hover:bg-sky-400'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <Box className="h-4 w-4" />
          <span className="hidden md:inline">Mô hình 3D</span>
        </button>

        {/* Raise Hand */}
        <button
          onClick={toggleHand}
          title={handRaised ? 'Hạ tay' : 'Giơ tay phát biểu'}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            handRaised
              ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <Hand className="h-5 w-5" />
        </button>

        {/* Reactions */}
        <div className="relative">
          <button
            onClick={() => setShowReactions((v) => !v)}
            title="Thả cảm xúc"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700"
          >
            <Smile className="h-5 w-5" />
          </button>
          {showReactions && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1.5 shadow-xl">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg hover:bg-slate-800 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Drawer Toggle */}
        <button
          onClick={() => setDrawerTab((prev) => (prev === 'chat' ? null : 'chat'))}
          title="Trò chuyện"
          className={`relative flex h-11 w-11 items-center justify-center rounded-full transition ${
            drawerTab === 'chat'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* People Drawer Toggle */}
        <button
          onClick={() => setDrawerTab((prev) => (prev === 'people' ? null : 'people'))}
          title="Thành viên"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
            drawerTab === 'people'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <Users className="h-5 w-5" />
        </button>

        {/* Leave Call */}
        <button
          onClick={leaveRoom}
          title="Rời phòng học"
          className="ml-2 flex h-11 items-center gap-2 rounded-full bg-rose-600 px-5 text-xs font-semibold text-white hover:bg-rose-500 transition whitespace-nowrap"
        >
          <PhoneOff className="h-4 w-4" />
          <span className="hidden sm:inline">Rời phòng</span>
        </button>
      </footer>
    </div>
  );
};

export default LiveMeetClassroom;
