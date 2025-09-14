'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoGenerationResponse } from '@/types/video';

interface VideoPreviewProps {
  generation: VideoGenerationResponse | null;
}

export default function VideoPreview({ generation }: VideoPreviewProps) {
  const [, setIsPlaying] = useState(false);

  const handleDownload = async () => {
    if (!generation?.videoUrl) return;
    
    try {
      const response = await fetch(generation.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_${generation.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async () => {
    if (!generation?.videoUrl) return;
    
    try {
      await navigator.share({
        title: 'AI Generated Video',
        text: `Check out this video I created: ${generation.metadata?.prompt}`,
        url: generation.videoUrl
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(generation.videoUrl);
      alert('Video URL copied to clipboard!');
    }
  };

  if (!generation) return null;

  if (generation.status === 'error') {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
            ❌ Generation Failed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">
            {generation.error || 'An unknown error occurred during video generation.'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (generation.status === 'completed' && generation.videoUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              ✅ Video Generated Successfully
            </span>
            <span className="text-sm font-normal text-slate-500">
              {generation.metadata?.processingTime}s
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Player */}
          <div className="relative group">
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <video
                src={generation.videoUrl}
                poster={generation.thumbnailUrl}
                controls
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Video Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm truncate mb-1">
                {generation.metadata?.prompt}
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span>⏱️ {generation.metadata?.duration}s</span>
                <span>📐 {generation.metadata?.aspectRatio}</span>
                <span>🎨 {generation.metadata?.style}</span>
                <span>✨ {generation.metadata?.quality}</span>
              </div>
            </div>
          </div>

          {/* Generation Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-sm font-medium">Duration</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {generation.metadata?.duration}s
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📐</div>
              <div className="text-sm font-medium">Format</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {generation.metadata?.aspectRatio}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-sm font-medium">Style</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                {generation.metadata?.style}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-sm font-medium">Quality</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                {generation.metadata?.quality}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              📥 Download Video
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              🔗 Share
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              ➕ Generate Another
            </Button>
          </div>

          {/* Prompt Display */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium mb-2">Original Prompt:</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic">
              "{generation.metadata?.prompt}"
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}