'use client';

import { RimeConfigPublic } from './schemas';

export interface PublicConfigResponse {
  rime: RimeConfigPublic;
  groq: {
    provider: string;
    model: string;
    status: 'configured' | 'unconfigured';
  };
}

let cachedConfigPromise: Promise<PublicConfigResponse | null> | null = null;
let cachedConfigData: PublicConfigResponse | null = null;

/**
 * Client-side singleton cache for /api/config.
 * Eliminates redundant HTTP round-trips when switching between sidebar,
 * overview, and laboratory views.
 */
export async function getClientConfig(): Promise<PublicConfigResponse | null> {
  if (cachedConfigData) {
    return cachedConfigData;
  }

  if (!cachedConfigPromise) {
    cachedConfigPromise = fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: PublicConfigResponse) => {
        cachedConfigData = data;
        return data;
      })
      .catch((err) => {
        console.error('[Config Client Error]:', err);
        cachedConfigPromise = null; // Allow retry on failure
        return null;
      });
  }

  return cachedConfigPromise;
}

/**
 * Synchronous getter if config has already been loaded in memory.
 */
export function getLoadedClientConfig(): PublicConfigResponse | null {
  return cachedConfigData;
}
