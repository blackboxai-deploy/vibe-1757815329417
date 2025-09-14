import { NextRequest, NextResponse } from 'next/server';
import { VideoApiClient } from '@/lib/video-api';
import { VideoGenerationRequest } from '@/types/video';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VideoGenerationRequest;
    
    // Validate required fields
    if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (body.duration && (body.duration < 5 || body.duration > 30)) {
      return NextResponse.json(
        { error: 'Duration must be between 5 and 30 seconds' },
        { status: 400 }
      );
    }

    if (body.aspectRatio && !['16:9', '9:16', '1:1'].includes(body.aspectRatio)) {
      return NextResponse.json(
        { error: 'Invalid aspect ratio. Must be 16:9, 9:16, or 1:1' },
        { status: 400 }
      );
    }

    if (body.style && !['cinematic', 'documentary', 'animation', 'realistic', 'artistic'].includes(body.style)) {
      return NextResponse.json(
        { error: 'Invalid style. Must be one of: cinematic, documentary, animation, realistic, artistic' },
        { status: 400 }
      );
    }

    if (body.quality && !['standard', 'high', 'ultra'].includes(body.quality)) {
      return NextResponse.json(
        { error: 'Invalid quality. Must be standard, high, or ultra' },
        { status: 400 }
      );
    }

    // Generate the video
    const result = await VideoApiClient.generateVideo(body);
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Video generation API error:', error);
    
    if (error && typeof error === 'object' && 'error' in error) {
      return NextResponse.json(
        { error: error.error, code: (error as any).code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error occurred during video generation',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Video Generation API',
      endpoints: {
        'POST /api/generate': 'Generate a new video',
        'GET /api/status/[id]': 'Check generation status'
      }
    },
    { status: 200 }
  );
}