import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Atom,
  Bell,
  Bookmark,
  BookOpen,
  Box,
  Check,
  Code2,
  Compass,
  Copy,
  Cpu,
  Dna,
  Eye,
  FlaskConical,
  Layers,
  Loader2,
  Megaphone,
  MessageCircle,
  Orbit,
  Paperclip,
  Pencil,
  Pin,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sigma,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import {
  ForumExperienceAttachment,
  ForumExperienceKind,
  ForumFeedPost,
  ForumMessage,
  ForumPostComment,
  ForumPostType,
  ForumSubject
} from '../../types';
import {
  SYNAPSE_ADMIN_EMAIL,
  SYNAPSE_LOGO_AVATAR,
  useAuth
} from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../context/NavigationContext';
import { safeFetchJson } from '../../lib/apiClient';
import { FormattedText, MathFormula } from '../common/MathRenderer';
import { BrandLogo } from '../common/BrandLogo';
import { MonokaiCodeBlock } from '../cs/SublimeEditor';
import { ForumExperiencePickerModal } from './ForumExperiencePickerModal';
import { launchExperienceAttachment } from './forumExperienceCatalog';
import {
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  OperationType,
  orderBy,
  query,
  setDoc,
  updateDoc,
  handleFirestoreError
} from '../../lib/firebase';

interface ForumSocialFeedProps {
  onOpenOfficialAnnouncements: () => void;
  onNotify: (msg: { type: 'error' | 'status'; text: string }) => void;
}

const POST_REACTIONS: Array<{ emoji: '👍' | '❤️' | '🔥' | '💡'; labelVi: string; labelEn: string }> = [
  { emoji: '👍', labelVi: 'Thích', labelEn: 'Like' },
  { emoji: '❤️', labelVi: 'Yêu thích', labelEn: 'Love' },
  { emoji: '🔥', labelVi: 'Hay', labelEn: 'Fire' },
  { emoji: '💡', labelVi: 'Sáng tạo', labelEn: 'Insightful' }
];

const FEED_SUBJECT_OPTIONS: Array<{ id: 'all' | ForumSubject; labelVi: string; labelEn: string }> = [
  { id: 'all', labelVi: 'Tất cả môn', labelEn: 'All Subjects' },
  { id: 'physics', labelVi: 'Vật lí', labelEn: 'Physics' },
  { id: 'chemistry', labelVi: 'Hóa học', labelEn: 'Chemistry' },
  { id: 'biology', labelVi: 'Sinh học', labelEn: 'Biology' },
  { id: 'math', labelVi: 'Toán học', labelEn: 'Math' },
  { id: 'cs', labelVi: 'Tin học', labelEn: 'CS & Code' },
  { id: 'exams', labelVi: 'Luyện đề', labelEn: 'Exams' },
  { id: 'general', labelVi: 'Thảo luận chung', labelEn: 'General' },
  { id: 'announcements', labelVi: 'Cập nhật Web', labelEn: 'Web Updates' }
];

const GRADE_OPTIONS = ['Lớp 6–8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12', 'Chuyên / HSG'];

type PostSegment =
  | { type: 'text'; value: string }
  | { type: 'code'; language: 'cpp' | 'python'; code: string };

function parsePostCodeBlocks(content: string): PostSegment[] {
  const segments: PostSegment[] = [];
  const regex = /```(cpp|c\+\+|python|py)?\s*\n([\s\S]*?)```/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const before = content.slice(lastIndex, match.index).trim();
      if (before) segments.push({ type: 'text', value: before });
    }
    const rawLang = (match[1] || 'cpp').toLowerCase();
    const lang: 'cpp' | 'python' = rawLang === 'python' || rawLang === 'py' ? 'python' : 'cpp';
    segments.push({ type: 'code', language: lang, code: match[2].replace(/\n+$/, '') });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    const tail = content.slice(lastIndex).trim();
    if (tail) segments.push({ type: 'text', value: tail });
  }
  if (segments.length === 0 && content.trim()) {
    segments.push({ type: 'text', value: content });
  }
  return segments;
}

function getAttachmentSubjectIcon(subject: ForumExperienceAttachment['subject']) {
  switch (subject) {
    case 'physics':
      return <Atom className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />;
    case 'chemistry':
      return <FlaskConical className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
    case 'biology':
      return <Dna className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    case 'math':
      return <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />;
    case 'cs':
      return <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />;
    default:
      return <Orbit className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />;
  }
}

function getKindText(kind: ForumExperienceKind, isEn: boolean): string {
  switch (kind) {
    case 'sim2d':
      return isEn ? '2D Interactive Sim' : 'Thí nghiệm 2D';
    case 'sim3d':
      return isEn ? '3D WebGL Model' : 'Mô phỏng 3D';
    case 'sandbox':
      return 'Sandbox Lab';
    case 'pre_lab':
      return 'Synapse Pre 3D';
    default:
      return isEn ? 'Lecture' : 'Bài giảng';
  }
}

function getPostTypeLabel(postType: ForumPostType, isEn: boolean): string {
  switch (postType) {
    case 'experiment':
      return isEn ? 'Experiment Share' : 'Chia sẻ Thí nghiệm';
    case 'lecture':
      return isEn ? 'Lecture Note' : 'Chia sẻ Bài giảng';
    case 'update':
      return isEn ? 'Official Web Update' : 'Thông báo Cập nhật Web';
    default:
      return isEn ? 'Discussion' : 'Thảo luận';
  }
}

