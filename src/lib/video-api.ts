import { VideoGenerationRequest, VideoGenerationResponse, ApiError } from '@/types/video';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const VIDEO_MODEL = 'replicate/google/veo-3';

const API_HEADERS = {
  'customerId': 'cus_SwsK0DeAXuf4ZB',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export class VideoApiClient {
  static async generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
    try {
      // Build enhanced prompt with settings
      const enhancedPrompt = this.buildEnhancedPrompt(request);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          model: VIDEO_MODEL,
          messages: [
            {
              role: 'user',
              content: enhancedPrompt
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // For now we'll simulate the response, in production this would parse the actual API response
      // const data = await response.json();
      
      // Generate unique ID for this generation
      const generationId = this.generateId();
      
      return {
        id: generationId,
        status: 'processing',
        progress: 0,
        estimatedTime: this.estimateProcessingTime(request.duration || 10),
        metadata: {
          prompt: request.prompt,
          duration: request.duration || 10,
          aspectRatio: request.aspectRatio || '16:9',
          style: request.style || 'realistic',
          quality: request.quality || 'high',
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Video generation error:', error);
      throw {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'GENERATION_FAILED'
      } as ApiError;
    }
  }

  static async checkGenerationStatus(id: string): Promise<VideoGenerationResponse> {
    // In a real implementation, this would check the actual status
    // For now, we'll simulate the process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          status: 'completed',
          videoUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/47a3adcd-1c21-454b-a122-30eadd21cd91.png 8)}`,
          thumbnailUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/416f579e-a27c-4e0a-b57f-47ae4e196cbe.png 8)}`,
          progress: 100,
          metadata: {
            prompt: 'Sample video generation',
            duration: 10,
            aspectRatio: '16:9',
            style: 'realistic',
            quality: 'high',
            createdAt: new Date().toISOString(),
            processingTime: 45
          }
        });
      }, 2000);
    });
  }

  private static buildEnhancedPrompt(request: VideoGenerationRequest): string {
    let prompt = request.prompt;
    
    // Add style modifiers
    const styleModifiers = {
      'cinematic': 'cinematic lighting, professional film quality, dramatic composition',
      'documentary': 'realistic documentary style, natural lighting, authentic feel',
      'animation': 'smooth animation, vibrant colors, stylized movement',
      'realistic': 'photorealistic, natural lighting, high detail',
      'artistic': 'creative artistic style, unique visual aesthetic, experimental'
    };

    if (request.style && styleModifiers[request.style]) {
      prompt += `. Style: ${styleModifiers[request.style]}`;
    }

    // Add technical specifications
    const aspectRatioText = {
      '16:9': 'widescreen format',
      '9:16': 'vertical portrait format', 
      '1:1': 'square format'
    };

    if (request.aspectRatio && aspectRatioText[request.aspectRatio]) {
      prompt += `. ${aspectRatioText[request.aspectRatio]}`;
    }

    if (request.duration) {
      prompt += `. Duration: ${request.duration} seconds`;
    }

    if (request.quality === 'ultra') {
      prompt += '. Ultra high quality, 4K resolution';
    } else if (request.quality === 'high') {
      prompt += '. High quality, detailed rendering';
    }

    return prompt;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private static estimateProcessingTime(duration: number): number {
    // Estimate processing time based on video duration (roughly 3-5x the video length)
    return Math.max(30, duration * 4);
  }
}

// Utility functions for local storage management
export class HistoryManager {
  private static readonly STORAGE_KEY = 'video_generation_history';

  static saveGeneration(generation: VideoGenerationResponse): void {
    if (generation.status === 'completed' && generation.videoUrl) {
      const history = this.getHistory();
      const historyItem = {
        id: generation.id,
        prompt: generation.metadata?.prompt || '',
        videoUrl: generation.videoUrl,
        thumbnailUrl: generation.thumbnailUrl,
        duration: generation.metadata?.duration || 10,
        aspectRatio: generation.metadata?.aspectRatio || '16:9',
        style: generation.metadata?.style || 'realistic',
        quality: generation.metadata?.quality || 'high',
        createdAt: generation.metadata?.createdAt || new Date().toISOString(),
        processingTime: generation.metadata?.processingTime
      };
      
      const updatedHistory = [historyItem, ...history.filter(item => item.id !== generation.id)];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  }

  static getHistory(): any[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static clearHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  static deleteGeneration(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }
}