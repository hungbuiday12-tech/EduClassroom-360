import { useEffect, useState } from 'react';
import { safeFetchJson } from './apiClient';
import { buildLocalVoiceMentorAnswer } from './voiceIntentEngine';
import { stopVietnameseSpeech, speakVietnameseLecture } from './vietnameseSpeech';

export interface LiveWorkspaceContext {
  subject: 'math' | 'physics' | 'cs' | 'spatial_3d' | 'synapse_pre' | 'general';
  title: string;
  summary: string;
  codeSnippet?: string;
  language?: 'cpp' | 'python' | 'text';
  activeLine?: number;
  paramsSummary?: string;
  formula?: string;
  updatedAt: number;
}

let currentWorkspaceCtx: LiveWorkspaceContext = {
  subject: 'general',
  title: 'Synapse STEM Observatory',
  summary: 'Không gian học tập Toán · Vật lí · Tin học · 3D Lab.',
  updatedAt: Date.now()
};

const listeners = new Set<() => void>();

export function setLiveWorkspaceContext(partial: Partial<LiveWorkspaceContext>) {
  currentWorkspaceCtx = {
    ...currentWorkspaceCtx,
    ...partial,
    updatedAt: Date.now()
  };
  listeners.forEach((fn) => fn());
}

export function getLiveWorkspaceContext(): LiveWorkspaceContext {
  return currentWorkspaceCtx;
}

export function useLiveWorkspaceContext(): LiveWorkspaceContext {
  const [ctx, setCtx] = useState<LiveWorkspaceContext>(currentWorkspaceCtx);
  useEffect(() => {
    const sync = () => setCtx({ ...currentWorkspaceCtx });
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return ctx;
}

/**
 * Safely capture active simulation canvas (WebGL / 2D) or optional shared screen video frame
 */
export async function captureWorkspaceSnapshot(displayStream?: MediaStream | null): Promise<{
  imageBase64?: string;
  mimeType: string;
  sourceKind: 'screen_share' | 'canvas' | 'none';
}> {
  if (displayStream) {
    const track = displayStream.getVideoTracks()[0];
    if (track && track.readyState === 'live') {
      try {
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.srcObject = displayStream;
        await video.play();
        const w = Math.min(960, video.videoWidth || 800);
        const h = Math.round((w * (video.videoHeight || 450)) / Math.max(1, video.videoWidth || 800));
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          const dataUrl = c.toDataURL('image/jpeg', 0.68);
          video.pause();
          video.srcObject = null;
          if (dataUrl.includes(',')) {
            return {
              imageBase64: dataUrl.split(',')[1],
              mimeType: 'image/jpeg',
              sourceKind: 'screen_share'
            };
          }
        }
      } catch {
        // fallback to canvas capture
      }
    }
  }

  if (typeof document !== 'undefined') {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    let bestCanvas: HTMLCanvasElement | null = null;
    let bestArea = 0;
    for (const c of canvases) {
      const rect = c.getBoundingClientRect();
      if (rect.width < 160 || rect.height < 120) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      const area = rect.width * rect.height;
      if (area > bestArea) {
        bestArea = area;
        bestCanvas = c;
      }
    }
    if (bestCanvas) {
      try {
        const off = document.createElement('canvas');
        const maxW = 720;
        const scale = Math.min(1, maxW / Math.max(1, bestCanvas.width));
        off.width = Math.max(240, Math.round(bestCanvas.width * scale));
        off.height = Math.max(160, Math.round(bestCanvas.height * scale));
        const ctx = off.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#070b14';
          ctx.fillRect(0, 0, off.width, off.height);
          ctx.drawImage(bestCanvas, 0, 0, off.width, off.height);
          const url = off.toDataURL('image/jpeg', 0.65);
          if (url.includes(',')) {
            return {
              imageBase64: url.split(',')[1],
              mimeType: 'image/jpeg',
              sourceKind: 'canvas'
            };
          }
        }
      } catch {
        // WebGL canvas without preserveDrawingBuffer or cross-origin image
      }
    }
  }

  return { mimeType: 'image/jpeg', sourceKind: 'none' };
}

export function cancelActiveSpeech(): void {
  stopVietnameseSpeech();
}

export function speakCoPilotReply(
  text: string,
  lang: 'vi' | 'en',
  onStart?: () => void,
  onEnd?: () => void
): void {
  speakVietnameseLecture(text.slice(0, 800), {
    lang,
    rate: 1.03,
    onStart,
    onEnd
  });
}

export interface LiveCoPilotResponse {
  spokenAnswer: string;
  visualPinHint?: string;
  formulaLatex?: string;
  highlightLines?: number[];
  nextStepQuestion?: string;
}

export async function requestLiveCoPilotReply(params: {
  question: string;
  subject: string;
  language: 'vi' | 'en';
  workspaceCtx: LiveWorkspaceContext;
  imageBase64?: string;
  mimeType?: string;
}): Promise<LiveCoPilotResponse> {
  const res = await safeFetchJson<{ success?: boolean; data?: LiveCoPilotResponse; error?: string }>(
    '/api/gemini/live-copilot',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        subject: params.subject,
        language: params.language,
        workspaceTitle: params.workspaceCtx.title,
        workspaceSummary: params.workspaceCtx.summary,
        codeSnippet: params.workspaceCtx.codeSnippet,
        codeLanguage: params.workspaceCtx.language,
        paramsSummary: params.workspaceCtx.paramsSummary,
        formula: params.workspaceCtx.formula,
        imageBase64: params.imageBase64,
        mimeType: params.mimeType || 'image/jpeg'
      })
    },
    18000
  );

  if (res.ok && res.data?.data?.spokenAnswer) {
    return res.data.data;
  }

  const localFallback = buildLocalVoiceMentorAnswer({
    question: params.question,
    modelTitle: params.workspaceCtx.title || 'Synapse STEM',
    partDescription: params.workspaceCtx.summary,
    formula: params.workspaceCtx.formula,
    language: params.language
  });
  return {
    spokenAnswer: localFallback.spokenAnswer,
    formulaLatex: localFallback.formulaHighlight || params.workspaceCtx.formula,
    nextStepQuestion: localFallback.suggestedFollowUps?.[0]
  };
}
