import { useState, useEffect, useCallback } from 'react';
import * as Speech from 'expo-speech';

interface UseVoiceReaderProps {
  onFinish?: () => void;
}

export const useVoiceReader = ({ onFinish }: UseVoiceReaderProps = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const speak = useCallback(
    async (text: string) => {
      try {
        // Stop any ongoing speech
        await Speech.stop();

        setIsSpeaking(true);
        setIsPaused(false);

        await Speech.speak(text, {
          language: 'ja',
          rate: speechRate,
          pitch: 1.0,
          onDone: () => {
            setIsSpeaking(false);
            setIsPaused(false);
            onFinish?.();
          },
          onStopped: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
          onError: () => {
            setIsSpeaking(false);
            setIsPaused(false);
          },
        });
      } catch (error) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      }
    },
    [speechRate, onFinish]
  );

  const pause = useCallback(async () => {
    if (isSpeaking && !isPaused) {
      await Speech.pause();
      setIsPaused(true);
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(async () => {
    if (isSpeaking && isPaused) {
      await Speech.resume();
      setIsPaused(false);
    }
  }, [isSpeaking, isPaused]);

  const stop = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const changeSpeechRate = useCallback(
    (rate: number) => {
      // Clamp rate between 0.5 and 2.0
      const clampedRate = Math.max(0.5, Math.min(2.0, rate));
      setSpeechRate(clampedRate);

      // If currently speaking, restart with new rate
      if (isSpeaking) {
        stop();
      }
    },
    [isSpeaking, stop]
  );

  return {
    speak,
    pause,
    resume,
    stop,
    changeSpeechRate,
    isSpeaking,
    isPaused,
    speechRate,
  };
};
