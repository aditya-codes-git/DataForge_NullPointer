import { AnalysisResponse, ComparisonResult, RimeConfigPublic } from '../schemas';

export interface PublicConfigResponse {
  rime: RimeConfigPublic;
  groq: {
    provider: string;
    model: string;
    status: 'configured' | 'unconfigured';
  };
}

export interface AnalyzePayload {
  text: string;
  domain?: string;
  language?: string;
  locale?: string;
}

export interface ComparePayload {
  text: string;
  domain?: string;
  locale?: string;
}

export interface VerifyPayload {
  comparisonId: string;
  preference: 'RAW' | 'CONTROLLED' | 'EQUAL' | 'NEITHER';
  notes?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.error?.message || data?.error || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  async getConfig(): Promise<PublicConfigResponse> {
    return this.request<PublicConfigResponse>('/api/config', { method: 'GET' });
  }

  async analyze(payload: AnalyzePayload): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async compare(payload: ComparePayload): Promise<ComparisonResult> {
    return this.request<ComparisonResult>('/api/compare', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async verify(payload: VerifyPayload): Promise<{ success: boolean; evidenceId: string; preference: string }> {
    return this.request<{ success: boolean; evidenceId: string; preference: string }>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async synthesize(text: string): Promise<any> {
    return this.request<any>('/api/synthesize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }
}

export const api = new ApiClient();
