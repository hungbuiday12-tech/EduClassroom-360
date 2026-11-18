import { CustomGeneratedLesson, CustomMockTestResult } from '../types';

const CUSTOM_LESSONS_KEY = 'synapse_custom_pdf_lessons_v1';
const CUSTOM_MOCK_RESULTS_KEY = 'synapse_custom_mock_results_v1';

export const CUSTOM_LESSONS_UPDATED_EVENT = 'synapse:custom-lessons-updated';

function scopeKey(base: string, uid?: string | null): string {
  return `${base}::${uid && uid.trim() ? uid.trim() : 'guest'}`;
}

export function loadCustomLessons(uid?: string | null): CustomGeneratedLesson[] {
  try {
    const raw = localStorage.getItem(scopeKey(CUSTOM_LESSONS_KEY, uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
    if (uid) {
      const guestRaw = localStorage.getItem(scopeKey(CUSTOM_LESSONS_KEY, null));
      if (guestRaw) {
        const parsed = JSON.parse(guestRaw);
        if (Array.isArray(parsed)) return parsed;
      }
    }
  } catch {}
  return [];
}

export function saveCustomLesson(lesson: CustomGeneratedLesson, uid?: string | null): void {
  try {
    const existing = loadCustomLessons(uid).filter((l) => l.id !== lesson.id);
    const next = [lesson, ...existing].slice(0, 30);
    localStorage.setItem(scopeKey(CUSTOM_LESSONS_KEY, uid), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CUSTOM_LESSONS_UPDATED_EVENT));
  } catch {}
}

export function deleteCustomLesson(id: string, uid?: string | null): void {
  try {
    const next = loadCustomLessons(uid).filter((l) => l.id !== id);
    localStorage.setItem(scopeKey(CUSTOM_LESSONS_KEY, uid), JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(CUSTOM_LESSONS_UPDATED_EVENT));
  } catch {}
}

export function loadCustomMockResults(uid?: string | null): CustomMockTestResult[] {
  try {
    const raw = localStorage.getItem(scopeKey(CUSTOM_MOCK_RESULTS_KEY, uid));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveCustomMockResult(result: CustomMockTestResult, uid?: string | null): void {
  try {
    const existing = loadCustomMockResults(uid);
    localStorage.setItem(
      scopeKey(CUSTOM_MOCK_RESULTS_KEY, uid),
      JSON.stringify([result, ...existing].slice(0, 40))
    );
  } catch {}
}
