import { useEffect, useRef, useCallback } from 'react';
import { Alert as RNAlert } from 'react-native';
import * as Speech from 'expo-speech';
import { Story } from '@/context/StoryContext';

interface UseAutoPlayProps {
  story: Story | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  autoPlay: boolean;
  readingSpeed: number;
  autoPageTurnSpeed: number;
  speakCurrentPage: () => void;
}

export const useAutoPlay = ({
  story,
  currentPage,
  setCurrentPage,
  isPlaying,
  setIsPlaying,
  autoPlay,
  readingSpeed,
  autoPageTurnSpeed,
  speakCurrentPage,
}: UseAutoPlayProps) => {
  const autoPlayTimerRef = useRef<number | null>(null);

  // コンポーネントのアンマウント時にタイマーとスピーチをクリーンアップ
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      Speech.stop();
    };
  }, []);

  // 自動再生の制御
  useEffect(() => {
    if (!story) return;

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (isPlaying && autoPlay) {
      // 現在のページのテキストを読み上げる
      speakCurrentPage();

      // 読み上げ時間 + 追加の表示時間後に次のページへ
      const pageText = story.pages[currentPage].content || '';
      const textLength = pageText.length;
      // 文字数に基づいて読み上げ時間を計算（日本語の場合、1文字あたり約0.2秒）
      const readingTime = Math.max(3000, (textLength * 200) / readingSpeed);

      // 自動ページめくりのタイマーをセット
      autoPlayTimerRef.current = setTimeout(() => {
        goToNextPage();
      }, readingTime + autoPageTurnSpeed * 1000) as unknown as number;
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [
    isPlaying,
    currentPage,
    autoPlay,
    readingSpeed,
    autoPageTurnSpeed,
    story,
    speakCurrentPage,
  ]);

  const goToNextPage = useCallback(() => {
    if (!story) return;

    const totalPages = story.pages.length;

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (isPlaying) {
      // 最後のページに達したら再生を停止
      setIsPlaying(false);
      RNAlert.alert('お知らせ', '絵本の最後に到達しました');
    }
  }, [currentPage, story, isPlaying, setCurrentPage, setIsPlaying]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  return {
    goToNextPage,
    goToPrevPage,
  };
};
