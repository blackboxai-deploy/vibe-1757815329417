import { NextRequest, NextResponse } from 'next/server';
import { VideoApiClient } from '@/lib/video-api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    // Check the generation status
    const result = await VideoApiClient.checkGenerationStatus(id);
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Status check API error:', error);
    
    if (error && typeof error === 'object' && 'error' in error) {
      return NextResponse.json(
        { error: error.error, code: (error as any).code },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to check generation status',
        code: 'STATUS_CHECK_FAILED' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}