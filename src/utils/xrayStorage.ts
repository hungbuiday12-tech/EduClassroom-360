export type XrayLayerSlot = 'top' | 'bottom';

// Procedural SVG data URIs so X-Ray reveal works 100% offline/hermetic with zero 404 image assets
const TOP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <radialGradient id="bgTop" cx="50%" cy="48%" r="68%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="55%" stop-color="#e0f2fe"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </radialGradient>
    <linearGradient id="goldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bgTop)"/>
  <g opacity="0.18" stroke="#0284c7" stroke-width="1">
    <circle cx="600" cy="400" r="140" fill="none"/>
    <circle cx="600" cy="400" r="230" fill="none" stroke-dasharray="8 8"/>
    <circle cx="600" cy="400" r="320" fill="none"/>
    <line x1="180" y1="400" x2="1020" y2="400"/>
    <line x1="600" y1="70" x2="600" y2="730"/>
  </g>
  <g transform="translate(600,400)">
    <path d="M -95,-110 C -95,-190 95,-190 95,-110 C 95,-45 -95,-35 -95,45 C -95,140 105,140 105,45" fill="none" stroke="url(#goldLeaf)" stroke-width="46" stroke-linecap="round"/>
    <circle cx="-46" cy="-145" r="12" fill="#f8fafc"/>
    <circle cx="0" cy="-185" r="8" fill="#0ea5e9"/>
    <circle cx="105" cy="45" r="14" fill="#14b8a6"/>
    <text x="0" y="245" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#1e293b" letter-spacing="6">SYNAPSE STEM · OUTER SHELL</text>
  </g>
</svg>`;

const BOTTOM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <radialGradient id="bgBot" cx="50%" cy="48%" r="72%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#060d1f"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <linearGradient id="silverBeam" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bgBot)"/>
  <g opacity="0.28" stroke="#38bdf8" stroke-width="1">
    <circle cx="600" cy="400" r="140" fill="none"/>
    <circle cx="600" cy="400" r="230" fill="none" stroke-dasharray="6 6"/>
    <circle cx="600" cy="400" r="320" fill="none"/>
    <line x1="180" y1="400" x2="1020" y2="400"/>
    <line x1="600" y1="70" x2="600" y2="730"/>
  </g>
  <g transform="translate(600,400)">
    <path d="M -95,-110 C -95,-190 95,-190 95,-110 C 95,-45 -95,-35 -95,45 C -95,140 105,140 105,45" fill="none" stroke="url(#silverBeam)" stroke-width="46" stroke-linecap="round" stroke-dasharray="14 8"/>
    <path d="M -95,-110 C -95,-190 95,-190 95,-110 C 95,-45 -95,-35 -95,45 C -95,140 105,140 105,45" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <circle cx="-46" cy="-145" r="16" fill="none" stroke="#fbbf24" stroke-width="3"/>
    <circle cx="0" cy="0" r="28" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="9" fill="#fbbf24"/>
    <text x="0" y="245" text-anchor="middle" font-family="monospace" font-size="22" font-weight="700" fill="#7dd3fc" letter-spacing="5">X-RAY INTERNAL BLUEPRINT · CORE</text>
  </g>
</svg>`;

export const DEFAULT_XRAY_TOP_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(TOP_SVG)}`;
export const DEFAULT_XRAY_BOTTOM_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(BOTTOM_SVG)}`;

const DB_NAME = 'synapse_xray_db';
const STORE_NAME = 'xray_layers';

function openDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function loadStoredXrayImages(): Promise<{
  top: string | null;
  bottom: string | null;
}> {
  const db = await openDb();
  if (!db) return { top: null, bottom: null };
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const topReq = store.get('top');
      const botReq = store.get('bottom');
      let top: string | null = null;
      let bottom: string | null = null;
      topReq.onsuccess = () => {
        top = typeof topReq.result === 'string' ? topReq.result : null;
      };
      botReq.onsuccess = () => {
        bottom = typeof botReq.result === 'string' ? botReq.result : null;
      };
      tx.oncomplete = () => {
        db.close();
        resolve({ top, bottom });
      };
      tx.onerror = () => {
        db.close();
        resolve({ top: null, bottom: null });
      };
    } catch {
      db.close();
      resolve({ top: null, bottom: null });
    }
  });
}

export async function saveStoredXrayImage(slot: XrayLayerSlot, dataUrl: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(dataUrl, slot);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

export async function clearStoredXrayImage(slot?: XrayLayerSlot): Promise<void> {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      if (slot) store.delete(slot);
      else store.clear();
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

export async function readAndOptimizeImageFile(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const src = String(reader.result || '');
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/webp', 0.9));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
