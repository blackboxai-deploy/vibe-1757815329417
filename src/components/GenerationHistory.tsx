'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HistoryManager } from '@/lib/video-api';
import { GenerationHistory } from '@/types/video';

export default function GenerationHistoryComponent() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<GenerationHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterAndSortHistory();
  }, [history, searchTerm, filterStyle, sortBy]);

  const loadHistory = () => {
    const loadedHistory = HistoryManager.getHistory();
    setHistory(loadedHistory);
  };

  const filterAndSortHistory = () => {
    let filtered = [...history];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Style filter
    if (filterStyle !== 'all') {
      filtered = filtered.filter(item => item.style === filterStyle);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    setFilteredHistory(filtered);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      HistoryManager.deleteGeneration(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all videos? This cannot be undone.')) {
      HistoryManager.clearHistory();
      loadHistory();
    }
  };

  const handleDownload = async (videoUrl: string, id: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video_${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">No videos generated yet</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Create your first AI-generated video to see it here!
          </p>
          <Button onClick={() => window.location.href = '/'}>
            ➕ Generate Your First Video
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Generation History</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {history.length} video{history.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleClearAll}
          className="self-start lg:self-auto"
        >
          🗑️ Clear All
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🔍 Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search prompts</label>
              <Input
                placeholder="Search by prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by style</label>
              <Select value={filterStyle} onValueChange={setFilterStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All styles</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="documentary">Documentary</SelectItem>
                  <SelectItem value="animation">Animation</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="duration">Longest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(searchTerm || filterStyle !== 'all') && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Showing {filteredHistory.length} of {history.length} videos
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStyle('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No videos match your filters</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Video Thumbnail */}
                <div className="aspect-video bg-slate-900 rounded-t-lg overflow-hidden relative">
                  <img
                    src={item.thumbnailUrl || `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9d3dadce-7316-43e4-be2a-cbdb949c2b8f.png 6)}`}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="lg"
                        className="rounded-full bg-white/90 text-black hover:bg-white"
                        onClick={() => window.open(item.videoUrl, '_blank')}
                      >
                        ▶️ Play
                      </Button>
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {item.duration}s
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 mb-3">
                    {item.prompt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>📐 {item.aspectRatio}</span>
                    <span className="capitalize">🎨 {item.style}</span>
                    <span className="capitalize">✨ {item.quality}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(item.videoUrl, item.id)}
                      >
                        📥
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}