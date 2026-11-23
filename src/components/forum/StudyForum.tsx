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
  BookOpen,
  Box,
  Hand,
  ArrowRight,
  Pin,
  Reply,
  BarChart3,
  Sparkles,
  Copy,
  Check,
  Eye,
  Sigma,
  Loader2
} from 'lucide-react';
import { ForumGroup, ForumMessage, ForumMessageReplyRef, ForumSubject, UserProfile } from '../../types';
import { useAuth, SYNAPSE_ADMIN_EMAIL, SYNAPSE_LOGO_AVATAR } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText } from '../common/MathRenderer';
import { BrandLogo } from '../common/BrandLogo';
import { parseCoopForumInviteContent } from '../spatial3d/coopTypes';
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
  const { navigate } = useNavigation();
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

  // Modern forum feature states
  const [mobilePane, setMobilePane] = useState<'groups' | 'chat'>('groups');
  const [roomSearchOpen, setRoomSearchOpen] = useState(false);
  const [roomSearchQuery, setRoomSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<ForumMessageReplyRef | null>(null);
  const [showLatexPreview, setShowLatexPreview] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [askingAi, setAskingAi] = useState(false);

  // Poll composer modal state
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [creatingPoll, setCreatingPoll] = useState(false);

  // Feedback / Error alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedGroupIdRef = useRef<string>(selectedGroupId);
  selectedGroupIdRef.current = selectedGroupId;
  const prevGroupIdRef = useRef<string>(selectedGroupId);
  const prevMsgCountRef = useRef<number>(0);
  const scrollGuardCancelRef = useRef<(() => void) | null>(null);

  // Disable browser scroll-anchoring while StudyForum is mounted so appending chat messages
  // or updating sidebar groups never pushes the outer viewport down.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prevHtmlAnchor = htmlEl.style.overflowAnchor;
    const prevBodyAnchor = bodyEl.style.overflowAnchor;
    htmlEl.style.overflowAnchor = 'none';
    bodyEl.style.overflowAnchor = 'none';
    return () => {
      htmlEl.style.overflowAnchor = prevHtmlAnchor;
      bodyEl.style.overflowAnchor = prevBodyAnchor;
      scrollGuardCancelRef.current?.();
    };
  }, []);

  const preserveViewportScroll = useCallback((customX?: number, customY?: number) => {
    if (typeof window === 'undefined') return;
    scrollGuardCancelRef.current?.();
    const targetX = customX ?? window.scrollX;
    const targetY = customY ?? window.scrollY;
    let active = true;

    const cancel = () => {
      active = false;
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
    };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchmove', cancel, { passive: true, once: true });

    const snap = () => {
      if (!active) return;
      if (Math.abs(window.scrollY - targetY) > 1 || Math.abs(window.scrollX - targetX) > 1) {
        window.scrollTo({ left: targetX, top: targetY, behavior: 'auto' });
      }
    };

    const raf1 = window.requestAnimationFrame(() => {
      snap();
      window.requestAnimationFrame(snap);
    });
    const t1 = window.setTimeout(snap, 60);
    const t2 = window.setTimeout(() => {
      snap();
      cancel();
    }, 160);

    scrollGuardCancelRef.current = () => {
      active = false;
      window.cancelAnimationFrame(raf1);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchmove', cancel);
    };
  }, []);

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
          if (msg.groupId === selectedGroupIdRef.current && (!msg.isAdminGroup || Boolean(user))) {
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
        } else if (payload.type === 'forum:message_updated' && payload.message) {
          const updated: ForumMessage = payload.message;
          if (updated.groupId === selectedGroupIdRef.current) {
            setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          }
        } else if (payload.type === 'forum:group_pinned' && payload.group) {
          const pinnedGrp: ForumGroup = payload.group;
          setGroups((prev) => prev.map((g) => (g.id === pinnedGrp.id ? pinnedGrp : g)));
        }
      } catch {
        // ignore keepalive/malformed events
      }
    };

    return () => {
      es.close();
    };
  }, [user, sortGroupsList]);

  // Fetch messages when selectedGroupId or auth state changes
  const fetchMessagesForGroup = useCallback(async () => {
    if (!selectedGroupId) return;
    if (!user && selectedGroupId === MANDATORY_ADMIN_GROUP_ID) {
      setMessages([]);
      return;
    }

    const savedX = typeof window !== 'undefined' ? window.scrollX : 0;
    const savedY = typeof window !== 'undefined' ? window.scrollY : 0;
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
      preserveViewportScroll(savedX, savedY);
    }
  }, [selectedGroupId, user, preserveViewportScroll]);

  useEffect(() => {
    setReplyingTo(null);
    setRoomSearchQuery('');
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

  // Scroll only INSIDE the messages container without ever nudging the outer page viewport
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      prevGroupIdRef.current = selectedGroupId;
      prevMsgCountRef.current = messages.length;
      return;
    }

    const groupChanged = prevGroupIdRef.current !== selectedGroupId;
    const msgAdded = messages.length > prevMsgCountRef.current;
    prevGroupIdRef.current = selectedGroupId;
    prevMsgCountRef.current = messages.length;

    if (!groupChanged && !msgAdded) return;

    const rafId = window.requestAnimationFrame(() => {
      if (container.scrollHeight > container.clientHeight) {
        container.scrollTop = container.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [messages.length, selectedGroupId]);

  const handleOpenCreateGroup = () => {
    preserveViewportScroll();
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
    if (sendingMsg) return;
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

    const savedScrollX = typeof window !== 'undefined' ? window.scrollX : 0;
    const savedScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const preserveOuterScroll = () => {
      preserveViewportScroll(savedScrollX, savedScrollY);
    };

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
          content: cleanContent,
          ...(replyingTo ? { replyTo: replyingTo } : {})
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
      setReplyingTo(null);
      messageTextareaRef.current?.focus({ preventScroll: true });
      preserveOuterScroll();

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
      preserveOuterScroll();
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

    const savedX = typeof window !== 'undefined' ? window.scrollX : 0;
    const savedY = typeof window !== 'undefined' ? window.scrollY : 0;

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
    preserveViewportScroll(savedX, savedY);

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await deleteDoc(doc(db, `forum_groups/${msg.groupId}/messages`, msg.id));
      } catch {}
    }
  };

  const handleToggleReaction = async (msg: ForumMessage, emoji: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    preserveViewportScroll();
    const res = await safeFetchJson<{ success: boolean; message?: ForumMessage; error?: string }>(
      `/api/forum/groups/${encodeURIComponent(msg.groupId)}/messages/${encodeURIComponent(msg.id)}/react`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, emoji })
      }
    );
    if (res.ok && res.data?.message) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? res.data!.message! : m)));
    }
  };

  const handleVotePoll = async (msg: ForumMessage, optionId: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    preserveViewportScroll();
    const res = await safeFetchJson<{ success: boolean; message?: ForumMessage; error?: string }>(
      `/api/forum/groups/${encodeURIComponent(msg.groupId)}/messages/${encodeURIComponent(msg.id)}/vote`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, optionId })
      }
    );
    if (res.ok && res.data?.message) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? res.data!.message! : m)));
    }
  };

  const handleTogglePinMessage = async (msg: ForumMessage) => {
    if (!user || !selectedGroup) return;
    preserveViewportScroll();
    const res = await safeFetchJson<{ success: boolean; group?: ForumGroup; error?: string }>(
      `/api/forum/groups/${encodeURIComponent(selectedGroup.id)}/pin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          messageId: selectedGroup.pinnedMessageId === msg.id ? '' : msg.id
        })
      }
    );
    if (res.ok && res.data?.group) {
      setGroups((prev) => prev.map((g) => (g.id === res.data!.group!.id ? res.data!.group! : g)));
      setStatusMsg(
        res.data.group.pinnedMessageId
          ? isEn ? 'Message pinned!' : 'Đã ghim tin nhắn lên đầu phòng!'
          : isEn ? 'Message unpinned.' : 'Đã bỏ ghim tin nhắn.'
      );
    } else if (res.data?.error) {
      setErrorMsg(res.data.error);
    }
  };

  const handleCreatePollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedGroup) {
      openAuthModal('login');
      return;
    }
    if (isSelectedMandatoryAdmin && !isAdmin) return;
    const cleanQ = pollQuestion.trim();
    const cleanOpts = pollOptions.map((o) => o.trim()).filter(Boolean);
    if (cleanQ.length < 3 || cleanOpts.length < 2) {
      setErrorMsg(isEn ? 'Enter a poll question and at least 2 options.' : 'Vui lòng nhập câu hỏi và ít nhất 2 lựa chọn.');
      return;
    }

    setCreatingPoll(true);
    try {
      const apiRes = await safeFetchJson<{ success: boolean; message?: ForumMessage; group?: ForumGroup; error?: string }>(
        `/api/forum/groups/${encodeURIComponent(selectedGroup.id)}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: user.uid,
            senderName: isAdmin ? 'Synapse' : user.displayName,
            senderUsername: isAdmin ? 'Synapse' : user.username,
            senderEmail: user.email,
            senderAvatar: isAdmin ? SYNAPSE_LOGO_AVATAR : user.avatarUrl || '',
            senderRole: isAdmin ? 'admin' : user.role,
            content: `📊 **Bình chọn:** ${cleanQ}`,
            poll: {
              question: cleanQ,
              options: cleanOpts.map((text, idx) => ({ id: `opt_${idx + 1}`, text, votes: [] }))
            }
          })
        }
      );
      if (apiRes.ok && apiRes.data?.message) {
        setMessages((prev) =>
          prev.some((m) => m.id === apiRes.data!.message!.id) ? prev : [...prev, apiRes.data!.message!]
        );
        if (apiRes.data.group) {
          setGroups((prev) =>
            sortGroupsList(prev.map((g) => (g.id === apiRes.data!.group!.id ? apiRes.data!.group! : g)))
          );
        }
        setPollQuestion('');
        setPollOptions(['', '']);
        setIsPollOpen(false);
        setStatusMsg(isEn ? 'Poll published!' : 'Đã tạo cuộc bình chọn trong nhóm!');
      } else {
        setErrorMsg(apiRes.data?.error || 'Không thể tạo bình chọn.');
      }
    } finally {
      setCreatingPoll(false);
    }
  };

  const handleAskSynAiInGroup = async () => {
    if (!user || !selectedGroup) {
      openAuthModal('login');
      return;
    }
    if (isSelectedMandatoryAdmin && !isAdmin) return;
    if (askingAi) return;

    const typedPrompt = messageInput.trim();
    const recentMsg = [...messages].reverse().find((m) => !m.isAiReply && m.content.trim().length > 0);
    const questionText = typedPrompt || recentMsg?.content || '';
    if (!questionText) {
      setErrorMsg(isEn ? 'Type a question first for Syn AI.' : 'Hãy nhập câu hỏi vào ô soạn thảo để hỏi Syn AI!');
      return;
    }

    setAskingAi(true);
    setErrorMsg(null);
    preserveViewportScroll();
    try {
      const subjectMap: Record<ForumSubject, 'math' | 'physics' | 'cs'> = {
        announcements: 'math',
        general: 'math',
        math: 'math',
        physics: 'physics',
        cs: 'cs',
        exams: 'math'
      };
      const tutorRes = await safeFetchJson<{ success: boolean; reply?: string; error?: string }>(
        '/api/gemini/tutor',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                text: `Trong nhóm "${selectedGroup.name}", học sinh hỏi: ${questionText}\nHãy giải đáp ngắn gọn, chính xác công thức KaTeX ($...$) để đăng lên diễn đàn học tập.`
              }
            ],
            context: {
              subject: subjectMap[selectedGroup.subject] || 'math',
              mode: 'full_solution',
              topic: selectedGroup.name
            },
            language
          })
        }
      );

      if (!tutorRes.ok || !tutorRes.data?.reply) {
        setErrorMsg(tutorRes.data?.error || (isEn ? 'Syn AI could not reply right now.' : 'Syn AI tạm thời chưa phản hồi được.'));
        return;
      }

      let replyRef: ForumMessageReplyRef | undefined = recentMsg
        ? {
            id: recentMsg.id,
            senderName: recentMsg.senderName,
            excerpt: recentMsg.content.slice(0, 120)
          }
        : undefined;

      // If user typed a fresh question in the composer, post their question first
      if (typedPrompt) {
        const qRes = await safeFetchJson<{ success: boolean; message?: ForumMessage; group?: ForumGroup }>(
          `/api/forum/groups/${encodeURIComponent(selectedGroup.id)}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: user.uid,
              senderName: isAdmin ? 'Synapse' : user.displayName,
              senderUsername: isAdmin ? 'Synapse' : user.username,
              senderEmail: user.email,
              senderAvatar: isAdmin ? SYNAPSE_LOGO_AVATAR : user.avatarUrl || '',
              senderRole: isAdmin ? 'admin' : user.role,
              content: typedPrompt
            })
          }
        );
        if (qRes.ok && qRes.data?.message) {
          const postedQ = qRes.data.message;
          setMessages((prev) => (prev.some((m) => m.id === postedQ.id) ? prev : [...prev, postedQ]));
          replyRef = {
            id: postedQ.id,
            senderName: postedQ.senderName,
            excerpt: postedQ.content.slice(0, 120)
          };
          setMessageInput('');
        }
      }

      const aiRes = await safeFetchJson<{ success: boolean; message?: ForumMessage; group?: ForumGroup }>(
        `/api/forum/groups/${encodeURIComponent(selectedGroup.id)}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: user.uid,
            senderName: 'Synapse AI',
            senderUsername: 'synapse_ai',
            senderEmail: user.email,
            senderRole: 'admin',
            isAiReply: true,
            replyTo: replyRef,
            content: tutorRes.data.reply.slice(0, 3900)
          })
        }
      );

      if (aiRes.ok && aiRes.data?.message) {
        const aiMsg = aiRes.data.message;
        setMessages((prev) => (prev.some((m) => m.id === aiMsg.id) ? prev : [...prev, aiMsg]));
        if (aiRes.data.group) {
          setGroups((prev) =>
            sortGroupsList(prev.map((g) => (g.id === aiRes.data!.group!.id ? aiRes.data!.group! : g)))
          );
        }
      }
    } finally {
      setAskingAi(false);
    }
  };

  const insertLatexSnippet = (snippet: string) => {
    const el = messageTextareaRef.current;
    if (!el) {
      setMessageInput((prev) => `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${snippet}`);
      return;
    }
    const start = el.selectionStart ?? messageInput.length;
    const end = el.selectionEnd ?? messageInput.length;
    const nextVal = messageInput.slice(0, start) + snippet + messageInput.slice(end);
    setMessageInput(nextVal);
    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const scrollToMessageInsideRoom = (targetMsgId: string) => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const el = document.getElementById(`forum-msg-${targetMsgId}`);
    if (!el) return;
    const targetTop = Math.max(0, el.offsetTop - container.offsetTop - 16);
    container.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  const pinnedMessage = useMemo(() => {
    if (!selectedGroup?.pinnedMessageId) return null;
    return messages.find((m) => m.id === selectedGroup.pinnedMessageId) || null;
  }, [selectedGroup?.pinnedMessageId, messages]);

  const visibleMessages = useMemo(() => {
    const q = roomSearchQuery.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.senderName.toLowerCase().includes(q) ||
        (m.poll?.question.toLowerCase().includes(q) ?? false)
    );
  }, [messages, roomSearchQuery]);

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
    <div className="space-y-6" style={{ overflowAnchor: 'none' }}>
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

      {/* Floating Fixed Alerts — zero layout shift when appearing/disappearing */}
      {(errorMsg || statusMsg) && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[120] w-[calc(100%-2rem)] max-w-lg space-y-2 pointer-events-none">
          {errorMsg && (
            <div className="pointer-events-auto p-3.5 rounded-2xl bg-rose-50/95 dark:bg-rose-950/95 backdrop-blur-md border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  preserveViewportScroll();
                  setErrorMsg(null);
                }}
                className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {statusMsg && (
            <div className="pointer-events-auto p-3.5 rounded-2xl bg-emerald-50/95 dark:bg-emerald-950/95 backdrop-blur-md border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  preserveViewportScroll();
                  setStatusMsg(null);
                }}
                className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile View Switcher (< lg) */}
      <div className="lg:hidden grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={() => setMobilePane('groups')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobilePane === 'groups'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isEn ? `Groups (${groups.length})` : `Nhóm học (${groups.length})`}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePane('chat')}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobilePane === 'chat'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="truncate">{selectedGroup?.name || (isEn ? 'Chat Room' : 'Phòng chat')}</span>
        </button>
      </div>

      {/* Main 12-Column Forum Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN (4 cols): Groups Directory */}
        <aside
          className={`${mobilePane === 'groups' ? 'flex' : 'hidden lg:flex'} lg:col-span-4 rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-5 flex-col gap-4 shadow-sm`}
          style={{ overflowAnchor: 'none' }}
        >
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
                  data-no-lift="true"
                  onClick={() => {
                    preserveViewportScroll();
                    setSubjectFilter(opt.id);
                  }}
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
          <div className="space-y-2.5 overflow-y-auto max-h-[560px] pr-1" style={{ overflowAnchor: 'none' }}>
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
                    data-no-lift="true"
                    onClick={() => {
                      preserveViewportScroll();
                      setErrorMsg(null);
                      setSelectedGroupId(grp.id);
                      setMobilePane('chat');
                    }}
                    className={`w-full min-h-[92px] text-left p-3.5 rounded-2xl border transition-colors cursor-pointer space-y-1.5 ${
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
        <section
          className={`${mobilePane === 'chat' ? 'flex' : 'hidden lg:flex'} lg:col-span-8 rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 flex-col h-[640px] lg:h-[710px] shadow-sm overflow-hidden`}
          style={{ overflowAnchor: 'none' }}
        >
          {selectedGroup ? (
            <>
              {/* Room Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 space-y-2.5 bg-slate-50/70 dark:bg-slate-900/90">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => setMobilePane('groups')}
                        className="lg:hidden p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
                        title={isEn ? 'All groups' : 'Danh sách nhóm'}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
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
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                        {messages.length} {isEn ? 'messages' : 'tin nhắn'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {!isLockedAdminForGuest && (
                      <button
                        type="button"
                        onClick={() => setRoomSearchOpen((v) => !v)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          roomSearchOpen || roomSearchQuery
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{isEn ? 'Search' : 'Tìm tin'}</span>
                      </button>
                    )}

                    {!selectedGroup.isMandatoryAdminGroup &&
                      user &&
                      (user.uid === selectedGroup.creatorId || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(selectedGroup)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Delete Group' : 'Xóa nhóm'}</span>
                        </button>
                      )}
                  </div>
                </div>

                {roomSearchOpen && !isLockedAdminForGuest && (
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={roomSearchQuery}
                        onChange={(e) => setRoomSearchQuery(e.target.value)}
                        placeholder={isEn ? 'Filter messages by keyword, formula, or author...' : 'Lọc nhanh tin nhắn theo từ khóa, công thức hoặc người gửi...'}
                        className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      />
                      {roomSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setRoomSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {roomSearchQuery && (
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums whitespace-nowrap">
                        {visibleMessages.length}/{messages.length}
                      </span>
                    )}
                  </div>
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
                        data-no-lift="true"
                        onClick={() => {
                          preserveViewportScroll();
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

                  {/* Pinned Message Banner */}
                  {pinnedMessage && (
                    <div className="px-4 py-2.5 bg-indigo-50/90 dark:bg-indigo-950/45 border-b border-indigo-200/70 dark:border-indigo-700/45 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => scrollToMessageInsideRoom(pinnedMessage.id)}
                        className="flex items-center gap-2 min-w-0 text-left cursor-pointer hover:opacity-85"
                      >
                        <Pin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                          {isEn ? 'Pinned:' : 'Tin đã ghim:'}
                        </span>
                        <span className="text-slate-700 dark:text-slate-200 truncate">
                          <strong>{pinnedMessage.senderName}:</strong> {pinnedMessage.content}
                        </span>
                      </button>
                      {user && (user.uid === selectedGroup.creatorId || isAdmin) && (
                        <button
                          type="button"
                          onClick={() => handleTogglePinMessage(pinnedMessage)}
                          className="text-[11px] font-bold text-slate-500 hover:text-rose-500 shrink-0 cursor-pointer"
                        >
                          {isEn ? 'Unpin' : 'Bỏ ghim'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Messages Feed */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5"
                    style={{ overflowAnchor: 'none' }}
                  >
                    {loadingMessages && messages.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        {isEn ? 'Loading messages...' : 'Đang tải nội dung trao đổi...'}
                      </div>
                    ) : visibleMessages.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        {roomSearchQuery
                          ? isEn
                            ? 'No messages match your search filter.'
                            : 'Không tìm thấy tin nhắn phù hợp từ khóa.'
                          : isSelectedMandatoryAdmin
                          ? isEn
                            ? 'No announcements yet.'
                            : 'Chưa có thông báo mới từ Admin Synapse.'
                          : isEn
                          ? 'No messages yet. Start the discussion!'
                          : 'Nhóm chưa có tin nhắn nào. Hãy bắt đầu cuộc trao đổi!'}
                      </div>
                    ) : (
                      visibleMessages.map((msg) => {
                        const isMine = Boolean(user && msg.senderId === user.uid && !msg.isAiReply);
                        const isMsgAdmin = msg.senderRole === 'admin' && !msg.isAiReply;
                        const isPinned = selectedGroup.pinnedMessageId === msg.id;
                        const canDelete =
                          user &&
                          ((msg.isAdminGroup && isAdmin) ||
                            (!msg.isAdminGroup && (user.uid === msg.senderId || isAdmin)));
                        const canPin =
                          user &&
                          ((selectedGroup.isMandatoryAdminGroup && isAdmin) ||
                            (!selectedGroup.isMandatoryAdminGroup &&
                              (user.uid === selectedGroup.creatorId || isAdmin)));
                        const reactionEntries = Object.entries(msg.reactions || {}).filter(
                          ([, list]) => Array.isArray(list) && list.length > 0
                        );
                        const totalPollVotes = msg.poll
                          ? msg.poll.options.reduce((sum, o) => sum + o.votes.length, 0)
                          : 0;

                        return (
                          <div
                            id={`forum-msg-${msg.id}`}
                            key={msg.id}
                            className={`group rounded-2xl border p-3.5 sm:p-4 space-y-2.5 transition-colors ${
                              msg.isAiReply
                                ? 'bg-gradient-to-br from-cyan-50/90 via-indigo-50/75 to-sky-50/90 dark:from-cyan-950/35 dark:via-indigo-950/25 dark:to-slate-900/90 border-cyan-300/80 dark:border-cyan-500/40'
                                : isMsgAdmin
                                ? 'bg-amber-50/75 dark:bg-amber-950/25 border-amber-300/75 dark:border-amber-700/45'
                                : isMine
                                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
                                : 'bg-slate-50/80 dark:bg-slate-800/45 border-slate-200/80 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {msg.isAiReply ? (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                ) : isMsgAdmin ? (
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
                                    {msg.isAiReply && (
                                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] uppercase tracking-wider">
                                        AI Mentor
                                      </span>
                                    )}
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
                                    {msg.senderUsername && !msg.isAiReply && (
                                      <span className="font-mono text-[11px] text-slate-400">
                                        @{msg.senderUsername}
                                      </span>
                                    )}
                                    {isPinned && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                        <Pin className="w-3 h-3" />
                                        <span>{isEn ? 'Pinned' : 'Đã ghim'}</span>
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 tabular-nums">
                                    {formatTime(msg.createdAt)}
                                  </div>
                                </div>
                              </div>

                              {/* Message quick actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                {user && (!isSelectedMandatoryAdmin || isAdmin) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyingTo({
                                        id: msg.id,
                                        senderName: msg.senderName,
                                        excerpt: msg.content.slice(0, 140)
                                      });
                                      messageTextareaRef.current?.focus({ preventScroll: true });
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                                    title={isEn ? 'Reply' : 'Trả lời'}
                                  >
                                    <Reply className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(msg.content).catch(() => {});
                                    setCopiedMsgId(msg.id);
                                    setTimeout(() => setCopiedMsgId(null), 1600);
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                                  title={isEn ? 'Copy text' : 'Sao chép'}
                                >
                                  {copiedMsgId === msg.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                {canPin && (
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePinMessage(msg)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      isPinned
                                        ? 'text-indigo-600 bg-indigo-100/70 dark:bg-indigo-950/60'
                                        : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                                    }`}
                                    title={isPinned ? (isEn ? 'Unpin' : 'Bỏ ghim') : (isEn ? 'Pin message' : 'Ghim tin nhắn')}
                                  >
                                    <Pin className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title={isEn ? 'Delete message' : 'Xóa tin nhắn'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Quoted Reply Preview */}
                            {msg.replyTo && (
                              <button
                                type="button"
                                onClick={() => scrollToMessageInsideRoom(msg.replyTo!.id)}
                                className="ml-10 w-[calc(100%-2.5rem)] text-left px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border-l-2 border-indigo-500 text-[11px] text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
                              >
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                  @{msg.replyTo.senderName}:{' '}
                                </span>
                                <span className="line-clamp-1">{msg.replyTo.excerpt}</span>
                              </button>
                            )}

                            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap pl-10 space-y-2.5">
                              {(() => {
                                const { invite, displayText } = parseCoopForumInviteContent(msg.content);
                                return (
                                  <>
                                    {displayText && <FormattedText text={displayText} />}
                                    {msg.poll && (
                                      <div className="rounded-xl bg-white/95 dark:bg-slate-900/80 border border-indigo-200/80 dark:border-indigo-800/60 p-3.5 space-y-2.5 max-w-md shadow-xs">
                                        <div className="flex items-center justify-between gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                                          <span className="flex items-center gap-1.5">
                                            <BarChart3 className="w-4 h-4 text-indigo-500 shrink-0" />
                                            <span>{msg.poll.question}</span>
                                          </span>
                                          <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                                            {totalPollVotes} {isEn ? 'votes' : 'phiếu'}
                                          </span>
                                        </div>
                                        <div className="space-y-1.5">
                                          {msg.poll.options.map((opt) => {
                                            const pct = totalPollVotes > 0 ? Math.round((opt.votes.length / totalPollVotes) * 100) : 0;
                                            const voted = Boolean(user && opt.votes.includes(user.uid));
                                            return (
                                              <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleVotePoll(msg, opt.id)}
                                                className={`relative w-full text-left rounded-lg border px-3 py-2 overflow-hidden transition-colors cursor-pointer ${
                                                  voted
                                                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                                }`}
                                              >
                                                <div
                                                  className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                                                    voted ? 'bg-indigo-500/20' : 'bg-slate-200/50 dark:bg-slate-700/40'
                                                  }`}
                                                  style={{ width: `${pct}%` }}
                                                />
                                                <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                                                  <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                                    {voted && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                                                    <span>{opt.text}</span>
                                                  </span>
                                                  <span className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 tabular-nums shrink-0">
                                                    {pct}% ({opt.votes.length})
                                                  </span>
                                                </div>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    {invite && (
                                      <div className="rounded-xl bg-[#071126] text-slate-100 border border-cyan-400/55 p-3.5 shadow-lg space-y-2.5 max-w-md">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300">
                                            <Hand className="w-3.5 h-3.5" />
                                            <span>
                                              {isEn
                                                ? 'CO-OP 3D HANDS · 2–4 LEARNERS'
                                                : 'BÀN TAY ẢO BẠN HỌC · PHÒNG 3D'}
                                            </span>
                                          </span>
                                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 font-mono text-[10px] font-bold text-cyan-200">
                                            #{invite.roomId}
                                          </span>
                                        </div>

                                        <div>
                                          <div className="text-sm font-extrabold text-white">
                                            {invite.title}
                                          </div>
                                          <div className="text-[11px] text-slate-300 mt-0.5 flex flex-wrap items-center gap-1.5">
                                            <Box className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                            <span className="font-semibold text-sky-200">
                                              {invite.modelTitle}
                                            </span>
                                            <span>·</span>
                                            <span>
                                              {isEn ? 'Host:' : 'Chủ phòng:'} {invite.hostName}
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            navigate({
                                              subject: 'spatial_3d',
                                              coopRoomCode: invite.roomId,
                                              coopInviteMeta: invite,
                                              tutorOpen: false
                                            })
                                          }
                                          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 text-xs font-extrabold cursor-pointer transition-colors"
                                        >
                                          <Hand className="w-3.5 h-3.5" />
                                          <span>
                                            {isEn
                                              ? 'Join Shared 3D Space'
                                              : 'Tham Gia Không Gian 3D Chung'}
                                          </span>
                                          <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>

                            {/* Emoji Reactions Bar */}
                            <div className="pl-10 flex flex-wrap items-center gap-1.5 pt-0.5">
                              {reactionEntries.map(([emoji, users]) => {
                                const reacted = Boolean(user && users.includes(user.uid));
                                return (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg, emoji)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                      reacted
                                        ? 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-400 text-indigo-700 dark:text-indigo-200'
                                        : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                                    }`}
                                  >
                                    <span>{emoji}</span>
                                    <span className="tabular-nums">{users.length}</span>
                                  </button>
                                );
                              })}

                              {user && (
                                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  {['👍', '🔥', '💡', '❤️'].map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => handleToggleReaction(msg, emoji)}
                                      className="px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 text-[11px] cursor-pointer"
                                      title={isEn ? `React ${emoji}` : `Thả ${emoji}`}
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
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
                        {/* Reply Preview Strip */}
                        {replyingTo && (
                          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs">
                            <div className="min-w-0 truncate text-slate-700 dark:text-slate-200">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {isEn ? 'Replying to' : 'Đang trả lời'} {replyingTo.senderName}:{' '}
                              </span>
                              <span>{replyingTo.excerpt}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Modern KaTeX Quick-Insert + Poll + Syn AI Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                              <Sigma className="w-3.5 h-3.5 text-indigo-500" />
                              <span>KaTeX:</span>
                            </span>
                            {[
                              { label: 'a/b', code: '$\\frac{a}{b}$' },
                              { label: '√x', code: '$\\sqrt{x}$' },
                              { label: 'x²', code: '$x^2$' },
                              { label: '∫f(x)', code: '$\\int_a^b f(x)\\,dx$' },
                              { label: '→v', code: '$\\vec{v}$' },
                              { label: 'Δ', code: '$\\Delta$' }
                            ].map((snip) => (
                              <button
                                key={snip.label}
                                type="button"
                                onClick={() => insertLatexSnippet(snip.code)}
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                              >
                                {snip.label}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowLatexPreview((v) => !v)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
                                showLatexPreview
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                              }`}
                            >
                              <Eye className="w-3 h-3" />
                              <span>{isEn ? 'Preview' : 'Xem trước'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsPollOpen(true)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                            >
                              <BarChart3 className="w-3 h-3 text-indigo-500" />
                              <span>{isEn ? 'Poll' : 'Bình chọn'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={askingAi}
                              onClick={() => void handleAskSynAiInGroup()}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-60 text-white text-[11px] font-extrabold cursor-pointer shadow-xs"
                              title={isEn ? 'Ask Syn AI to reply in this group' : 'Nhờ Syn AI giải thích & đăng lời giải vào nhóm'}
                            >
                              {askingAi ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>{askingAi ? (isEn ? 'Thinking...' : 'Đang giải...') : 'Hỏi Syn AI'}</span>
                            </button>
                          </div>
                        </div>

                        {showLatexPreview && messageInput.trim() && (
                          <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-800 text-xs text-slate-800 dark:text-slate-100">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">
                              {isEn ? 'Live KaTeX Preview' : 'Xem trước công thức trực tiếp'}
                            </div>
                            <FormattedText text={messageInput} />
                          </div>
                        )}

                        <div className="flex items-end gap-2">
                          <textarea
                            ref={messageTextareaRef}
                            rows={2}
                            maxLength={4000}
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
                            data-no-lift="true"
                            aria-disabled={sendingMsg || !messageInput.trim()}
                            className={`px-4 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 whitespace-nowrap transition-opacity ${
                              sendingMsg || !messageInput.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-indigo-700 cursor-pointer'
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            <span>{isEn ? 'Send' : 'Gửi'}</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            {isEn
                              ? 'KaTeX ($...$), Reactions, Reply, Polls & Syn AI · Shift+Enter for new line'
                              : 'Hỗ trợ KaTeX ($...$), Bình chọn, Trích dẫn & Hỏi Syn AI · Shift+Enter xuống dòng'}
                          </span>
                          <span className="tabular-nums">{messageInput.length}/4000</span>
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
      {/* Create Academic Poll Modal */}
      {isPollOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                  {isEn ? 'Create Academic Poll' : 'Tạo Bình Chọn Trong Nhóm'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPollOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePollSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEn ? 'Poll Question' : 'Câu hỏi bình chọn:'}
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={240}
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder={isEn ? 'e.g. Which topic should we review tonight?' : 'VD: Tối nay ôn chuyên đề nào trước?'}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isEn ? 'Options (2–5)' : 'Các lựa chọn (2–5):'}
                </label>
                {pollOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required={idx < 2}
                      maxLength={140}
                      value={opt}
                      onChange={(e) =>
                        setPollOptions((prev) => prev.map((v, i) => (i === idx ? e.target.value : v)))
                      }
                      placeholder={`${isEn ? 'Option' : 'Lựa chọn'} ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setPollOptions((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions((prev) => [...prev, ''])}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Add option' : 'Thêm lựa chọn'}</span>
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPollOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={creatingPoll}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{creatingPoll ? (isEn ? 'Publishing...' : 'Đang tạo...') : (isEn ? 'Publish Poll' : 'Đăng Bình Chọn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
