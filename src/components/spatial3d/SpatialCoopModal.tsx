import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Hand,
  LogIn,
  LogOut,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { ForumGroup } from '../../types';
import { SYNAPSE_LOGO_AVATAR, useAuth } from '../../context/AuthContext';
import { safeFetchJson } from '../../lib/apiClient';
import { auth, db, doc, setDoc, updateDoc } from '../../lib/firebase';
import { isForumAdminUser } from '../forum/StudyForum';
import {
  CoopPeerInfo,
  CoopRoomSummary,
  CoopSharedModelState,
  encodeCoopForumInviteContent
} from './coopTypes';

interface SpatialCoopModalProps {
  isOpen: boolean;
  isEn: boolean;
  onClose: () => void;
  currentModelTitle: string;
  currentModelState: CoopSharedModelState;
  activeRoom: CoopRoomSummary | null;
  peers: CoopPeerInfo[];
  selfPeerId: string;
  wsStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  wsError: string | null;
  onJoinRoom: (roomId: string, fallbackMeta?: { title?: string; modelTitle?: string; hostName?: string }) => void;
  onLeaveRoom: () => void;
  onRoomCreatedAndJoin: (room: CoopRoomSummary) => void;
  onNavigateForum?: () => void;
}

export const SpatialCoopModal: React.FC<SpatialCoopModalProps> = ({
  isOpen,
  isEn,
  onClose,
  currentModelTitle,
  currentModelState,
  activeRoom,
  peers,
  selfPeerId,
  wsStatus,
  wsError,
  onJoinRoom,
  onLeaveRoom,
  onRoomCreatedAndJoin,
  onNavigateForum
}) => {
  const { user, openAuthModal } = useAuth();
  const isAdmin = isForumAdminUser(user);

  const [tab, setTab] = useState<'room' | 'browse'>(activeRoom ? 'room' : 'browse');
  const [roomTitle, setRoomTitle] = useState('');
  const [isPublicRoom, setIsPublicRoom] = useState(true);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [openRooms, setOpenRooms] = useState<CoopRoomSummary[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const [forumGroups, setForumGroups] = useState<ForumGroup[]>([]);
  const [selectedForumGroupId, setSelectedForumGroupId] = useState<string>('');
  const [inviteNote, setInviteNote] = useState<string>('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSuccessGroup, setInviteSuccessGroup] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setTab(activeRoom ? 'room' : 'browse');
    setActionError(null);
    setInviteSuccessGroup(null);
  }, [isOpen, activeRoom]);

  const fetchOpenRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const res = await safeFetchJson<{ rooms: CoopRoomSummary[] }>('/api/spatial/coop/rooms', {
        method: 'GET'
      });
      if (res.ok && Array.isArray(res.data?.rooms)) {
        setOpenRooms(res.data.rooms);
      }
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const fetchForumGroups = useCallback(async () => {
    const qs = user?.uid ? `?userId=${encodeURIComponent(user.uid)}` : '';
    const res = await safeFetchJson<{ groups: ForumGroup[] }>(`/api/forum/groups${qs}`, {
      method: 'GET'
    });
    if (res.ok && Array.isArray(res.data?.groups)) {
      const postable = res.data.groups.filter((g) =>
        isAdmin ? true : !g.isMandatoryAdminGroup && g.id !== 'official-announcements'
      );
      setForumGroups(postable);
      setSelectedForumGroupId((prev) =>
        postable.some((g) => g.id === prev) ? prev : postable[0]?.id || ''
      );
    }
  }, [user?.uid, isAdmin]);

  useEffect(() => {
    if (!isOpen) return;
    void fetchOpenRooms();
    void fetchForumGroups();
  }, [isOpen, fetchOpenRooms, fetchForumGroups]);

  const shareUrl = useMemo(() => {
    if (!activeRoom || typeof window === 'undefined') return '';
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('coopRoom', activeRoom.roomId);
      return u.toString();
    } catch {
      return `${window.location.origin}/?coopRoom=${activeRoom.roomId}`;
    }
  }, [activeRoom]);

  if (!isOpen) return null;

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setCreatingRoom(true);
    try {
      const hostName = user?.displayName || (isEn ? 'Host Student' : 'Chủ phòng');
      const finalTitle =
        roomTitle.trim() ||
        (isEn
          ? `3D Lab: ${currentModelTitle}`
          : `Phòng 3D: ${currentModelTitle}`);

      const res = await safeFetchJson<{
        success?: boolean;
        room?: CoopRoomSummary;
        error?: string;
      }>('/api/spatial/coop/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: finalTitle,
          hostName,
          modelTitle: currentModelTitle,
          isPublic: isPublicRoom,
          modelState: currentModelState
        })
      });

      if (!res.ok || !res.data?.room) {
        setActionError(res.error || res.data?.error || 'Không tạo được phòng 3D.');
        return;
      }

      onRoomCreatedAndJoin(res.data.room);
      setTab('room');
      void fetchOpenRooms();
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleCopyShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setActionError(isEn ? 'Copy blocked; share code: ' + activeRoom?.roomId : 'Hãy chép mã phòng: ' + activeRoom?.roomId);
    }
  };

  const handleSendForumInvite = async () => {
    if (!activeRoom) return;
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!selectedForumGroupId) {
      setActionError(isEn ? 'Select a study forum group first.' : 'Vui lòng chọn một nhóm trên Diễn đàn.');
      return;
    }

    setSendingInvite(true);
    setActionError(null);
    setInviteSuccessGroup(null);

    const content = encodeCoopForumInviteContent(
      {
        roomId: activeRoom.roomId,
        title: activeRoom.title,
        modelId: activeRoom.modelId,
        modelTitle: activeRoom.modelTitle || currentModelTitle,
        hostName: user.displayName || activeRoom.hostName
      },
      inviteNote
    );

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    try {
      const apiRes = await safeFetchJson<{
        success?: boolean;
        message?: any;
        group?: ForumGroup;
        error?: string;
      }>(`/api/forum/groups/${encodeURIComponent(selectedForumGroupId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: msgId,
          senderId: user.uid,
          senderName: isAdmin ? 'Synapse' : user.displayName,
          senderUsername: isAdmin ? 'Synapse' : user.username,
          senderEmail: user.email,
          senderAvatar: isAdmin ? SYNAPSE_LOGO_AVATAR : user.avatarUrl || '',
          senderRole: isAdmin ? 'admin' : user.role,
          content
        })
      });

      if (!apiRes.ok) {
        setActionError(apiRes.data?.error || apiRes.error || 'Không gửi được lời mời vào diễn đàn.');
        return;
      }

      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          await setDoc(doc(db, `forum_groups/${selectedForumGroupId}/messages`, msgId), {
            groupId: selectedForumGroupId,
            isAdminGroup: selectedForumGroupId === 'official-announcements',
            senderId: user.uid,
            senderName: isAdmin ? 'Synapse' : user.displayName,
            senderUsername: isAdmin ? 'Synapse' : user.username,
            ...(isAdmin
              ? { senderAvatar: SYNAPSE_LOGO_AVATAR }
              : user.avatarUrl
              ? { senderAvatar: user.avatarUrl }
              : {}),
            senderRole: isAdmin ? 'admin' : user.role,
            content,
            createdAt: nowIso
          });

          await updateDoc(doc(db, 'forum_groups', selectedForumGroupId), {
            messageCount: apiRes.data?.group?.messageCount || 1,
            lastMessagePreview: content.replace(/\s+/g, ' ').slice(0, 160),
            lastMessageAt: nowIso
          });
        } catch {
          // Express SSE already persisted & delivered
        }
      }

      const grp = forumGroups.find((g) => g.id === selectedForumGroupId);
      setInviteSuccessGroup(grp?.name || selectedForumGroupId);
      setInviteNote('');
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 flex items-center justify-center p-3 sm:p-5">
      <div data-modal-shell="true" className="spatial-holo-card spatial-step-reveal w-full max-w-2xl shadow-2xl">
        <div className="spatial-holo-ring spatial-holo-ring-emerald" />
        <div className="relative z-10 w-full rounded-[9px] bg-[#070d1e] border border-cyan-500/45 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center shrink-0">
              <Hand className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300">
                {isEn ? 'CO-OP 3D SKELETON HANDS · 2–4 LEARNERS' : 'KHÔNG GIAN CHUNG · 2–4 BẠN HỌC'}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate">
                {isEn ? 'Classmate Virtual Hands 3D Studio' : 'Bàn Tay Ảo Của Bạn Học (3D Co-op)'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('browse')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer transition-colors ${
                tab === 'browse'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-400'
              }`}
            >
              {isEn ? 'Create / Join Room' : 'Tạo / Vào Phòng 3D'}
            </button>
            <button
              type="button"
              onClick={() => setTab('room')}
              disabled={!activeRoom}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${
                tab === 'room'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400'
              }`}
            >
              {activeRoom
                ? `${isEn ? 'Active Room' : 'Phòng Đang Vào'} (${peers.length}/${activeRoom.maxMembers})`
                : isEn
                ? 'Active Room (0/4)'
                : 'Phòng Hiện Tại'}
            </button>
          </div>

          {activeRoom && (
            <span className="text-[11px] font-mono text-emerald-300 font-bold">
              {wsStatus === 'connected'
                ? `LIVE · ${activeRoom.roomId}`
                : wsStatus === 'connecting'
                ? 'Đang kết nối...'
                : 'Chế độ chờ'}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {(actionError || wsError) && (
            <div className="rounded-xl bg-rose-950/80 border border-rose-500/50 px-3.5 py-2.5 text-xs text-rose-200 font-semibold">
              {actionError || wsError}
            </div>
          )}

          {tab === 'browse' && (
            <div className="space-y-5">
              {/* Create Room Form */}
              <form
                onSubmit={handleCreateRoom}
                className="spatial-soft-frame rounded-xl bg-slate-900/90 border border-cyan-500/35 p-4 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isEn ? 'Create New 3D Co-op Room (Max 4)' : 'Tạo Phòng 3D Mới (Tối đa 4 bạn học)'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[200px]">
                    {currentModelTitle}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    maxLength={80}
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    placeholder={
                      isEn
                        ? `Room title (default: ${currentModelTitle})`
                        : `Tên phòng (mặc định: Phòng 3D ${currentModelTitle})`
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    disabled={creatingRoom}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{creatingRoom ? (isEn ? 'Creating...' : 'Đang tạo...') : isEn ? 'Create & Enter' : 'Tạo & Vào Phòng'}</span>
                  </button>
                </div>

                <label className="inline-flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublicRoom}
                    onChange={(e) => setIsPublicRoom(e.target.checked)}
                    className="accent-cyan-400"
                  />
                  <span>
                    {isEn
                      ? 'List publicly so classmates can discover and join (2–4 members)'
                      : 'Hiển thị công khai để bạn bè dễ tìm thấy hoặc tham gia qua lời mời Diễn đàn'}
                  </span>
                </label>
              </form>

              {/* Join By Room Code */}
              <div className="spatial-soft-frame rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-200">
                  {isEn ? 'Join by 6-Character Room Code' : 'Vào Phòng Nhanh Bằng Mã'}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    placeholder={isEn ? 'Enter code (e.g. A7X9K2)' : 'Nhập mã phòng (VD: A7X9K2)'}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-sky-400 font-mono text-xs text-white uppercase tracking-wider outline-none"
                  />
                  <button
                    type="button"
                    disabled={!joinCodeInput.trim()}
                    onClick={() => {
                      const code = joinCodeInput.trim().toUpperCase();
                      if (code) {
                        onJoinRoom(code);
                        setTab('room');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-45 text-slate-950 text-xs font-extrabold cursor-pointer whitespace-nowrap"
                  >
                    {isEn ? 'Join Room' : 'Vào Phòng'}
                  </button>
                </div>
              </div>

              {/* Open Active Rooms List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>{isEn ? 'Active Co-op 3D Rooms' : 'Các Phòng 3D Đang Hoạt Động'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void fetchOpenRooms()}
                    className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingRooms ? 'animate-spin' : ''}`} />
                    <span>{isEn ? 'Refresh' : 'Làm mới'}</span>
                  </button>
                </div>

                {openRooms.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 py-6 text-center text-xs text-slate-400">
                    {isEn
                      ? 'No active rooms yet. Create the first 3D room above and invite classmates via the Forum!'
                      : 'Chưa có phòng 3D nào đang mở. Hãy tạo phòng ở trên rồi gửi lời mời vào Diễn đàn!'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {openRooms.map((r) => {
                      const isFull = r.memberCount >= r.maxMembers;
                      const isCurrent = activeRoom?.roomId === r.roomId;
                      return (
                        <div
                          key={r.roomId}
                          className="spatial-soft-frame spatial-soft-frame-emerald rounded-xl bg-slate-900/90 border border-slate-800 p-3 flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] font-extrabold text-cyan-300">
                                #{r.roomId}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold ${
                                  isFull ? 'text-rose-300' : 'text-emerald-300'
                                }`}
                              >
                                {r.memberCount}/{r.maxMembers} {isEn ? 'learners' : 'bạn'}
                              </span>
                            </div>
                            <div className="text-xs font-extrabold text-white truncate mt-1">
                              {r.title}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {r.modelTitle} · {r.hostName}
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isFull && !isCurrent}
                            onClick={() => {
                              onJoinRoom(r.roomId);
                              setTab('room');
                            }}
                            className={`w-full py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200'
                                : isFull
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                            }`}
                          >
                            {isCurrent
                              ? isEn
                                ? 'Connected'
                                : 'Đang ở trong phòng'
                              : isFull
                              ? isEn
                                ? 'Room Full (4/4)'
                                : 'Đã đủ 4/4 người'
                              : isEn
                              ? 'Join & See Hands'
                              : 'Tham Gia & Thấy Tay Nhau'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'room' && activeRoom && (
            <div className="space-y-4">
              {/* Room Info & Invite Code */}
              <div className="spatial-soft-frame spatial-soft-frame-emerald rounded-xl bg-slate-900/95 border border-emerald-500/40 p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono font-bold text-emerald-300">
                      MÃ PHÒNG: {activeRoom.roomId} · {peers.length}/{activeRoom.maxMembers} BẠN HỌC
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-0.5">{activeRoom.title}</h3>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {isEn ? 'Shared Model:' : 'Mô hình chung:'}{' '}
                      <span className="font-bold text-cyan-300">{currentModelTitle}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => void handleCopyShare()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-100 cursor-pointer"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? (isEn ? 'Copied Link!' : 'Đã Chép Link!') : isEn ? 'Copy Link' : 'Chép Link Mời'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLeaveRoom();
                        setTab('browse');
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/50 text-xs font-bold text-rose-200 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Leave' : 'Rời phòng'}</span>
                    </button>
                  </div>
                </div>

                {/* Live Roster (1-4 Peers) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {peers.map((peer) => {
                    const isMe = peer.peerId === selfPeerId;
                    return (
                      <div
                        key={peer.peerId}
                        className="spatial-soft-frame flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-950/90 border border-slate-800"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-xs shrink-0"
                            style={{ backgroundColor: peer.colorHex }}
                          />
                          <span className="text-xs font-extrabold text-white truncate">
                            {peer.name} {isMe ? (isEn ? '(You)' : '(Bạn)') : ''}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold shrink-0 ${
                            peer.handActive ? 'text-emerald-300' : 'text-slate-400'
                          }`}
                        >
                          {peer.handActive
                            ? `${peer.handCount} ${isEn ? 'hand' : 'tay'} · 3D`
                            : isEn
                            ? 'Viewing'
                            : 'Đang xem'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Send Invitation to Study Forum */}
              <div className="spatial-soft-frame spatial-soft-frame-purple rounded-xl bg-slate-900/95 border border-indigo-500/45 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-extrabold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>
                      {isEn
                        ? 'Send Invite Directly to Study Forum'
                        : 'Gửi Lời Mời Vào Diễn Đàn Học Tập'}
                    </span>
                  </div>
                  {onNavigateForum && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateForum();
                      }}
                      className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 underline cursor-pointer"
                    >
                      {isEn ? 'Open Forum' : 'Mở Diễn đàn →'}
                    </button>
                  )}
                </div>

                {!user ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-slate-950/90 border border-slate-800 p-3">
                    <span className="text-xs text-slate-300">
                      {isEn
                        ? 'Sign in to post a 1-click Join Invite Card inside any Study Forum group.'
                        : 'Đăng nhập để gửi thẻ mời "Tham gia 3D" trực tiếp vào các nhóm trên Diễn đàn.'}
                    </span>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer shrink-0"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Sign In' : 'Đăng Nhập'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Select Study Group on Forum:' : 'Chọn nhóm trên Diễn đàn để mời bạn:'}
                      </label>
                      <select
                        value={selectedForumGroupId}
                        onChange={(e) => setSelectedForumGroupId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-indigo-400 outline-none"
                      >
                        {forumGroups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.messageCount} tin nhắn)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">
                        {isEn ? 'Invitation Message (optional):' : 'Lời nhắn kèm theo (tuỳ chọn):'}
                      </label>
                      <input
                        type="text"
                        maxLength={240}
                        value={inviteNote}
                        onChange={(e) => setInviteNote(e.target.value)}
                        placeholder={
                          isEn
                            ? 'Hey everyone, join my 3D room to inspect this model together!'
                            : 'Vào phòng 3D cùng mình tách cấu trúc và soi mô hình này nhé!'
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-indigo-400 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        {isEn
                          ? 'Classmates see a Join button directly inside the Forum chat.'
                          : 'Bạn bè trong nhóm bấm "Tham Gia Không Gian 3D" là vào thẳng phòng.'}
                      </span>
                      <button
                        type="button"
                        disabled={sendingInvite || !selectedForumGroupId}
                        onClick={() => void handleSendForumInvite()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {sendingInvite
                            ? isEn
                              ? 'Posting...'
                              : 'Đang gửi...'
                            : isEn
                            ? 'Send Invite to Forum'
                            : 'Gửi Lời Mời Vào Diễn Đàn'}
                        </span>
                      </button>
                    </div>

                    {inviteSuccessGroup && (
                      <div className="rounded-lg bg-emerald-950/75 border border-emerald-500/50 px-3 py-2 text-xs font-bold text-emerald-200 flex items-center justify-between gap-2">
                        <span>
                          {isEn
                            ? `Invite posted in "${inviteSuccessGroup}"!`
                            : `Đã gửi thẻ mời phòng 3D vào nhóm "${inviteSuccessGroup}"!`}
                        </span>
                        {onNavigateForum && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigateForum();
                            }}
                            className="underline text-emerald-300 cursor-pointer shrink-0"
                          >
                            {isEn ? 'View in Forum' : 'Xem trên Diễn đàn'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
