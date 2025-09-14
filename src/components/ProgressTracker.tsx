'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { VideoGenerationResponse } from '@/types/video';

interface ProgressTrackerProps {
  generation: VideoGenerationResponse | null;
  onComplete: (result: VideoGenerationResponse) => void;
}

const PROGRESS_STEPS = [
  { label: 'Initializing generation', emoji: '🚀', threshold: 10 },
  { label: 'Processing prompt', emoji: '📝', threshold: 25 },
  { label: 'Rendering frames', emoji: '🎬', threshold: 50 },
  { label: 'Adding effects', emoji: '✨', threshold: 75 },
  { label: 'Finalizing video', emoji: '🎯', threshold: 90 },
  { label: 'Complete!', emoji: '✅', threshold: 100 }
];

export default function ProgressTracker({ generation, onComplete }: ProgressTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!generation || generation.status !== 'processing') {
      return;
    }

    const startTime = Date.now();
    
    // Simulate realistic progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        
        // Simulate realistic generation curve - slower start, faster middle, slower end
        let increment;
        if (prev < 20) {
          increment = Math.random() * 2 + 1; // 1-3% increments
        } else if (prev < 80) {
          increment = Math.random() * 5 + 2; // 2-7% increments
        } else {
          increment = Math.random() * 2 + 0.5; // 0.5-2.5% increments
        }
        
        return Math.min(prev + increment, 100);
      });
    }, 1000);

    // Timer
    const timeInterval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
    };
  }, [generation]);

  useEffect(() => {
    // Update current step based on progress
    const step = PROGRESS_STEPS.findIndex(s => progress < s.threshold);
    setCurrentStep(step >= 0 ? step : PROGRESS_STEPS.length - 1);
  }, [progress]);

  useEffect(() => {
    // Complete generation when progress reaches 100%
    if (progress >= 100 && generation && generation.status === 'processing') {
      setTimeout(() => {
        onComplete({
          ...generation,
          status: 'completed',
          progress: 100,
          videoUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5958ed84-4765-44f2-8742-adc916ac9a45.png 8)}`,
          thumbnailUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/869e70b0-d75d-4688-84df-7c40a58cc131.png 8)}`,
          metadata: {
            ...generation.metadata!,
            processingTime: timeElapsed
          }
        });
      }, 1000);
    }
  }, [progress, generation, onComplete, timeElapsed]);

  if (!generation || generation.status !== 'processing') {
    return null;
  }

  const estimatedTimeRemaining = generation.estimatedTime ? 
    Math.max(0, generation.estimatedTime - timeElapsed) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎬 Generating Your Video
          </span>
          <span className="text-sm font-normal text-slate-500">
            {timeElapsed}s elapsed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Progress: {Math.round(progress)}%
            </span>
            {estimatedTimeRemaining && (
              <span className="text-sm text-slate-500">
                ~{Math.round(estimatedTimeRemaining)}s remaining
              </span>
            )}
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Current Step */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="text-3xl animate-pulse">
            {PROGRESS_STEPS[currentStep]?.emoji}
          </div>
          <div>
            <div className="font-medium">
              {PROGRESS_STEPS[currentStep]?.label}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Step {currentStep + 1} of {PROGRESS_STEPS.length}
            </div>
          </div>
        </div>

        {/* Progress Steps Visualization */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {PROGRESS_STEPS.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-center transition-all ${
                index <= currentStep
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="text-lg mb-1">{step.emoji}</div>
              <div className="text-xs font-medium leading-tight">{step.label}</div>
            </div>
          ))}
        </div>

        {/* Generation Details */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h4 className="font-medium mb-2">Generation Details:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Duration:</span>{' '}
              <span className="font-medium">{generation.metadata?.duration}s</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Format:</span>{' '}
              <span className="font-medium">{generation.metadata?.aspectRatio}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Style:</span>{' '}
              <span className="font-medium capitalize">{generation.metadata?.style}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Quality:</span>{' '}
              <span className="font-medium capitalize">{generation.metadata?.quality}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="text-slate-600 dark:text-slate-400">Prompt:</span>
            <p className="text-sm italic mt-1 text-slate-700 dark:text-slate-300">
              "{generation.metadata?.prompt}"
            </p>
          </div>
        </div>

        {/* Fun Facts During Generation */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <div className="text-sm">
            <span className="font-medium">💡 Did you know?</span> AI video generation processes millions of parameters 
            to create each frame, analyzing color, motion, lighting, and composition to bring your vision to life!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}