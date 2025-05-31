import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Story } from '@/context/StoryContext';

export const useSpeechControl = (story: Story | null, currentPage: number) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.8);
  const [autoPageTurnSpeed, setAutoPageTurnSpeed] = useState(5);

  const speakCurrentPage = useCallback(() => {
    if (!story?.pages[currentPage]) return;

    const pageText = story.pages[currentPage].content || '';
    if (pageText.trim() === '') return;

    Speech.stop();
    setIsSpeaking(true);

    Speech.speak(pageText, {
      language: 'ja-JP',
      rate: readingSpeed,
      onDone: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  }, [story, currentPage, readingSpeed]);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setIsSpeaking(false);
  }, []);

  return {
    isPlaying,
    setIsPlaying,
    isSpeaking,
    autoPlay,
    setAutoPlay,
    readingSpeed,
    setReadingSpeed,
    autoPageTurnSpeed,
    setAutoPageTurnSpeed,
    speakCurrentPage,
    stopSpeaking,
  };
};
