export interface StoredAnalysisItem {
  id: string;
  text: string;
  term?: string;
  category?: string;
  decision: string;
  voice: string;
  timestamp: string;
  risksCount: number;
}

const STORAGE_KEY = 'saysure_recent_analyses_v1';

export function getStoredAnalyses(): StoredAnalysisItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAnalysisToHistory(item: Omit<StoredAnalysisItem, 'id' | 'timestamp'>): StoredAnalysisItem {
  const newItem: StoredAnalysisItem = {
    ...item,
    id: `an-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredAnalyses();
      // Deduplicate recent matching text
      const filtered = existing.filter((e) => e.text.trim() !== item.text.trim());
      const updated = [newItem, ...filtered].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[History Store Error]:', e);
    }
  }

  return newItem;
}
