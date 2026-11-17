import { resolveApiUrl as apiUrl } from '../../lib/apiClient';
import { CustomSpatialModel } from './customModelTypes';

const LOCAL_CUSTOM_MODELS_KEY = 'synapse_custom_spatial_models_v1';

export function loadLocalCustomModels(): CustomSpatialModel[] {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOM_MODELS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalCustomModels(models: CustomSpatialModel[]): void {
  try {
    localStorage.setItem(LOCAL_CUSTOM_MODELS_KEY, JSON.stringify(models.slice(0, 60)));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export async function fetchCustomSpatialModels(): Promise<CustomSpatialModel[]> {
  const local = loadLocalCustomModels();
  try {
    const res = await fetch(apiUrl('/api/spatial/models'));
    if (!res.ok) return local;
    const data = await res.json();
    if (Array.isArray(data?.models)) {
      const serverModels = data.models as CustomSpatialModel[];
      // Merge server + local models keeping unique IDs (server order first)
      const byId = new Map<string, CustomSpatialModel>();
      for (const m of serverModels) byId.set(m.id, m);
      for (const m of local) {
        if (!byId.has(m.id)) byId.set(m.id, m);
      }
      const merged = Array.from(byId.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveLocalCustomModels(merged);
      return merged;
    }
  } catch {
    // Offline or static GitHub Pages host -> return local cache seamlessly
  }
  return local;
}

export async function persistCustomSpatialModel(model: CustomSpatialModel): Promise<CustomSpatialModel> {
  const current = loadLocalCustomModels().filter((m) => m.id !== model.id);
  const nextLocal = [model, ...current];
  saveLocalCustomModels(nextLocal);

  try {
    const res = await fetch(apiUrl('/api/spatial/models'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model })
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.model) return data.model as CustomSpatialModel;
    }
  } catch {
    // Offline fallback already saved to localStorage
  }
  return model;
}

export async function deleteCustomSpatialModel(id: string): Promise<void> {
  const nextLocal = loadLocalCustomModels().filter((m) => m.id !== id);
  saveLocalCustomModels(nextLocal);
  try {
    await fetch(apiUrl(`/api/spatial/models/${encodeURIComponent(id)}`), {
      method: 'DELETE'
    });
  } catch {
    // Offline fallback already updated localStorage
  }
}

export interface GenerateModelRequest {
  ideaText: string;
  imageBase64?: string;
  imageMimeType?: string;
  attachmentText?: string;
  fileName?: string;
  language: 'vi' | 'en';
  scanMode?: 'ai_idea' | 'real_world_camera';
}

export async function requestAIGeneratedSpatialModel(
  payload: GenerateModelRequest
): Promise<CustomSpatialModel> {
  const res = await fetch(apiUrl('/api/spatial/generate-model'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.model) {
    throw new Error(data?.error || 'Không thể tạo mô hình AI lúc này. Vui lòng thử lại.');
  }

  const created = data.model as CustomSpatialModel;
  const current = loadLocalCustomModels().filter((m) => m.id !== created.id);
  saveLocalCustomModels([created, ...current]);
  return created;
}

export async function compressImageFileForAI(
  file: File
): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh đã chọn.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Định dạng ảnh không hợp lệ.'));
      img.onload = () => {
        const maxSide = 960;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxSide || h > maxSide) {
          const ratio = Math.min(maxSide / w, maxSide / h);
          w = Math.max(1, Math.round(w * ratio));
          h = Math.max(1, Math.round(h * ratio));
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Không khởi tạo được bộ nén ảnh.'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1] || '';
        resolve({ base64, mimeType: 'image/jpeg', previewUrl: dataUrl });
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

export async function readAttachmentFileText(file: File): Promise<string> {
  const lower = file.name.toLowerCase();
  if (
    lower.endsWith('.txt') ||
    lower.endsWith('.md') ||
    lower.endsWith('.json') ||
    lower.endsWith('.csv') ||
    lower.endsWith('.py') ||
    lower.endsWith('.cpp')
  ) {
    const txt = await file.text();
    return txt.slice(0, 6000);
  }
  // For binary docs like PDF/DOCX without heavy client parser, extract readable metadata + summary marker
  const buf = await file.arrayBuffer();
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const raw = decoder.decode(buf.slice(0, 48000));
  const printable = raw.replace(/[^\x20-\x7E\u00C0-\u1EF9\n\r]/g, ' ').replace(/\s{2,}/g, ' ').trim();
  return `[Tệp đính kèm: ${file.name} (${Math.round(file.size / 1024)} KB)]\n${printable.slice(0, 3500)}`;
}
