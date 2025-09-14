'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { VideoGenerationRequest } from '@/types/video';
import { VideoApiClient } from '@/lib/video-api';

interface VideoGeneratorProps {
  onGenerationStart: (id: string) => void;
  onGenerationComplete: (result: any) => void;
  isGenerating: boolean;
}

const StylePresets = [
  { 
    id: 'cinematic', 
    name: 'Cinematic', 
    description: 'Professional film quality with dramatic lighting',
    emoji: '🎬'
  },
  { 
    id: 'documentary', 
    name: 'Documentary', 
    description: 'Realistic style with natural lighting',
    emoji: '📹'
  },
  { 
    id: 'animation', 
    name: 'Animation', 
    description: 'Smooth animated style with vibrant colors',
    emoji: '🎨'
  },
  { 
    id: 'realistic', 
    name: 'Realistic', 
    description: 'Photorealistic with high detail',
    emoji: '📸'
  },
  { 
    id: 'artistic', 
    name: 'Artistic', 
    description: 'Creative and experimental visual style',
    emoji: '🖼️'
  }
];

export default function VideoGenerator({ onGenerationStart, onGenerationComplete, isGenerating }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([10]);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [style, setStyle] = useState<string>('realistic');
  const [quality, setQuality] = useState<'standard' | 'high' | 'ultra'>('high');


  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: VideoGenerationRequest = {
      prompt: prompt.trim(),
      duration: duration[0],
      aspectRatio,
      style: style as any,
      quality
    };

    try {
      const result = await VideoApiClient.generateVideo(request);
      onGenerationStart(result.id);
      
      // Simulate progress updates
      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          const finalResult = await VideoApiClient.checkGenerationStatus(result.id);
          onGenerationComplete(finalResult);
        }
      }, 2000);

    } catch (error) {
      console.error('Generation failed:', error);
      onGenerationComplete({ 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Generation failed' 
      });
    }
  };

  const selectedPreset = StylePresets.find(p => p.id === style);

  return (
    <div className="space-y-6">
      {/* Main Prompt Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✨ Video Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Describe the video you want to generate</Label>
            <Textarea
              id="prompt"
              placeholder="A beautiful sunset over a calm ocean with gentle waves, cinematic lighting..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="mt-2 resize-none"
            />
            <p className="text-sm text-slate-500 mt-2">
              Be descriptive! Include details about lighting, movement, colors, and mood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Duration</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-slate-600 text-center">
                  {duration[0]} seconds
                </div>
              </div>
            </div>

            <div>
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={(value: any) => setAspectRatio(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">🖥️ Landscape (16:9)</SelectItem>
                  <SelectItem value="9:16">📱 Portrait (9:16)</SelectItem>
                  <SelectItem value="1:1">⬜ Square (1:1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quality</Label>
              <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">📺 Standard</SelectItem>
                  <SelectItem value="high">🎯 High</SelectItem>
                  <SelectItem value="ultra">💎 Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎨 Style Preset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {StylePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setStyle(preset.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  style === preset.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="text-2xl mb-2">{preset.emoji}</div>
                <div className="font-medium mb-1">{preset.name}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
          {selectedPreset && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Selected:</span> {selectedPreset.name} - {selectedPreset.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          size="lg"
          className="px-12 py-6 text-lg font-medium"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Generating Video...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              🚀 Generate Video
            </div>
          )}
        </Button>
      </div>

      {prompt.trim() && (
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Generation Preview:</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Creating a {duration[0]}-second {aspectRatio} video in {selectedPreset?.name.toLowerCase()} style: "{prompt}"
          </p>
        </div>
      )}
    </div>
  );
}