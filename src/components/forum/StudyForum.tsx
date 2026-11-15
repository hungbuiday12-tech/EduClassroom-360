import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Send,
  Lock,
  ShieldCheck,
  Search,
  Trash2,
  LogIn,
  Users,
  Megaphone,
  X,
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { ForumGroup, ForumMessage, ForumSubject, UserProfile } from '../../types';
import { useAuth, SYNAPSE_ADMIN_EMAIL, SYNAPSE_LOGO_AVATAR } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';
import { BrandLogo } from '../common/BrandLogo';
import {
  auth,
  db,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  OperationType,
  handleFirestoreError
} from '../../lib/firebase';

const MANDATORY_ADMIN_GROUP_ID = 'official-announcements';
const FORUM_ADMIN_EMAIL = SYNAPSE_ADMIN_EMAIL;

export function isForumAdminUser(user: UserProfile | null): boolean {
  if (!user) return false;
  return (user.email || '').trim().toLowerCase() === FORUM_ADMIN_EMAIL;
}

interface StudyForumProps {
  onBack?: () => void;
}

const SUBJECT_OPTIONS: Array<{
  id: 'all' | ForumSubject;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'all', labelVi: 'Tất cả', labelEn: 'All' },
  { id: 'announcements', labelVi: 'Thông báo Admin', labelEn: 'Admin Notices' },
  { id: 'math', labelVi: 'Toán học', labelEn: 'Math' },
  { id: 'physics', labelVi: 'Vật lí', labelEn: 'Physics' },
  { id: 'cs', labelVi: 'Tin học', labelEn: 'CS & Code' },
  { id: 'exams', labelVi: 'Luyện đề', labelEn: 'Exams' },
  { id: 'general', labelVi: 'Thảo luận chung', labelEn: 'General' }
];

const CREATE_SUBJECT_OPTIONS: Array<{
  id: Exclude<ForumSubject, 'announcements'>;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'general', labelVi: 'Thảo luận chung', labelEn: 'General Study' },
  { id: 'math', labelVi: 'Toán học (Đại số / Hình học)', labelEn: 'Mathematics' },
  { id: 'physics', labelVi: 'Vật lí (2D / 3D / Bài tập)', labelEn: 'Physics' },
  { id: 'cs', labelVi: 'Tin học (C++ / Python / VNOI)', labelEn: 'Computer Science' },
  { id: 'exams', labelVi: 'Giải đề thi & Ôn thi', labelEn: 'Exam Prep' }
];

