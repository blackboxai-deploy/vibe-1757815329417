'use client';

import React, { useState } from 'react';
import VideoGenerator from '@/components/VideoGenerator';
import VideoPreview from '@/components/VideoPreview';
import ProgressTracker from '@/components/ProgressTracker';
import { VideoGenerationResponse } from '@/types/video';
import { HistoryManager } from '@/lib/video-api';

export default function HomePage() {
  const [currentGeneration, setCurrentGeneration] = useState<VideoGenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerationStart = (id: string) => {
    setIsGenerating(true);
    // Find the generation data (would typically come from the API response)
    // For now we'll create a processing state
    setCurrentGeneration({
      id,
      status: 'processing',
      progress: 0,
      estimatedTime: 45
    });
  };

  const handleGenerationComplete = (result: VideoGenerationResponse) => {
    setCurrentGeneration(result);
    setIsGenerating(false);
    
    // Save to history if successful
    if (result.status === 'completed') {
      HistoryManager.saveGeneration(result);
    }
  };

  const renderContent = () => {
    if (currentGeneration?.status === 'processing') {
      return (
        <ProgressTracker
          generation={currentGeneration}
          onComplete={handleGenerationComplete}
        />
      );
    }

    if (currentGeneration?.status === 'completed' || currentGeneration?.status === 'error') {
      return (
        <div className="space-y-6">
          <VideoPreview generation={currentGeneration} />
          
          {/* Option to generate another */}
          <div className="text-center">
            <button
              onClick={() => {
                setCurrentGeneration(null);
                setIsGenerating(false);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
            >
              ← Generate another video
            </button>
          </div>
        </div>
      );
    }

    return (
      <VideoGenerator
        onGenerationStart={handleGenerationStart}
        onGenerationComplete={handleGenerationComplete}
        isGenerating={isGenerating}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      {!currentGeneration && (
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e147a4f3-053b-4910-8e27-b16af90d5fff.png"
              alt="AI Video Generation Hero Interface"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            Create Stunning Videos with AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into professional videos using cutting-edge AI technology. 
            Simply describe what you want, and watch as our advanced models bring your vision to life 
            in seconds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate videos in under 60 seconds with state-of-the-art optimization
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-semibold mb-2">Multiple Styles</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose from cinematic, documentary, animation, and artistic styles
              </p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
              <div className="text-3xl mb-4">💎</div>
              <h3 className="font-semibold mb-2">Professional Quality</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Export in multiple formats and resolutions up to 4K quality
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {renderContent()}
      </div>

      {/* Recent Generations Preview */}
      {!currentGeneration && (
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Creations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/616bb4ef-edfc-47bc-a693-7e9c85bad474.png"
                  alt="Sample cinematic video"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4f77347f-79c6-478e-a54a-33f996059c45.png"
                  alt="Sample animated video"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                <img 
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f89f68ae-7368-4795-82a4-23917d090cb9.png"
                  alt="Sample documentary video"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="mt-6">
              <a 
                href="/history" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
              >
                View all generations →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}