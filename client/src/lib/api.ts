import apiClient from '@/lib/apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  background?: string;
  targetExams?: string[];
  aiProvider?: 'claude' | 'openai';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    background: string;
    targetExams: string[];
    aiProvider: 'claude' | 'openai';
  };
}

export const authAPI = {
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/api/auth/register', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/api/auth/login', payload),

  getMe: () =>
    apiClient.get('/api/auth/me'),

  updateProfile: (data: Partial<RegisterPayload>) =>
    apiClient.put('/api/auth/profile', data),
};

export interface GeneratePayload {
  subject: string;
  topic: string;
  mode: 'study-notes' | 'worksheet' | 'interview-qa' | 'bare-act-summary' | 'case-analysis' | 'comparative-analysis';
  depthLevel?: 'beginner' | 'practitioner' | 'expert' | 'judicial';
  customTopic?: string;
}

export interface GenerateResponse {
  success: boolean;
  data: {
    id: string;
    subject: string;
    topic: string;
    mode: string;
    depthLevel: string;
    content: string;
    metadata: {
      bareActSections?: string[];
      relatedCases?: string[];
      practicalInsights?: string[];
      keywords?: string[];
    };
    createdAt: string;
  };
}

export const contentAPI = {
  generate: (payload: GeneratePayload) =>
    apiClient.post<GenerateResponse>('/api/content/generate', payload),

  getSubjects: () =>
    apiClient.get('/api/materials/subjects'),

  getTopics: (subject: string) =>
    apiClient.get(`/api/materials/subjects/${subject}/topics`),

  getModes: () =>
    apiClient.get('/api/materials/modes'),

  getDepthLevels: () =>
    apiClient.get('/api/materials/depth-levels'),

  getUserMaterials: (subject?: string, mode?: string, skip?: number, limit?: number) =>
    apiClient.get('/api/materials/user-materials', {
      params: { subject, mode, skip, limit },
    }),

  getMaterial: (id: string) =>
    apiClient.get(`/api/materials/${id}`),

  updateMaterial: (id: string, data: { content: string }) =>
    apiClient.put(`/api/materials/${id}`, data),

  deleteMaterial: (id: string) =>
    apiClient.delete(`/api/materials/${id}`),
};
