import { fal } from '@fal-ai/client';

// Configure fal.ai client
fal.config({
  credentials: process.env.FAL_KEY || process.env.NEXT_PUBLIC_FAL_KEY,
});

export async function generateVideo(prompt, onQueueUpdate) {
  try {
    const result = await fal.subscribe('fal-ai/veo3/fast', {
      input: {
        prompt: prompt,
        duration: 'short', // or 'medium', 'long' based on your needs
        aspect_ratio: '16:9',
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update);
        if (onQueueUpdate) {
          onQueueUpdate(update);
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}

// Function to chunk text into smaller pieces
export function chunkText(text, maxChars = 500) {
  if (!text || text.trim() === '') return [];
  
  // Split by paragraphs first
  const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
  
  const chunks = [];
  
  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChars) {
      chunks.push(paragraph.trim());
    } else {
      // Split long paragraphs by sentences
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim() !== '');
      
      let currentChunk = '';
      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (currentChunk.length + trimmedSentence.length + 1 <= maxChars) {
          currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
        } else {
          if (currentChunk) {
            chunks.push(currentChunk + '.');
          }
          currentChunk = trimmedSentence;
        }
      }
      
      if (currentChunk) {
        chunks.push(currentChunk + '.');
      }
    }
  }
  
  return chunks;
}