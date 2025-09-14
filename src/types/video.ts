export interface VideoGenerationRequest {
  prompt: string;
  duration?: number; // 5-30 seconds
  aspectRatio?: '16:9' | '9:16' | '1:1';
  style?: 'cinematic' | 'documentary' | 'animation' | 'realistic' | 'artistic';
  quality?: 'standard' | 'high' | 'ultra';
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'error';
  videoUrl?: string;
  thumbnailUrl?: string;
  progress?: number;
  estimatedTime?: number;
  error?: string;
  metadata?: {
    prompt: string;
    duration: number;
    aspectRatio: string;
    style: string;
    quality: string;
    createdAt: string;
    processingTime?: number;
  };
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  aspectRatio: string;
  style: string;
  quality: string;
  createdAt: string;
  processingTime?: number;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt_prefix?: string;
  recommended_duration?: number;
  recommended_aspect_ratio?: '16:9' | '9:16' | '1:1';
}