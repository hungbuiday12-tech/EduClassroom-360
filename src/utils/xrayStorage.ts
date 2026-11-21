import defaultXrayRealSquirrel from '../assets/images/xray_squirrel_letter_s_real_1795252660625.jpg';
import defaultXraySilverSquirrel from '../assets/images/xray_squirrel_letter_s_silver_1795252679796.jpg';

export const DEFAULT_XRAY_TOP_IMAGE = defaultXrayRealSquirrel;
export const DEFAULT_XRAY_BOTTOM_IMAGE = defaultXraySilverSquirrel;

const DB_NAME = 'synapse_xray_assets_v1';
const STORE_NAME = 'images';
const LS_FALLBACK_TOP = 'synapse_xray_top_img_v1';
const LS_FALLBACK_BOTTOM = 'synapse_xray_bottom_img_v1';

export type XrayLayerSlot = 'top' | 'bottom';

export interface StoredXrayImages {
  top: string | null;
  bottom: string | null;
}

function openXrayDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
  });
}

export async function loadStoredXrayImages(): Promise<StoredXrayImages> {
  try {
    const db = await openXrayDb();
    return await new Promise<StoredXrayImages>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const topReq = store.get('top');
      const bottomReq = store.get('bottom');
      let topVal: string | null = null;
      let bottomVal: string | null = null;

      topReq.onsuccess = () => {
        topVal = typeof topReq.result === 'string' ? topReq.result : null;
      };
      bottomReq.onsuccess = () => {
        bottomVal = typeof bottomReq.result === 'string' ? bottomReq.result : null;
      };
      tx.oncomplete = () => {
        db.close();
        resolve({ top: topVal, bottom: bottomVal });
      };
      tx.onerror = () => {
        db.close();
        resolve({ top: null, bottom: null });
      };
    });
  } catch {
    try {
      return {
        top: localStorage.getItem(LS_FALLBACK_TOP),
        bottom: localStorage.getItem(LS_FALLBACK_BOTTOM)
      };
    } catch {
      return { top: null, bottom: null };
    }
  }
}

export async function saveStoredXrayImage(slot: XrayLayerSlot, dataUrl: string): Promise<void> {
  try {
    const db = await openXrayDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(dataUrl, slot);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error || new Error('Failed to store X-Ray image'));
      };
    });
  } catch {
    try {
      localStorage.setItem(slot === 'top' ? LS_FALLBACK_TOP : LS_FALLBACK_BOTTOM, dataUrl);
    } catch {
      // Ignore storage quota fallback error; in-memory state still updates immediately
    }
  }
}

export async function clearStoredXrayImage(slot?: XrayLayerSlot): Promise<void> {
  try {
    const db = await openXrayDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      if (slot) {
        store.delete(slot);
      } else {
        store.clear();
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {
    // Ignore IDB failure
  }
  try {
    if (!slot || slot === 'top') localStorage.removeItem(LS_FALLBACK_TOP);
    if (!slot || slot === 'bottom') localStorage.removeItem(LS_FALLBACK_BOTTOM);
  } catch {
    // Ignore localStorage failure
  }
}

export async function readAndOptimizeImageFile(file: File, maxDim = 1600): Promise<string> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP).');
  }

  return await new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const natW = img.naturalWidth || img.width || 1280;
        const natH = img.naturalHeight || img.height || 720;
        const scale = Math.min(1, maxDim / Math.max(natW, natH));
        const targetW = Math.max(1, Math.round(natW * scale));
        const targetH = Math.max(1, Math.round(natH * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Không thể khởi tạo canvas xử lý ảnh.'));
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const preserveAlpha =
          file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/svg+xml';
        const mime = preserveAlpha ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, preserveAlpha ? 0.9 : 0.88);
        URL.revokeObjectURL(objectUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err instanceof Error ? err : new Error('Lỗi xử lý ảnh tải lên.'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể đọc dữ liệu hình ảnh này.'));
    };

    img.src = objectUrl;
  });
}
