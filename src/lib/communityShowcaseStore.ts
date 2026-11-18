import { resolveApiUrl as apiUrl } from './apiClient';
import { CommunityShowcaseItem } from '../types';

const SHOWCASE_CACHE_KEY = 'synapse_showcase_cache_v1';
const SHOWCASE_LIKED_KEY = 'synapse_showcase_liked_ids_v1';

function getLikedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SHOWCASE_LIKED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set();
}

function saveLikedIds(ids: Set<string>) {
  try {
    localStorage.setItem(SHOWCASE_LIKED_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

function loadLocalShowcase(): CommunityShowcaseItem[] {
  try {
    const raw = localStorage.getItem(SHOWCASE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalShowcase(items: CommunityShowcaseItem[]) {
  try {
    localStorage.setItem(SHOWCASE_CACHE_KEY, JSON.stringify(items.slice(0, 80)));
  } catch {}
}

export async function fetchShowcaseItems(): Promise<CommunityShowcaseItem[]> {
  const liked = getLikedIds();
  try {
    const res = await fetch(apiUrl('/api/showcase'));
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.items)) {
        const items = (data.items as CommunityShowcaseItem[]).map((it) => ({
          ...it,
          likedByMe: liked.has(it.id)
        }));
        saveLocalShowcase(items);
        return items;
      }
    }
  } catch {}
  return loadLocalShowcase().map((it) => ({ ...it, likedByMe: liked.has(it.id) }));
}

export async function publishShowcaseItem(
  item: Omit<CommunityShowcaseItem, 'id' | 'likes' | 'createdAt' | 'likedByMe'>
): Promise<CommunityShowcaseItem> {
  const localDraft: CommunityShowcaseItem = {
    ...item,
    id: `sc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    likes: 1,
    likedByMe: true,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch(apiUrl('/api/showcase'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.item) {
        const saved = { ...(data.item as CommunityShowcaseItem), likedByMe: true };
        const liked = getLikedIds();
        liked.add(saved.id);
        saveLikedIds(liked);
        saveLocalShowcase([saved, ...loadLocalShowcase().filter((x) => x.id !== saved.id)]);
        return saved;
      }
    }
  } catch {}

  const liked = getLikedIds();
  liked.add(localDraft.id);
  saveLikedIds(liked);
  saveLocalShowcase([localDraft, ...loadLocalShowcase()]);
  return localDraft;
}

export async function toggleShowcaseLike(id: string): Promise<{ likes: number; likedByMe: boolean }> {
  const liked = getLikedIds();
  const currentlyLiked = liked.has(id);
  const delta = currentlyLiked ? -1 : 1;

  if (currentlyLiked) liked.delete(id);
  else liked.add(id);
  saveLikedIds(liked);

  const cached = loadLocalShowcase();
  let nextLikes = Math.max(0, (cached.find((i) => i.id === id)?.likes || 0) + delta);

  try {
    const res = await fetch(apiUrl(`/api/showcase/${encodeURIComponent(id)}/like`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof data?.likes === 'number') nextLikes = data.likes;
    }
  } catch {}

  saveLocalShowcase(
    cached.map((it) =>
      it.id === id ? { ...it, likes: nextLikes, likedByMe: !currentlyLiked } : it
    )
  );
  return { likes: nextLikes, likedByMe: !currentlyLiked };
}