function getSubjectName(subject: ForumSubject, isEn: boolean): string {
  const found = FEED_SUBJECT_OPTIONS.find((s) => s.id === subject);
  return found ? (isEn ? found.labelEn : found.labelVi) : subject;
}

export const ForumSocialFeed: React.FC<ForumSocialFeedProps> = ({
  onOpenOfficialAnnouncements,
  onNotify
}) => {
  const { user, openAuthModal } = useAuth();
  const { language } = useLanguage();
  const { navigate, setMath3DMode } = useNavigation();
  const isEn = language === 'en';
  const isAdmin = (user?.email || '').trim().toLowerCase() === SYNAPSE_ADMIN_EMAIL;

  const [posts, setPosts] = useState<ForumFeedPost[]>([]);
  const [officialNotices, setOfficialNotices] = useState<ForumMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | ForumPostType | 'saved'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | ForumSubject>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Composer state
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [postType, setPostType] = useState<ForumPostType>('experiment');
  const [postSubject, setPostSubject] = useState<ForumSubject>('physics');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postGradeTag, setPostGradeTag] = useState('');
  const [postAttachment, setPostAttachment] = useState<ForumExperienceAttachment | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const composerTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Picker modal state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialKind, setPickerInitialKind] = useState<'all' | ForumExperienceKind>('all');

  // Post interactions state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editTitleDraft, setEditTitleDraft] = useState('');
  const [editContentDraft, setEditContentDraft] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const savedStorageKey = useMemo(
    () => `synapse_feed_saved_v1_${user?.uid || 'guest'}`,
    [user?.uid]
  );
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('synapse_feed_saved_v1_guest');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(savedStorageKey);
      setSavedPostIds(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedPostIds([]);
    }
  }, [savedStorageKey]);

  const sortPosts = useCallback((list: ForumFeedPost[]): ForumFeedPost[] => {
    return [...list].sort((a, b) => {
      if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, []);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const res = await safeFetchJson<{
        posts: ForumFeedPost[];
        officialNotices: ForumMessage[];
      }>('/api/forum/posts', { method: 'GET' });
      if (res.ok && Array.isArray(res.data?.posts)) {
        setPosts(sortPosts(res.data.posts));
      }
      if (res.ok && Array.isArray(res.data?.officialNotices)) {
        setOfficialNotices(res.data.officialNotices);
      }
    } finally {
      setLoading(false);
    }
  }, [sortPosts]);

  useEffect(() => {
    void fetchFeed();
  }, [fetchFeed]);

  // Real-time SSE listener for social feed updates + official announcements
  useEffect(() => {
    if (typeof EventSource === 'undefined') return;
    const es = new EventSource('/api/forum/stream');
    es.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.type === 'forum:post_created' && payload.post) {
          setPosts((prev) =>
            sortPosts(prev.some((p) => p.id === payload.post.id) ? prev : [payload.post, ...prev])
          );
        } else if (payload.type === 'forum:post_updated' && payload.post) {
          setPosts((prev) =>
            sortPosts(prev.map((p) => (p.id === payload.post.id ? payload.post : p)))
          );
        } else if (payload.type === 'forum:post_deleted' && payload.postId) {
          setPosts((prev) => prev.filter((p) => p.id !== payload.postId));
        } else if (
          payload.type === 'forum:message_created' &&
          payload.groupId === 'official-announcements' &&
          payload.message
        ) {
          setOfficialNotices((prev) =>
            prev.some((m) => m.id === payload.message.id)
              ? prev
              : [payload.message, ...prev].slice(0, 10)
          );
        }
      } catch {
        // ignore keepalive
      }
    };
    return () => es.close();
  }, [sortPosts]);

  // Optional Firestore mirror listener when signed into Firebase Auth
  useEffect(() => {
    if (!auth.currentUser || !user || auth.currentUser.uid !== user.uid) return;
    const q = query(collection(db, 'forum_posts'), orderBy('createdAt', 'desc'), limit(40));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) return;
        const fsPosts: ForumFeedPost[] = [];
        snap.forEach((d) => {
          const v = d.data() as any;
          if (v && v.content) {
            fsPosts.push({
              id: d.id,
              authorId: v.authorId,
              authorName: v.authorName,
              authorUsername: v.authorUsername,
              authorAvatar: v.authorAvatar,
              authorRole: v.authorRole || 'student',
              postType: v.postType || 'discussion',
              subject: v.subject || 'general',
              title: v.title,
              content: v.content,
              attachment: v.attachment,
              tags: v.tags,
              gradeTag: v.gradeTag,
              reactions: v.reactions || {},
              commentsCount: Number(v.commentsCount || 0),
              tryCount: Number(v.tryCount || 0),
              isPinned: Boolean(v.isPinned),
              createdAt: v.createdAt || new Date().toISOString(),
              updatedAt: v.updatedAt
            });
          }
        });
        if (fsPosts.length > 0) {
          setPosts((prev) => {
            const byId = new Map<string, ForumFeedPost>();
            for (const p of prev) byId.set(p.id, p);
            for (const fp of fsPosts) {
              const existing = byId.get(fp.id);
              byId.set(fp.id, {
                ...fp,
                comments: existing?.comments || []
              });
            }
            return sortPosts(Array.from(byId.values()));
          });
        }
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'forum_posts');
        } catch {
          // Express SSE remains active fallback
        }
      }
    );
    return () => unsub();
  }, [user, sortPosts]);

  const openPicker = (kind: 'all' | ForumExperienceKind) => {
    if (!user) {
      onNotify({
        type: 'error',
        text: isEn ? 'Please sign in to attach and publish a post.' : 'Vui lòng đăng nhập để đính kèm thí nghiệm và đăng bài.'
      });
      openAuthModal('login');
      return;
    }
    setComposerExpanded(true);
    setPickerInitialKind(kind);
    setPickerOpen(true);
  };

  const handleSelectAttachment = (att: ForumExperienceAttachment) => {
    setPostAttachment(att);
    if (att.kind === 'lecture') {
      setPostType((prev) => (prev === 'update' ? prev : 'lecture'));
    } else {
      setPostType((prev) => (prev === 'update' ? prev : 'experiment'));
    }
    if (att.subject !== 'pre') {
      setPostSubject(att.subject);
    }
  };

  const insertComposerSnippet = (snippet: string) => {
    const el = composerTextareaRef.current;
    if (!el) {
      setPostContent((prev) => `${prev}${prev && !prev.endsWith(' ') ? ' ' : ''}${snippet}`);
      return;
    }
    const start = el.selectionStart ?? postContent.length;
    const end = el.selectionEnd ?? postContent.length;
    const nextVal = postContent.slice(0, start) + snippet + postContent.slice(end);
    setPostContent(nextVal);
    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publishing) return;
    if (!user) {
      openAuthModal('login');
      return;
    }

    const cleanContent = postContent.trim();
    if (!cleanContent && !postAttachment) {
      onNotify({
        type: 'error',
        text: isEn
          ? 'Please enter your post content or attach an experiment/lecture.'
          : 'Vui lòng nhập nội dung bài đăng hoặc gắn một thí nghiệm / bài giảng.'
      });
      return;
    }

    const effectiveType: ForumPostType =
      postType === 'update' && !isAdmin ? 'discussion' : postType;
    const effectiveSubject: ForumSubject =
      postSubject === 'announcements' && !isAdmin ? 'general' : postSubject;

    setPublishing(true);
    const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    try {
      const apiRes = await safeFetchJson<{
        success: boolean;
        post?: ForumFeedPost;
        error?: string;
      }>('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId,
          authorId: user.uid,
          authorName: isAdmin ? 'Synapse' : user.displayName,
          authorUsername: isAdmin ? 'Synapse' : user.username,
          authorEmail: user.email,
          authorAvatar: isAdmin ? SYNAPSE_LOGO_AVATAR : user.avatarUrl || '',
          authorRole: isAdmin ? 'admin' : user.role,
          postType: effectiveType,
          subject: effectiveSubject,
          title: postTitle.trim() || undefined,
          content: cleanContent,
          attachment: postAttachment || undefined,
          gradeTag: postGradeTag || undefined
        })
      });

      if (!apiRes.ok || !apiRes.data?.post) {
        onNotify({
          type: 'error',
          text: apiRes.data?.error || (isEn ? 'Could not publish post.' : 'Không thể đăng bài.')
        });
        return;
      }

      const created = apiRes.data.post;
      setPosts((prev) =>
        sortPosts(prev.some((p) => p.id === created.id) ? prev : [created, ...prev])
      );

      // Mirror to Firestore if Firebase session is active
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        try {
          await setDoc(doc(db, 'forum_posts', created.id), {
            authorId: created.authorId,
            authorName: created.authorName,
            ...(created.authorUsername ? { authorUsername: created.authorUsername } : {}),
            ...(created.authorAvatar ? { authorAvatar: created.authorAvatar } : {}),
            authorRole: created.authorRole,
            postType: created.postType,
            subject: created.subject,
            ...(created.title ? { title: created.title } : {}),
            content: created.content,
            ...(created.attachment ? { attachment: created.attachment } : {}),
            ...(created.gradeTag ? { gradeTag: created.gradeTag } : {}),
            reactions: {},
            commentsCount: 0,
            tryCount: 0,
            isPinned: Boolean(created.isPinned),
            createdAt: created.createdAt || nowIso
          });
        } catch {
          // Express SSE already persisted cleanly
        }
      }

      setPostTitle('');
      setPostContent('');
      setPostAttachment(null);
      setPostGradeTag('');
      setShowPreview(false);
      setComposerExpanded(false);
      onNotify({
        type: 'status',
        text: isEn ? 'Your post is live on the feed!' : 'Đã đăng bài lên Bảng tin cộng đồng!'
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleLaunchAttachment = async (post: ForumFeedPost) => {
    if (!post.attachment) return;
    // Track launch count asynchronously
    safeFetchJson<{ success: boolean; post?: ForumFeedPost }>(
      `/api/forum/posts/${encodeURIComponent(post.id)}/try`,
      { method: 'POST' }
    )
      .then((res) => {
        if (res.ok && res.data?.post) {
          setPosts((prev) => prev.map((p) => (p.id === post.id ? res.data!.post! : p)));
        }
      })
      .catch(() => {});

    if (auth.currentUser && user && auth.currentUser.uid === user.uid) {
      updateDoc(doc(db, 'forum_posts', post.id), {
        tryCount: Number(post.tryCount || 0) + 1,
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }

    launchExperienceAttachment(post.attachment, { navigate, setMath3DMode });
  };

  const handleToggleReaction = async (post: ForumFeedPost, emoji: '👍' | '❤️' | '🔥' | '💡') => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const res = await safeFetchJson<{ success: boolean; post?: ForumFeedPost }>(
      `/api/forum/posts/${encodeURIComponent(post.id)}/react`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, emoji })
      }
    );
    if (res.ok && res.data?.post) {
      const updated = res.data.post;
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        updateDoc(doc(db, 'forum_posts', post.id), {
          reactions: updated.reactions,
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
    }
  };

  const handleTogglePin = async (post: ForumFeedPost) => {
    if (!user || !isAdmin) return;
    const res = await safeFetchJson<{ success: boolean; post?: ForumFeedPost; error?: string }>(
      `/api/forum/posts/${encodeURIComponent(post.id)}/pin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, userEmail: user.email })
      }
    );
    if (res.ok && res.data?.post) {
      const updated = res.data.post;
      setPosts((prev) => sortPosts(prev.map((p) => (p.id === post.id ? updated : p))));
      onNotify({
        type: 'status',
        text: updated.isPinned
          ? isEn ? 'Post pinned to top!' : 'Đã ghim bài viết lên đầu Bảng tin!'
          : isEn ? 'Post unpinned.' : 'Đã bỏ ghim bài viết.'
      });
    } else if (res.data?.error) {
      onNotify({ type: 'error', text: res.data.error });
    }
  };

  const handleDeletePost = async (post: ForumFeedPost) => {
    if (!user) return;
    if (post.authorId !== user.uid && !isAdmin) return;
    const res = await safeFetchJson<{ success: boolean; error?: string }>(
      `/api/forum/posts/${encodeURIComponent(post.id)}?userId=${encodeURIComponent(
        user.uid
      )}&userEmail=${encodeURIComponent(user.email)}`,
      { method: 'DELETE' }
    );
    if (!res.ok) {
      onNotify({
        type: 'error',
        text: res.data?.error || (isEn ? 'Could not delete post.' : 'Không thể xóa bài viết.')
      });
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      deleteDoc(doc(db, 'forum_posts', post.id)).catch(() => {});
    }
    onNotify({ type: 'status', text: isEn ? 'Post deleted.' : 'Đã xóa bài viết.' });
  };

  const handleSaveEditPost = async (post: ForumFeedPost) => {
    if (!user || savingEdit) return;
    const clean = editContentDraft.trim();
    if (!clean) return;
    setSavingEdit(true);
    try {
      const res = await safeFetchJson<{ success: boolean; post?: ForumFeedPost; error?: string }>(
        `/api/forum/posts/${encodeURIComponent(post.id)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.uid,
            userEmail: user.email,
            title: editTitleDraft.trim(),
            content: clean
          })
        }
      );
      if (res.ok && res.data?.post) {
        const updated = res.data.post;
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
        setEditingPostId(null);
        if (auth.currentUser && auth.currentUser.uid === user.uid) {
          updateDoc(doc(db, 'forum_posts', post.id), {
            title: updated.title || '',
            content: updated.content,
            updatedAt: new Date().toISOString()
          }).catch(() => {});
        }
        onNotify({ type: 'status', text: isEn ? 'Post updated!' : 'Đã cập nhật bài viết!' });
      } else if (res.data?.error) {
        onNotify({ type: 'error', text: res.data.error });
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleAddComment = async (post: ForumFeedPost) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const draft = (commentDrafts[post.id] || '').trim();
    if (!draft || submittingCommentId === post.id) return;

    setSubmittingCommentId(post.id);
    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      const res = await safeFetchJson<{
        success: boolean;
        comment?: ForumPostComment;
        post?: ForumFeedPost;
        error?: string;
      }>(`/api/forum/posts/${encodeURIComponent(post.id)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: commentId,
          authorId: user.uid,
          authorName: isAdmin ? 'Synapse' : user.displayName,
          authorUsername: isAdmin ? 'Synapse' : user.username,
          authorEmail: user.email,
          authorAvatar: isAdmin ? SYNAPSE_LOGO_AVATAR : user.avatarUrl || '',
          authorRole: isAdmin ? 'admin' : user.role,
          content: draft
        })
      });

      if (res.ok && res.data?.post) {
        const updated = res.data.post;
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
        setCommentDrafts((prev) => ({ ...prev, [post.id]: '' }));
        setExpandedComments((prev) => ({ ...prev, [post.id]: true }));
        if (auth.currentUser && auth.currentUser.uid === user.uid && res.data.comment) {
          const c = res.data.comment;
          setDoc(doc(db, `forum_posts/${post.id}/comments`, c.id), {
            postId: post.id,
            authorId: c.authorId,
            authorName: c.authorName,
            ...(c.authorUsername ? { authorUsername: c.authorUsername } : {}),
            ...(c.authorAvatar ? { authorAvatar: c.authorAvatar } : {}),
            authorRole: c.authorRole,
            content: c.content,
            createdAt: c.createdAt
          }).catch(() => {});
        }
      } else if (res.data?.error) {
        onNotify({ type: 'error', text: res.data.error });
      }
    } finally {
      setSubmittingCommentId(null);
    }
  };

  const handleDeleteComment = async (post: ForumFeedPost, comment: ForumPostComment) => {
    if (!user) return;
    const res = await safeFetchJson<{ success: boolean; post?: ForumFeedPost; error?: string }>(
      `/api/forum/posts/${encodeURIComponent(post.id)}/comments/${encodeURIComponent(
        comment.id
      )}?userId=${encodeURIComponent(user.uid)}&userEmail=${encodeURIComponent(user.email)}`,
      { method: 'DELETE' }
    );
    if (res.ok && res.data?.post) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? res.data!.post! : p)));
      if (auth.currentUser && auth.currentUser.uid === user.uid) {
        deleteDoc(doc(db, `forum_posts/${post.id}/comments`, comment.id)).catch(() => {});
      }
    }
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const next = prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId];
      try {
        localStorage.setItem(savedStorageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyPost = (post: ForumFeedPost) => {
    const text = [post.title, post.content, post.attachment ? `🔗 ${post.attachment.title}` : '']
      .filter(Boolean)
      .join('\n\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedPostId(post.id);
    window.setTimeout(() => setCopiedPostId(null), 1800);
  };

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((p) => {
      if (typeFilter === 'saved' && !savedPostIds.includes(p.id)) return false;
      if (typeFilter !== 'all' && typeFilter !== 'saved' && p.postType !== typeFilter) return false;
      if (subjectFilter !== 'all' && p.subject !== subjectFilter) return false;
      if (!q) return true;
      return (
        (p.title?.toLowerCase().includes(q) ?? false) ||
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        (p.attachment?.title.toLowerCase().includes(q) ?? false) ||
        (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
      );
    });
  }, [posts, typeFilter, subjectFilter, searchQuery, savedPostIds]);

  const webUpdatesFeed = useMemo(() => {
    const updatePosts = posts
      .filter((p) => p.postType === 'update')
      .map((p) => ({
        id: `upd_${p.id}`,
        title: p.title || (isEn ? 'System Update from Admin Synapse' : 'Cập nhật từ Admin Synapse'),
        content: p.content,
        createdAt: p.createdAt,
        sourcePost: p
      }));

    const channelUpdates = officialNotices.map((m) => ({
      id: `msg_${m.id}`,
      title: isEn ? 'Official Channel Notice' : 'Thông báo kênh chính thức',
      content: m.content,
      createdAt: m.createdAt,
      sourcePost: undefined as ForumFeedPost | undefined
    }));

    return [...updatePosts, ...channelUpdates]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [posts, officialNotices, isEn]);

  const featuredExperiments = useMemo(() => {
    return [...posts]
      .filter((p) => Boolean(p.attachment) && p.attachment?.kind !== 'lecture')
      .sort((a, b) => Number(b.tryCount || 0) - Number(a.tryCount || 0))
      .slice(0, 4);
  }, [posts]);

  const feedStats = useMemo(() => {
    const experiments = posts.filter((p) => Boolean(p.attachment)).length;
    const totalLaunches = posts.reduce((sum, p) => sum + Number(p.tryCount || 0), 0);
    return { totalPosts: posts.length, experiments, totalLaunches };
  }, [posts]);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* LEFT / MAIN STREAM (8 cols): Facebook-style Composer + Filter + Feed */}
      <div className="lg:col-span-8 space-y-4">
        {/* 1. Post Composer Box */}
        <section className="rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <BrandLogo sizeClass="w-10 h-10 shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                {(user?.displayName || 'G').slice(0, 1).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  openAuthModal('login');
                  return;
                }
                setComposerExpanded(true);
                window.setTimeout(() => composerTextareaRef.current?.focus({ preventScroll: true }), 40);
              }}
              className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-500 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {user
                ? isEn
                  ? `${isAdmin ? 'Synapse' : user.displayName}, share an experiment, 3D lab or lecture...`
                  : `${isAdmin ? 'Synapse' : user.displayName} ơi, bạn muốn chia sẻ thí nghiệm hay bài giảng nào hôm nay?`
                : isEn
                ? 'Sign in to publish experiments, lectures, or study reflections...'
                : 'Đăng nhập để đăng bài chia sẻ thí nghiệm, bài giảng hoặc mẹo học tập...'}
            </button>
          </div>

          {/* Quick Composer Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/70 dark:border-white/10">
            <button
              type="button"
              onClick={() => openPicker('sim3d')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isEn ? 'Attach 2D/3D Lab' : 'Gắn Thí nghiệm 2D/3D'}</span>
            </button>
            <button
              type="button"
              onClick={() => openPicker('lecture')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isEn ? 'Attach Lecture' : 'Gắn Bài giảng'}</span>
            </button>
            <button
              type="button"
              onClick={() => openPicker('pre_lab')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 dark:hover:bg-violet-900/60 border border-violet-200/80 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-bold cursor-pointer transition-colors"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{isEn ? 'Sandbox / Pre' : 'Sandbox & Pre'}</span>
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setComposerExpanded(true);
                  setPostType('update');
                  setPostSubject('announcements');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300/80 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs font-bold cursor-pointer transition-colors"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>{isEn ? 'Web Update Notice' : 'Thông báo Cập nhật Web'}</span>
              </button>
            )}
          </div>

          {/* Expanded Full Composer Form */}
          {composerExpanded && (
            <form onSubmit={handlePublishPost} className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as ForumPostType)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                >
                  <option value="experiment">{isEn ? 'Experiment / Lab' : 'Chia sẻ Thí nghiệm'}</option>
                  <option value="lecture">{isEn ? 'Lecture / Note' : 'Chia sẻ Bài giảng'}</option>
                  <option value="discussion">{isEn ? 'Study Discussion' : 'Thảo luận học tập'}</option>
                  {isAdmin && (
                    <option value="update">{isEn ? 'Official Web Update' : 'Thông báo Cập nhật Web'}</option>
                  )}
                </select>

                <select
                  value={postSubject}
                  onChange={(e) => setPostSubject(e.target.value as ForumSubject)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                >
                  {FEED_SUBJECT_OPTIONS.filter((s) => s.id !== 'all' && (s.id !== 'announcements' || isAdmin)).map((s) => (
                    <option key={s.id} value={s.id}>
                      {isEn ? s.labelEn : s.labelVi}
                    </option>
                  ))}
                </select>

                <select
                  value={postGradeTag}
                  onChange={(e) => setPostGradeTag(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
                >
                  <option value="">{isEn ? 'Grade (optional)...' : 'Khối lớp (tùy chọn)...'}</option>
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                maxLength={160}
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={
                  isEn
                    ? 'Post title (optional, e.g. Why 20° and 70° hit the same projectile range)...'
                    : 'Tiêu đề bài đăng (tùy chọn, VD: Vì sao góc ném 20° và 70° có cùng tầm xa?)...'
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />

              <textarea
                ref={composerTextareaRef}
                rows={4}
                maxLength={4000}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={
                  isEn
                    ? 'Share observations, formulas ($E=mc^2$), or ```cpp code blocks...'
                    : 'Chia sẻ cảm nhận thí nghiệm, hướng dẫn giải bài (hỗ trợ KaTeX $...$ và ```cpp)...'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y"
              />

              {/* Attached Experiment / Lecture Preview in Composer */}
              {postAttachment && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/35 border border-indigo-200 dark:border-indigo-800/70 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {getAttachmentSubjectIcon(postAttachment.subject)}
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        {getKindText(postAttachment.kind, isEn)}
                        {postAttachment.gradeLabel ? ` · ${postAttachment.gradeLabel}` : ''}
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {postAttachment.title}
                      </div>
                      {postAttachment.subtitle && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                          {postAttachment.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openPicker('all')}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {isEn ? 'Change' : 'Đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostAttachment(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer"
                      title={isEn ? 'Remove attachment' : 'Gỡ đính kèm'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* KaTeX + Code + Preview Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                    <Sigma className="w-3.5 h-3.5 text-indigo-500" />
                    <span>KaTeX:</span>
                  </span>
                  {[
                    { label: 'a/b', code: '$\\frac{a}{b}$' },
                    { label: '√x', code: '$\\sqrt{x}$' },
                    { label: '∫f(x)', code: '$\\int_a^b f(x)\\,dx$' },
                    { label: 'ΔH', code: '$\\Delta H$' }
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => insertComposerSnippet(s.code)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => insertComposerSnippet('\n```cpp\n// Code C++ hoặc Python\n```\n')}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 text-[11px] font-mono font-bold cursor-pointer"
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold cursor-pointer ${
                      showPreview
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isEn ? 'Preview' : 'Xem trước'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setComposerExpanded(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    {isEn ? 'Collapse' : 'Thu gọn'}
                  </button>
                  <button
                    type="submit"
                    disabled={publishing || (!postContent.trim() && !postAttachment)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{isEn ? 'Publish Post' : 'Đăng Bài Ngay'}</span>
                  </button>
                </div>
              </div>

              {showPreview && postContent.trim() && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                  <FormattedText text={postContent} />
                </div>
              )}
            </form>
          )}
        </section>

        {/* 2. Feed Filter & Search Bar */}
        <section className="rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 p-3.5 sm:p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEn
                    ? 'Search feed posts, experiments, authors...'
                    : 'Tìm bài đăng, thí nghiệm 2D/3D, bài giảng hoặc tác giả...'
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as 'all' | ForumSubject)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              {FEED_SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {isEn ? opt.labelEn : opt.labelVi}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: isEn ? 'All Posts' : 'Tất cả bài đăng' },
                { id: 'experiment', label: isEn ? 'Experiments & Labs' : 'Thí nghiệm & Lab' },
                { id: 'lecture', label: isEn ? 'Lectures' : 'Bài giảng' },
                { id: 'update', label: isEn ? 'Web Updates' : 'Cập nhật Web' },
                { id: 'discussion', label: isEn ? 'Discussions' : 'Thảo luận' },
                { id: 'saved', label: isEn ? `Saved (${savedPostIds.length})` : `Đã lưu (${savedPostIds.length})` }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  typeFilter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Feed Posts Stream */}
        {loading ? (
          <div className="py-16 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isEn ? 'Loading community feed...' : 'Đang tải bảng tin cộng đồng...'}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-14 px-6 text-center rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {isEn ? 'No matching posts found.' : 'Chưa có bài đăng nào khớp bộ lọc.'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEn
                ? 'Be the first to share an experiment or lecture with the community!'
                : 'Hãy là người đầu tiên chia sẻ thí nghiệm hoặc bài giảng tâm đắc lên Bảng tin nhé!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isPostAdmin = post.authorRole === 'admin';
              const isSaved = savedPostIds.includes(post.id);
              const canModify = Boolean(user && (user.uid === post.authorId || isAdmin));
              const isEditing = editingPostId === post.id;
              const commentsOpen = Boolean(expandedComments[post.id]) || (post.comments?.length || 0) > 0 && expandedComments[post.id] !== false && (post.comments?.length || 0) <= 2;
              const segments = parsePostCodeBlocks(post.content);

              return (
                <article
                  key={post.id}
                  className="rounded-2xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-3.5"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {isPostAdmin ? (
                        <BrandLogo sizeClass="w-10 h-10 shrink-0" />
                      ) : post.authorAvatar ? (
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {post.authorName.slice(0, 1).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                            {post.authorName}
                          </span>
                          {isPostAdmin && (
                            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          {post.isPinned && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                              <Pin className="w-3 h-3" />
                              <span>{isEn ? 'Pinned' : 'Đã ghim'}</span>
                            </span>
                          )}
                        </div>

                        {/* Unboxed typographic metadata (Zero-Pill) */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className={post.postType === 'update' ? 'font-bold text-amber-600 dark:text-amber-400' : 'font-semibold text-indigo-600 dark:text-indigo-400'}>
                            {getPostTypeLabel(post.postType, isEn)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{getSubjectName(post.subject, isEn)}</span>
                          {post.gradeTag && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{post.gradeTag}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <time className="tabular-nums">{formatTime(post.createdAt)}</time>
                          {post.updatedAt && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{isEn ? 'Edited' : 'Đã sửa'}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Top-right Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleSavePost(post.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={isEn ? 'Save post' : 'Lưu bài viết'}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => void handleTogglePin(post)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            post.isPinned
                              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                              : 'text-slate-400 hover:text-amber-600'
                          }`}
                          title={isEn ? 'Pin post' : 'Ghim bài'}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                      )}

                      {canModify && !isEditing && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPostId(post.id);
                              setEditTitleDraft(post.title || '');
                              setEditContentDraft(post.content);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            title={isEn ? 'Edit post' : 'Chỉnh sửa'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeletePost(post)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                            title={isEn ? 'Delete post' : 'Xóa bài'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body or Inline Edit */}
                  {isEditing ? (
                    <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <input
                        type="text"
                        maxLength={160}
                        value={editTitleDraft}
                        onChange={(e) => setEditTitleDraft(e.target.value)}
                        placeholder={isEn ? 'Title (optional)' : 'Tiêu đề (tùy chọn)'}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                      />
                      <textarea
                        rows={4}
                        maxLength={4000}
                        value={editContentDraft}
                        onChange={(e) => setEditContentDraft(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPostId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          {isEn ? 'Cancel' : 'Hủy'}
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit}
                          onClick={() => void handleSaveEditPost(post)}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {savingEdit ? (isEn ? 'Saving...' : 'Đang lưu...') : (isEn ? 'Save' : 'Lưu thay đổi')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {post.title && (
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                          {post.title}
                        </h3>
                      )}

                      <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {segments.map((seg, idx) =>
                          seg.type === 'code' ? (
                            <MonokaiCodeBlock
                              key={idx}
                              code={seg.code}
                              language={seg.language}
                              title={seg.language === 'python' ? 'Python 3' : 'C++20'}
                            />
                          ) : (
                            <div key={idx} className="whitespace-pre-line">
                              <FormattedText text={seg.value} />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interactive Click-to-Experience Attachment Card */}
                  {post.attachment && (
                    <div className="rounded-2xl bg-slate-50/90 dark:bg-slate-800/65 border border-slate-200/90 dark:border-slate-700/80 p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                            {getAttachmentSubjectIcon(post.attachment.subject)}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex flex-wrap items-center gap-1.5">
                              <span>{getKindText(post.attachment.kind, isEn)}</span>
                              {post.attachment.gradeLabel && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {post.attachment.gradeLabel}
                                  </span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums text-slate-500 dark:text-slate-400">
                                {Number(post.tryCount || 0)}{' '}
                                {isEn ? 'launches' : 'lượt trải nghiệm'}
                              </span>
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                              {post.attachment.title}
                            </div>
                            {post.attachment.subtitle && (
                              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                                {post.attachment.subtitle}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleLaunchAttachment(post)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-xs cursor-pointer shrink-0 whitespace-nowrap transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>
                            {post.attachment.kind === 'lecture'
                              ? isEn
                                ? 'Open Lecture'
                                : 'Mở Bài giảng'
                              : isEn
                              ? 'Launch & Experience'
                              : 'Trải nghiệm ngay'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {post.attachment.formula && (
                        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-200 overflow-x-auto">
                          <MathFormula formula={post.attachment.formula} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer: Reactions + Comments Toggle + Copy */}
                  <div className="pt-2 border-t border-slate-200/75 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {POST_REACTIONS.map((r) => {
                        const list = post.reactions?.[r.emoji] || [];
                        const active = Boolean(user && list.includes(user.uid));
                        return (
                          <button
                            key={r.emoji}
                            type="button"
                            onClick={() => void handleToggleReaction(post, r.emoji)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer tabular-nums ${
                              active
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                                : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                            }`}
                            title={isEn ? r.labelEn : r.labelVi}
                          >
                            <span>{r.emoji}</span>
                            <span>{list.length > 0 ? list.length : isEn ? r.labelEn : r.labelVi}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !commentsOpen
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer tabular-nums"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>
                          {isEn ? 'Comments' : 'Bình luận'} ({post.comments?.length ?? post.commentsCount ?? 0})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyPost(post)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        title={isEn ? 'Copy content' : 'Sao chép nội dung'}
                      >
                        {copiedPostId === post.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inline Comments Thread */}
                  {commentsOpen && (
                    <div className="pt-3 border-t border-slate-200/70 dark:border-white/10 space-y-2.5">
                      {(post.comments || []).map((cmt) => {
                        const canDelComment = Boolean(
                          user &&
                            (user.uid === cmt.authorId || user.uid === post.authorId || isAdmin)
                        );
                        return (
                          <div
                            key={cmt.id}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/70 dark:border-slate-700/60"
                          >
                            {cmt.authorRole === 'admin' ? (
                              <BrandLogo sizeClass="w-7 h-7 shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                                {cmt.authorName.slice(0, 1).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="font-extrabold text-slate-900 dark:text-white">
                                    {cmt.authorName}
                                  </span>
                                  <span aria-hidden="true" className="text-slate-400">·</span>
                                  <time className="text-[11px] text-slate-400 tabular-nums">
                                    {formatTime(cmt.createdAt)}
                                  </time>
                                </div>
                                {canDelComment && (
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteComment(post, cmt)}
                                    className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                                    title={isEn ? 'Delete comment' : 'Xóa bình luận'}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">
                                <FormattedText text={cmt.content} />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          maxLength={2000}
                          value={commentDrafts[post.id] || ''}
                          onChange={(e) =>
                            setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              void handleAddComment(post);
                            }
                          }}
                          placeholder={
                            user
                              ? isEn
                                ? 'Write a comment (supports KaTeX $...$) · Enter to send'
                                : 'Viết bình luận trao đổi (hỗ trợ KaTeX $...$) · Enter để gửi'
                              : isEn
                              ? 'Sign in to comment...'
                              : 'Đăng nhập để viết bình luận...'
                          }
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        />
                        <button
                          type="button"
                          disabled={submittingCommentId === post.id}
                          onClick={() => void handleAddComment(post)}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Reply' : 'Gửi'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT RAIL (4 cols): Web Updates & Announcements + Featured Experiments + Stats */}
      <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
        {/* 1. Web Updates & Announcements Panel */}
        <section className="rounded-2xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-xl border border-amber-300/70 dark:border-amber-500/30 p-4 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <h2 className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                {isEn ? 'Web Updates & Notices' : 'Thông báo Cập nhật Web'}
              </h2>
            </div>
            <button
              type="button"
              onClick={onOpenOfficialAnnouncements}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer shrink-0"
            >
              {isEn ? 'Open Channel →' : 'Kênh Admin →'}
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isEn
              ? 'Official release notes, new 2D/3D labs, and weekly arena schedules from Admin Synapse.'
              : 'Cập nhật tính năng mới, nâng cấp phòng mô phỏng 2D/3D và lịch thi đấu từ Admin Synapse.'}
          </p>

          <div className="space-y-2.5">
            {webUpdatesFeed.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                {isEn ? 'No updates yet.' : 'Chưa có thông báo mới.'}
              </div>
            ) : (
              webUpdatesFeed.map((upd) => (
                <div
                  key={upd.id}
                  className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-amber-800 dark:text-amber-300 font-bold">
                    <span className="truncate">{upd.title}</span>
                    <time className="tabular-nums shrink-0 font-medium text-slate-500 dark:text-slate-400">
                      {formatTime(upd.createdAt)}
                    </time>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-3 leading-snug">
                    {upd.content.replace(/\*\*/g, '')}
                  </p>
                  {upd.sourcePost?.attachment && (
                    <button
                      type="button"
                      onClick={() => void handleLaunchAttachment(upd.sourcePost!)}
                      className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer pt-0.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>
                        {isEn ? 'Try featured lab' : 'Trải nghiệm ngay'} · {upd.sourcePost.attachment.title}
                      </span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setComposerExpanded(true);
                setPostType('update');
                setPostSubject('announcements');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>{isEn ? 'Publish Official Update' : 'Đăng Thông Báo Cập Nhật Web'}</span>
            </button>
          )}
        </section>

        {/* 2. Featured Community Experiments (1-Click Launch) */}
        <section className="rounded-2xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h2 className="font-display text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {isEn ? 'Trending Labs to Experience' : 'Thí nghiệm Nổi bật Tuần này'}
            </h2>
          </div>

          <div className="space-y-2">
            {featuredExperiments.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void handleLaunchAttachment(item)}
                className="w-full text-left p-3 rounded-xl bg-slate-50/85 dark:bg-slate-800/55 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-400 transition-colors cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.attachment && getAttachmentSubjectIcon(item.attachment.subject)}
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {item.attachment?.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 tabular-nums">
                  <span>{item.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {Number(item.tryCount || 0)} {isEn ? 'launches' : 'lượt mở'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Community Feed Pulse */}
        <section className="rounded-2xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 p-4 shadow-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                {feedStats.totalPosts}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Posts' : 'Bài đăng'}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {feedStats.experiments}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Attached Labs' : 'Lab gắn kèm'}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {feedStats.totalLaunches}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Experiences' : 'Trải nghiệm'}
              </div>
            </div>
          </div>
        </section>
      </aside>

      {/* Experience Picker Modal */}
      <ForumExperiencePickerModal
        open={pickerOpen}
        isEn={isEn}
        initialKind={pickerInitialKind}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectAttachment}
      />
    </div>
  );
};
