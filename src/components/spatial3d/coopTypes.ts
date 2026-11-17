import type { HandGestureId } from './handGestureTracker';
import type { CustomSpatialModel } from './customModelTypes';
import type { MaterialFinishId, SpatialModeId } from './SpatialGesture3DLab';

export interface CoopHandSkeleton {
  handIndex: 0 | 1;
  handedness?: string;
  pinching: boolean;
  gesture: HandGestureId;
  landmarks: [number, number, number][]; // 21 quantized [x, y, z] normalized coords
}

export interface CoopSharedModelState {
  modeId: SpatialModeId;
  customModel: CustomSpatialModel | null;
  explodeVal: number;
  scaleVal: number;
  heightVal: number;
  sliceEnabled: boolean;
  sliceY: number;
  finish: MaterialFinishId;
  paletteId: string;
  rotY: number;
  pitchX: number;
  highlightedPartIdx: number | null;
  isolatedPartIdx: number | null;
  detachedOffsets?: Record<string, [number, number, number]>;
}

export interface CoopPeerInfo {
  peerId: string;
  name: string;
  avatar?: string;
  colorHex: string;
  handActive: boolean;
  handCount: number;
  gesture: HandGestureId;
  joinedAt: string;
}

export interface CoopPeerHandPose {
  peerId: string;
  name: string;
  colorHex: string;
  skeletons: CoopHandSkeleton[];
  fingerCount: number;
  gesture: HandGestureId;
  updatedAt: number;
}

export interface CoopRoomSummary {
  roomId: string;
  title: string;
  hostName: string;
  modelId: SpatialModeId;
  modelTitle: string;
  customModelTitle?: string;
  maxMembers: number;
  memberCount: number;
  isPublic: boolean;
  createdAt: string;
}

export interface CoopForumInvitePayload {
  roomId: string;
  title: string;
  modelId: SpatialModeId;
  modelTitle: string;
  hostName: string;
}

const INVITE_TAG_REGEX = /\[\[COOP3D_INVITE\|(\{[^\n]+\})\]\]/;

export function encodeCoopForumInviteContent(
  payload: CoopForumInvitePayload,
  noteText?: string
): string {
  const safePayload: CoopForumInvitePayload = {
    roomId: String(payload.roomId || '').trim().toUpperCase().slice(0, 16),
    title: String(payload.title || 'Phòng 3D Bạn Học').trim().slice(0, 80),
    modelId: payload.modelId,
    modelTitle: String(payload.modelTitle || 'Mô hình 3D').trim().slice(0, 80),
    hostName: String(payload.hostName || 'Bạn học').trim().slice(0, 60)
  };
  const header = `[[COOP3D_INVITE|${JSON.stringify(safePayload)}]]`;
  const cleanNote = (noteText || '').trim();
  const fallbackBody = cleanNote
    ? cleanNote
    : `Mời bạn tham gia Không gian 3D chung "${safePayload.title}" (${safePayload.modelTitle}) · Mã phòng: ${safePayload.roomId}`;
  return `${header}\n${fallbackBody}`.slice(0, 1950);
}

export function parseCoopForumInviteContent(content: string): {
  invite: CoopForumInvitePayload | null;
  displayText: string;
} {
  if (!content) return { invite: null, displayText: '' };
  const match = content.match(INVITE_TAG_REGEX);
  if (!match) return { invite: null, displayText: content };
  try {
    const parsed = JSON.parse(match[1]) as CoopForumInvitePayload;
    if (!parsed || !parsed.roomId) {
      return { invite: null, displayText: content };
    }
    const cleanText = content.replace(INVITE_TAG_REGEX, '').trim();
    return {
      invite: {
        roomId: String(parsed.roomId).trim().toUpperCase().slice(0, 16),
        title: String(parsed.title || 'Phòng 3D Bạn Học').slice(0, 80),
        modelId: parsed.modelId || 'turbofan',
        modelTitle: String(parsed.modelTitle || 'Mô hình 3D').slice(0, 80),
        hostName: String(parsed.hostName || 'Bạn học').slice(0, 60)
      },
      displayText: cleanText
    };
  } catch {
    return { invite: null, displayText: content };
  }
}