export const StudyForum: React.FC<StudyForumProps> = ({ onBack }) => {
  const { user, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isAdmin = isForumAdminUser(user);

  const [groups, setGroups] = useState<ForumGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(MANDATORY_ADMIN_GROUP_ID);
  const [messages, setMessages] = useState<ForumMessage[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<'all' | ForumSubject>('all');

  // Create Group modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState<Exclude<ForumSubject, 'announcements'>>('general');
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Message composer state
  const [messageInput, setMessageInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Feedback / Error alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) || null,
    [groups, selectedGroupId]
  );

  const isSelectedMandatoryAdmin =
    selectedGroup?.isMandatoryAdminGroup || selectedGroupId === MANDATORY_ADMIN_GROUP_ID;
  const isLockedAdminForGuest = !user && isSelectedMandatoryAdmin;

  const sortGroupsList = useCallback((list: ForumGroup[]): ForumGroup[] => {
    return [...list].sort((a, b) => {
      if (a.isMandatoryAdminGroup !== b.isMandatoryAdminGroup) {
        return a.isMandatoryAdminGroup ? -1 : 1;
      }
      const ta = new Date(a.lastMessageAt || a.createdAt).getTime();
      const tb = new Date(b.lastMessageAt || b.createdAt).getTime();
      return tb - ta;
    });
  }, []);

  // Load groups from Express API
  const fetchGroups = useCallback(async () => {
    setLoadingGroups(true);
    try {
      const qs = user?.uid ? `?userId=${encodeURIComponent(user.uid)}` : '';
      const res = await safeFetchJson<{ groups: ForumGroup[] }>(`/api/forum/groups${qs}`, {
        method: 'GET'
      });
      if (res.ok && Array.isArray(res.data?.groups)) {
        const sorted = sortGroupsList(res.data.groups);
        setGroups(sorted);
        setSelectedGroupId((prev) =>
          sorted.some((g) => g.id === prev) ? prev : sorted[0]?.id || MANDATORY_ADMIN_GROUP_ID
        );
      }
    } catch {
      // ignore offline fallback
    } finally {
      setLoadingGroups(false);
    }
  }, [user?.uid, sortGroupsList]);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  // Real-time SSE listener for multi-user group & message updates
  useEffect(() => {
    if (typeof EventSource === 'undefined') return;
    const es = new EventSource('/api/forum/stream');

    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.type === 'forum:group_created' && payload.group) {
          setGroups((prev) => {
            if (prev.some((g) => g.id === payload.group.id)) return prev;
            return sortGroupsList([...prev, payload.group]);
          });
        } else if (payload.type === 'forum:group_deleted' && payload.groupId) {
          setGroups((prev) => prev.filter((g) => g.id !== payload.groupId));
          setSelectedGroupId((prev) =>
            prev === payload.groupId ? MANDATORY_ADMIN_GROUP_ID : prev
          );
        } else if (payload.type === 'forum:message_created' && payload.message) {
          const msg: ForumMessage = payload.message;
          if (payload.group) {
            setGroups((prev) => {
              const next = prev.map((g) => {
                if (g.id !== payload.group.id) return g;
                if (g.isMandatoryAdminGroup && !user) {
                  return {
                    ...payload.group,
                    lastMessagePreview: 'Đăng nhập để vào nhóm thông báo do Admin Synapse quản lí.'
                  };
                }
                return payload.group;
              });
              return sortGroupsList(next);
            });
          }
          if (msg.groupId === selectedGroupId && (!msg.isAdminGroup || Boolean(user))) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
          }
        } else if (payload.type === 'forum:message_deleted' && payload.messageId) {
          setMessages((prev) => prev.filter((m) => m.id !== payload.messageId));
          if (payload.group) {
            setGroups((prev) =>
              sortGroupsList(prev.map((g) => (g.id === payload.group.id ? payload.group : g)))
            );
          }
        }
      } catch {
        // ignore keepalive/malformed events
      }
    };

    return () => {
      es.close();
    };
  }, [selectedGroupId, user, sortGroupsList]);

  // Fetch messages when selectedGroupId or auth state changes
  const fetchMessagesForGroup = useCallback(async () => {
    if (!selectedGroupId) return;
    if (!user && selectedGroupId === MANDATORY_ADMIN_GROUP_ID) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    setErrorMsg(null);
    try {
      const qs = user?.uid ? `?userId=${encodeURIComponent(user.uid)}` : '';
      const res = await safeFetchJson<{ group: ForumGroup; messages: ForumMessage[]; error?: string }>(
        `/api/forum/groups/${encodeURIComponent(selectedGroupId)}/messages${qs}`,
        { method: 'GET' }
      );
      if (res.ok && Array.isArray(res.data?.messages)) {
        setMessages(res.data.messages);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedGroupId, user]);

  useEffect(() => {
    void fetchMessagesForGroup();
  }, [fetchMessagesForGroup]);

  // Optional Firestore real-time mirror when Firebase Auth session matches
  useEffect(() => {
    if (!selectedGroupId) return;
    if (!user && selectedGroupId === MANDATORY_ADMIN_GROUP_ID) return;
    if (!auth.currentUser || !user || auth.currentUser.uid !== user.uid) return;

    const path = `forum_groups/${selectedGroupId}/messages`;
    const q = query(collection(db, path), orderBy('createdAt', 'asc'), limit(100));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) return;
        const fsMsgs: ForumMessage[] = [];
        snap.forEach((d) => {
          const v = d.data() as any;
          if (v && v.content) {
            fsMsgs.push({
              id: d.id,
              groupId: selectedGroupId,
              isAdminGroup: Boolean(v.isAdminGroup),
              senderId: v.senderId,
              senderName: v.senderName,
              senderUsername: v.senderUsername,
              senderAvatar: v.senderAvatar,
              senderRole: v.senderRole || 'student',
              content: v.content,
              createdAt: v.createdAt || new Date().toISOString()
            });
          }
        });
        if (fsMsgs.length > 0) {
          setMessages((prev) => {
            const byId = new Map<string, ForumMessage>();
            for (const m of prev) byId.set(m.id, m);
            for (const m of fsMsgs) byId.set(m.id, m);
            return Array.from(byId.values()).sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, path);
        } catch {
          // Express SSE remains active fallback
        }
      }
    );

    return () => unsub();
  }, [selectedGroupId, user]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, selectedGroupId]);

  const handleOpenCreateGroup = () => {
    setErrorMsg(null);
    setStatusMsg(null);
    if (!user) {
      setErrorMsg(
        isEn
          ? 'Please sign in first. Only signed-in users can create study groups.'
          : 'Chỉ tài khoản đã đăng nhập mới có thể tạo nhóm học tập mới.'
      );
      openAuthModal('login');
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    if (!user) {
      openAuthModal('login');
      return;
    }

    const cleanName = newGroupName.trim();
    const cleanDesc = newGroupDesc.trim();
    if (cleanName.length < 3) {
      setErrorMsg(isEn ? 'Group name must be at least 3 characters.' : 'Tên nhóm cần tối thiểu 3 ký tự.');
      return;
    }
    if (cleanDesc.length < 3) {
      setErrorMsg(
        isEn ? 'Group description must be at least 3 characters.' : 'Mô tả nhóm cần tối thiểu 3 ký tự.'
      );
      return;
    }

    setCreatingGroup(true);
    const groupId = `grp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    try {
      const apiRes = await safeFetchJson<{ success: boolean; group?: ForumGroup; error?: string }>(
        '/api/forum/groups',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: groupId,
            name: cleanName,
            description: cleanDesc,
            subject: newGroupSubject,
            creatorId: user.uid,
            creatorName: user.displayName,
            creatorUsername: user.username
          })
        }
      );

      if (!apiRes.ok || !apiRes.data?.group) {
        setErrorMsg(apiRes.data?.error || (isEn ? 'Could not create group.' : 'Không thể tạo nhóm mới.'));
        return;
      }

      // Mirror to Firestore when signed in via Firebase Auth
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          await setDoc(doc(db, 'forum_groups', groupId), {
            name: cleanName,
            description: cleanDesc,
            subject: newGroupSubject,
            isMandatoryAdminGroup: false,
            creatorId: user.uid,
            creatorName: user.displayName,
            creatorUsername: user.username,
            messageCount: 0,
            lastMessagePreview: 'Nhóm vừa được tạo · Hãy gửi tin nhắn đầu tiên!',
            lastMessageAt: nowIso,
            createdAt: nowIso
          });
        } catch (fsErr) {
          try {
            handleFirestoreError(fsErr, OperationType.CREATE, `forum_groups/${groupId}`);
          } catch {
            // already logged; Express store persisted cleanly
          }
        }
      }

      const created = apiRes.data.group;
      setGroups((prev) =>
        sortGroupsList(prev.some((g) => g.id === created.id) ? prev : [...prev, created])
      );
      setSelectedGroupId(created.id);
      setNewGroupName('');
      setNewGroupDesc('');
      setNewGroupSubject('general');
      setIsCreateOpen(false);
      setStatusMsg(isEn ? 'Study group created!' : `Đã tạo nhóm "${created.name}" thành công!`);
    } finally {
      setCreatingGroup(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setStatusMsg(null);

    if (!user) {
      setErrorMsg(
        isEn
          ? 'Only signed-in users can send messages.'
          : 'Chỉ tài khoản đã đăng nhập mới có thể nhắn tin.'
      );
      openAuthModal('login');
      return;
    }

    if (isSelectedMandatoryAdmin && !isAdmin) {
      setErrorMsg(
        isEn
          ? 'Only Admin Synapse is allowed to post in the mandatory announcement group.'
          : 'Chỉ tài khoản Admin Synapse được phép gửi tin nhắn thông báo hoạt động web.'
      );
      return;
    }

    const cleanContent = messageInput.trim();
    if (!cleanContent) return;

    setSendingMsg(true);
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    try {
      const apiRes = await safeFetchJson<{
        success: boolean;
        message?: ForumMessage;
        group?: ForumGroup;
        error?: string;
      }>(`/api/forum/groups/${encodeURIComponent(selectedGroupId)}/messages`, {
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
          content: cleanContent
        })
      });

      if (!apiRes.ok || !apiRes.data?.message) {
        setErrorMsg(
          apiRes.data?.error || (isEn ? 'Could not send message.' : 'Không thể gửi tin nhắn.')
        );
        return;
      }

      const savedMsg = apiRes.data.message;
      setMessages((prev) =>
        prev.some((m) => m.id === savedMsg.id) ? prev : [...prev, savedMsg]
      );
      if (apiRes.data.group) {
        setGroups((prev) =>
          sortGroupsList(prev.map((g) => (g.id === apiRes.data!.group!.id ? apiRes.data!.group! : g)))
        );
      }
      setMessageInput('');

      // Mirror to Firestore when Firebase Auth session matches
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          if (selectedGroupId === MANDATORY_ADMIN_GROUP_ID && isAdmin && selectedGroup) {
            await setDoc(
              doc(db, 'forum_groups', MANDATORY_ADMIN_GROUP_ID),
              {
                name: selectedGroup.name,
                description: selectedGroup.description,
                subject: 'announcements',
                isMandatoryAdminGroup: true,
                creatorId: user.uid,
                creatorName: 'Synapse',
                creatorUsername: 'Synapse',
                messageCount: apiRes.data.group?.messageCount || 1,
                lastMessagePreview: cleanContent.slice(0, 160),
                lastMessageAt: nowIso,
                createdAt: selectedGroup.createdAt || nowIso
              },
              { merge: true }
            );
          }

          await setDoc(doc(db, `forum_groups/${selectedGroupId}/messages`, msgId), {
            groupId: selectedGroupId,
            isAdminGroup: Boolean(isSelectedMandatoryAdmin),
            senderId: user.uid,
            senderName: isAdmin ? 'Synapse' : user.displayName,
            senderUsername: isAdmin ? 'Synapse' : user.username,
            ...(isAdmin
              ? { senderAvatar: SYNAPSE_LOGO_AVATAR }
              : user.avatarUrl
              ? { senderAvatar: user.avatarUrl }
              : {}),
            senderRole: isAdmin ? 'admin' : user.role,
            content: cleanContent,
            createdAt: nowIso
          });

          await updateDoc(doc(db, 'forum_groups', selectedGroupId), {
            messageCount: apiRes.data.group?.messageCount || messages.length + 1,
            lastMessagePreview: cleanContent.slice(0, 160),
            lastMessageAt: nowIso
          });
        } catch {
          // Server SSE already persisted & broadcasted
        }
      }
    } finally {
      setSendingMsg(false);
    }
  };

  const handleDeleteGroup = async (group: ForumGroup) => {
    if (!user || group.isMandatoryAdminGroup) return;
    if (group.creatorId !== user.uid && !isAdmin) return;

    const apiRes = await safeFetchJson<{ success: boolean; error?: string }>(
      `/api/forum/groups/${encodeURIComponent(group.id)}?userId=${encodeURIComponent(
        user.uid
      )}&userEmail=${encodeURIComponent(user.email)}`,
      { method: 'DELETE' }
    );
    if (!apiRes.ok) {
      setErrorMsg(apiRes.data?.error || (isEn ? 'Could not delete group.' : 'Không thể xóa nhóm.'));
      return;
    }

    setGroups((prev) => prev.filter((g) => g.id !== group.id));
    if (selectedGroupId === group.id) {
      setSelectedGroupId(MANDATORY_ADMIN_GROUP_ID);
    }

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await deleteDoc(doc(db, 'forum_groups', group.id));
      } catch {}
    }
  };

  const handleDeleteMessage = async (msg: ForumMessage) => {
    if (!user) return;
    if (msg.isAdminGroup && !isAdmin) return;
    if (msg.senderId !== user.uid && !isAdmin) return;

    const apiRes = await safeFetchJson<{ success: boolean; group?: ForumGroup; error?: string }>(
      `/api/forum/groups/${encodeURIComponent(msg.groupId)}/messages/${encodeURIComponent(
        msg.id
      )}?userId=${encodeURIComponent(user.uid)}&userEmail=${encodeURIComponent(user.email)}`,
      { method: 'DELETE' }
    );
    if (!apiRes.ok) {
      setErrorMsg(apiRes.data?.error || (isEn ? 'Could not delete message.' : 'Không thể xóa tin nhắn.'));
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    if (apiRes.data?.group) {
      setGroups((prev) =>
        sortGroupsList(prev.map((g) => (g.id === apiRes.data!.group!.id ? apiRes.data!.group! : g)))
      );
    }

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await deleteDoc(doc(db, `forum_groups/${msg.groupId}/messages`, msg.id));
      } catch {}
    }
  };

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groups.filter((g) => {
      if (subjectFilter !== 'all' && g.subject !== subjectFilter) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.creatorName.toLowerCase().includes(q)
      );
    });
  }, [groups, searchQuery, subjectFilter]);

  const getSubjectLabel = (subj: ForumSubject) => {
    const found = SUBJECT_OPTIONS.find((s) => s.id === subj);
    return found ? (isEn ? found.labelEn : found.labelVi) : subj;
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString(isEn ? 'en-US' : 'vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-7 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_45px_-16px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Back' : 'Quay lại'}</span>
                </button>
              )}
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isEn ? 'Synapse Academic Community' : 'Diễn đàn Học tập & Nhóm Thảo luận'}</span>
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Study Forum & Discussion Groups' : 'Diễn Đàn Học Tập & Trao Đổi Nhóm'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {isEn
                ? 'Join topic study groups to discuss Math, Physics, and Computer Science with KaTeX support. Only signed-in users can create groups, message, or enter the mandatory Admin Synapse channel.'
                : 'Tạo nhóm trao đổi kiến thức Toán, Vật lí, Tin học và theo dõi thông báo hoạt động web chính thức. Chỉ tài khoản đã đăng nhập mới có thể tạo nhóm, nhắn tin và vào nhóm Admin quản lí.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!user && (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                <span>{isEn ? 'Sign In to Participate' : 'Đăng Nhập Tham Gia'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenCreateGroup}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isEn ? 'Create Study Group' : 'Tạo Nhóm Học Mới'}</span>
            </button>
          </div>
        </div>

        {/* Role & Auth status note */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <BrandLogo sizeClass="w-5 h-5" />
            <span>
              {isEn ? 'Official Web Admin:' : 'Quản trị kênh thông báo bắt buộc:'}{' '}
              <strong className="text-slate-900 dark:text-white">Synapse</strong>
            </span>
            {isAdmin && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                · {isEn ? 'Verified Admin Session Active' : 'Đang đăng nhập quyền Admin'}
              </span>
            )}
          </div>
          <div className="tabular-nums font-medium">
            {groups.length} {isEn ? 'active groups' : 'nhóm hoạt động'}
          </div>
        </div>
      </div>

      {/* Inline alerts */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main 12-Column Forum Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN (4 cols): Groups Directory */}
        <aside className="lg:col-span-4 rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search study groups...' : 'Tìm kiếm nhóm học tập...'}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>

          {/* Interactive Subject Filters */}
          <div className="flex flex-wrap gap-1.5">
            {SUBJECT_OPTIONS.map((opt) => {
              const active = subjectFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSubjectFilter(opt.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isEn ? opt.labelEn : opt.labelVi}
                </button>
              );
            })}
          </div>

          {/* Groups List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[560px] pr-1">
            {loadingGroups ? (
              <div className="py-10 text-center text-xs text-slate-400">
                {isEn ? 'Loading groups...' : 'Đang tải danh sách nhóm...'}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                {isEn ? 'No matching groups found.' : 'Chưa có nhóm phù hợp.'}
              </div>
            ) : (
              filteredGroups.map((grp) => {
                const isSelected = grp.id === selectedGroupId;
                const isMandatory = grp.isMandatoryAdminGroup || grp.id === MANDATORY_ADMIN_GROUP_ID;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => {
                      setErrorMsg(null);
                      setSelectedGroupId(grp.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? isMandatory
                          ? 'bg-amber-50/90 dark:bg-amber-950/35 border-amber-400 dark:border-amber-500/60 shadow-xs'
                          : 'bg-indigo-50/90 dark:bg-indigo-950/45 border-indigo-400 dark:border-indigo-500/60 shadow-xs'
                        : isMandatory
                        ? 'bg-amber-50/40 dark:bg-amber-950/15 border-amber-200/80 dark:border-amber-800/40 hover:border-amber-400'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {isMandatory ? (
                          <BrandLogo sizeClass="w-5 h-5" />
                        ) : (
                          <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {grp.name}
                        </span>
                      </div>
                      {isMandatory && !user && (
                        <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Clean typographic metadata (Zero-Pill) */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className={isMandatory ? 'text-amber-700 dark:text-amber-300 font-bold' : 'font-semibold'}>
                        {isMandatory
                          ? isEn
                            ? 'Mandatory · Admin Synapse'
                            : 'Bắt buộc · Admin Synapse'
                          : getSubjectLabel(grp.subject)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{grp.creatorName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {grp.messageCount} {isEn ? 'msgs' : 'tin nhắn'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">
                      {isMandatory && !user
                        ? isEn
                          ? 'Sign in required to enter Admin group.'
                          : 'Yêu cầu đăng nhập để vào nhóm thông báo.'
                        : grp.lastMessagePreview || grp.description}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN (8 cols): Discussion Room */}
        <section className="lg:col-span-8 rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex flex-col min-h-[580px] max-h-[720px] shadow-sm overflow-hidden">
          {selectedGroup ? (
            <>
              {/* Room Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/90">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {isSelectedMandatoryAdmin ? (
                      <BrandLogo sizeClass="w-6 h-6" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />
                    )}
                    <h2 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
                      {selectedGroup.name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedGroup.description}
                  </p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-1.5">
                    <span>
                      {isSelectedMandatoryAdmin
                        ? isEn
                          ? 'Mandatory System Announcement Group'
                          : 'Nhóm Thông Báo Hệ Thống Bắt Buộc'
                        : `${isEn ? 'Subject' : 'Chuyên mục'}: ${getSubjectLabel(selectedGroup.subject)}`}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {isEn ? 'Managed by' : 'Quản lí'}: <strong>{selectedGroup.creatorName}</strong>
                    </span>
                  </div>
                </div>

                {!selectedGroup.isMandatoryAdminGroup &&
                  user &&
                  (user.uid === selectedGroup.creatorId || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(selectedGroup)}
                      className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Delete Group' : 'Xóa nhóm'}</span>
                    </button>
                  )}
              </div>

              {/* Body: Either Gated Guest View for Mandatory Admin Group OR Message Timeline */}
              {isLockedAdminForGuest ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300/70 dark:border-amber-700/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {isEn
                        ? 'Sign In Required for Admin Group'
                        : 'Chỉ Tài Khoản Đã Đăng Nhập Mới Được Vào Nhóm Này'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isEn
                        ? 'This mandatory announcement channel is managed by Admin Synapse. Please sign in to view web activity notices and participate in study groups.'
                        : 'Đây là nhóm thông báo bắt buộc do tài khoản Admin Synapse quản lí. Vui lòng đăng nhập để xem thông báo hoạt động của web, tạo nhóm mới hoặc nhắn tin thảo luận.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{isEn ? 'Sign In Now' : 'Đăng Nhập Để Vào Nhóm Admin'}</span>
                    </button>
                    {groups.some((g) => !g.isMandatoryAdminGroup) && (
                      <button
                        type="button"
                        onClick={() => {
                          const firstPublic = groups.find((g) => !g.isMandatoryAdminGroup);
                          if (firstPublic) setSelectedGroupId(firstPublic.id);
                        }}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                      >
                        {isEn ? 'Browse Public Study Groups' : 'Xem thử nhóm học tập công khai'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Admin-only rule banner inside mandatory group */}
                  {isSelectedMandatoryAdmin && (
                    <div className="px-4 py-2.5 bg-amber-50/85 dark:bg-amber-950/35 border-b border-amber-200/70 dark:border-amber-800/40 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>
                        {isEn
                          ? 'Read-only announcement channel: Only Admin Synapse can publish web activity updates here.'
                          : 'Quy định kênh thông báo: Chỉ tài khoản Admin Synapse được phép gửi tin nhắn thông báo hoạt động của web.'}
                      </span>
                    </div>
                  )}

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                    {loadingMessages ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        {isEn ? 'Loading messages...' : 'Đang tải nội dung trao đổi...'}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        {isSelectedMandatoryAdmin
                          ? isEn
                            ? 'No announcements yet.'
                            : 'Chưa có thông báo mới từ Admin Synapse.'
                          : isEn
                          ? 'No messages yet. Start the discussion!'
                          : 'Nhóm chưa có tin nhắn nào. Hãy bắt đầu cuộc trao đổi!'}
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMine = user && msg.senderId === user.uid;
                        const isMsgAdmin = msg.senderRole === 'admin';
                        const canDelete =
                          user &&
                          ((msg.isAdminGroup && isAdmin) ||
                            (!msg.isAdminGroup && (isMine || isAdmin)));

                        return (
                          <div
                            key={msg.id}
                            className={`rounded-2xl border p-3.5 sm:p-4 space-y-2 ${
                              isMsgAdmin
                                ? 'bg-amber-50/75 dark:bg-amber-950/25 border-amber-300/75 dark:border-amber-700/45'
                                : isMine
                                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
                                : 'bg-slate-50/80 dark:bg-slate-800/45 border-slate-200/80 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {isMsgAdmin ? (
                                  <BrandLogo sizeClass="w-8 h-8 rounded-full border-amber-300 dark:border-amber-500/60" />
                                ) : msg.senderAvatar ? (
                                  <img
                                    src={msg.senderAvatar}
                                    alt={msg.senderName}
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 bg-indigo-600 text-white">
                                    {msg.senderName.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span className="font-extrabold text-slate-900 dark:text-white truncate">
                                      {msg.senderName}
                                    </span>
                                    {isMsgAdmin && (
                                      <span className="font-bold text-amber-700 dark:text-amber-300">
                                        · Admin
                                      </span>
                                    )}
                                    {msg.senderRole === 'teacher' && (
                                      <span className="font-bold text-sky-600 dark:text-sky-400">
                                        · {isEn ? 'Teacher' : 'Giáo viên'}
                                      </span>
                                    )}
                                    {msg.senderUsername && (
                                      <span className="font-mono text-[11px] text-slate-400">
                                        @{msg.senderUsername}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 tabular-nums">
                                    {formatTime(msg.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                                  title={isEn ? 'Delete message' : 'Xóa tin nhắn'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap pl-10">
                              <FormattedText text={msg.content} />
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Composer / Gate Footer */}
                  <div className="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/75 dark:bg-slate-900/90">
                    {!user ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>
                            {isEn
                              ? 'Sign in to send messages and create study groups.'
                              : 'Chỉ tài khoản đã đăng nhập mới có thể nhắn tin và tạo nhóm thảo luận.'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openAuthModal('login')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Sign In to Chat' : 'Đăng Nhập Nhắn Tin'}</span>
                        </button>
                      </div>
                    ) : isSelectedMandatoryAdmin && !isAdmin ? (
                      <div className="flex items-center gap-2.5 px-2 py-1.5 text-xs text-amber-800 dark:text-amber-300">
                        <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>
                          {isEn
                            ? 'Messaging disabled: Only Admin Synapse can send announcements here.'
                            : 'Khung chat chỉ đọc: Chỉ tài khoản Admin Synapse được phép gửi thông báo tại nhóm này.'}
                        </span>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="space-y-2">
                        <div className="flex items-end gap-2">
                          <textarea
                            rows={2}
                            maxLength={2000}
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                void handleSendMessage();
                              }
                            }}
                            placeholder={
                              isSelectedMandatoryAdmin
                                ? isEn
                                  ? 'Write an official web announcement as Admin Synapse...'
                                  : 'Nhập thông báo chính thức về hoạt động của web (Admin Synapse)...'
                                : isEn
                                ? 'Write a message or formula ($a^2+b^2=c^2$) · Enter to send...'
                                : 'Nhập tin nhắn trao đổi (hỗ trợ KaTeX dạng $x^2 + y^2 = R^2$) · Enter để gửi...'
                            }
                            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none"
                          />
                          <button
                            type="submit"
                            disabled={sendingMsg || !messageInput.trim()}
                            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
                          >
                            <Send className="w-4 h-4" />
                            <span>{isEn ? 'Send' : 'Gửi'}</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            {isEn
                              ? 'Supports inline KaTeX math ($...$) · Shift+Enter for new line'
                              : 'Hỗ trợ công thức Toán/Lí chuẩn KaTeX ($...$) · Shift+Enter xuống dòng'}
                          </span>
                          <span className="tabular-nums">{messageInput.length}/2000</span>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-500">
              {isEn ? 'Select a study group on the left to start.' : 'Chọn một nhóm ở bên trái để bắt đầu.'}
            </div>
          )}
        </section>
      </div>

      {/* Create Group Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEn ? 'Create a New Study Group' : 'Tạo Nhóm Học Tập Mới'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEn
                    ? 'Everyone who signs in can join and exchange ideas in your group.'
                    : 'Các thành viên đã đăng nhập có thể vào nhóm để cùng trao đổi bài học.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEn ? 'Group Name:' : 'Tên nhóm học tập:'}
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={80}
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={
                    isEn
                      ? 'e.g. Grade 12 Calculus & Integral Prep'
                      : 'ví dụ: Ôn thi Hình học Đường tròn & Chuyên Toán'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEn ? 'Subject Focus:' : 'Chuyên mục môn học:'}
                </label>
                <select
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value as Exclude<ForumSubject, 'announcements'>)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {CREATE_SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {isEn ? opt.labelEn : opt.labelVi}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {isEn ? 'Group Description:' : 'Mô tả mục tiêu trao đổi:'}
                </label>
                <textarea
                  rows={3}
                  required
                  minLength={3}
                  maxLength={300}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder={
                    isEn
                      ? 'Describe topics, problems, or grade level for this study group...'
                      : 'Mô tả chủ đề bài tập, khối lớp hoặc mục tiêu trao đổi của nhóm...'
                  }
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={creatingGroup}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {creatingGroup
                      ? isEn
                        ? 'Creating...'
                        : 'Đang tạo nhóm...'
                      : isEn
                      ? 'Create Group'
                      : 'Tạo Nhóm Ngay'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
