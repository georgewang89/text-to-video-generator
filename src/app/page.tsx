'use client';

import { useState } from 'react';
import { chunkText, generateVideo } from '@/lib/fal';

interface VideoChunk {
  id: string;
  text: string;
  status: 'editing' | 'queued' | 'generating' | 'completed' | 'error';
  videoUrl?: string;
  error?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [chunks, setChunks] = useState<VideoChunk[]>([]);

  const handleChunkScript = () => {
    if (!inputText.trim()) return;
    
    const textChunks = chunkText(inputText);
    const videoChunks: VideoChunk[] = textChunks.map((text, index) => ({
      id: `chunk-${index}`,
      text,
      status: 'editing'
    }));
    
    setChunks(videoChunks);
  };

  const updateChunkText = (id: string, newText: string) => {
    setChunks(chunks.map(chunk => 
      chunk.id === id ? { ...chunk, text: newText } : chunk
    ));
  };

  const generateVideoForChunk = async (id: string) => {
    const chunk = chunks.find(c => c.id === id);
    if (!chunk) return;

    // Update status to queued
    setChunks(chunks.map(c => 
      c.id === id ? { ...c, status: 'queued' } : c
    ));

    try {
      const result = await generateVideo(
        chunk.text,
        (update) => {
          console.log('Queue update:', update);
          setChunks(prevChunks => prevChunks.map(c => 
            c.id === id ? { ...c, status: 'generating' } : c
          ));
        }
      );

      if (result.data && result.data.video && result.data.video.url) {
        setChunks(prevChunks => prevChunks.map(c => 
          c.id === id ? { 
            ...c, 
            status: 'completed', 
            videoUrl: result.data.video.url 
          } : c
        ));
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setChunks(prevChunks => prevChunks.map(c => 
        c.id === id ? { 
          ...c, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error'
        } : c
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'editing': return 'bg-gray-100 text-gray-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Text to Video Generator
        </h1>
        
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Enter Your Script</h2>
          <textarea
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your script here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleChunkScript}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!inputText.trim()}
          >
            Chunk Script
          </button>
        </div>

        {/* Chunks Section */}
        {chunks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">2. Edit Chunks & Generate Videos</h2>
            <div className="space-y-4">
              {chunks.map((chunk, index) => (
                <div key={chunk.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Chunk {index + 1}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chunk.status)}`}>
                      {chunk.status === 'editing' && 'Ready to Edit'}
                      {chunk.status === 'queued' && 'Queued'}
                      {chunk.status === 'generating' && 'Generating...'}
                      {chunk.status === 'completed' && 'Completed'}
                      {chunk.status === 'error' && 'Error'}
                    </span>
                  </div>
                  
                  <textarea
                    className="w-full h-20 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                    value={chunk.text}
                    onChange={(e) => updateChunkText(chunk.id, e.target.value)}
                    disabled={chunk.status !== 'editing'}
                  />
                  
                  {chunk.status === 'editing' && (
                    <button
                      onClick={() => generateVideoForChunk(chunk.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={!chunk.text.trim()}
                    >
                      Generate Video
                    </button>
                  )}
                  
                  {chunk.status === 'error' && (
                    <div className="mt-2 text-red-600 text-sm">
                      Error: {chunk.error}
                    </div>
                  )}
                  
                  {chunk.videoUrl && (
                    <div className="mt-4">
                      <video
                        className="w-full max-w-md rounded-lg"
                        controls
                        src={chunk.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Paste your script in the textarea above</li>
            <li>2. Click "Chunk Script" to break it into smaller pieces</li>
            <li>3. Edit each chunk as needed</li>
            <li>4. Click "Generate Video" for each chunk</li>
            <li>5. Watch the progress and view generated videos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}