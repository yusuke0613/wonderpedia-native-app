import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StoryPage } from '../../data/stories/wonder-sky';
import { VoiceControls } from './VoiceControls';
import { useVoiceReader } from '../../hooks/useVoiceReader';
import { useAutoPageTurn } from '../../hooks/useAutoPageTurn';

interface StoryViewerProps {
  pages: StoryPage[];
  title?: string;
  fromMiniGame?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const StoryViewer: React.FC<StoryViewerProps> = ({
  pages,
  title = 'ワンダーの空',
  fromMiniGame = false,
}) => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [autoPageTurn, setAutoPageTurn] = useState(false);

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      if (pageIndex >= 0 && pageIndex < pages.length) {
        setCurrentPage(pageIndex);
        scrollViewRef.current?.scrollTo({ x: pageIndex * screenWidth, animated: true });
      }
    },
    [pages.length]
  );

  const { speak, stop, changeSpeechRate, isSpeaking, speechRate } = useVoiceReader({
    onFinish: () => {
      if (autoPageTurn && currentPage < pages.length - 1) {
        // Auto advance to next page when speech finishes
        handlePageChange(currentPage + 1);
      } else if (currentPage === pages.length - 1) {
        // Stop auto page turn when reaching the last page
        setAutoPageTurn(false);
      }
    },
  });

  const { reset: resetAutoPageTurn } = useAutoPageTurn({
    isEnabled: autoPageTurn && !isSpeaking,
    currentPage,
    totalPages: pages.length,
    onPageChange: handlePageChange,
    delay: 3000, // 3 seconds after speech ends
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenWidth);
    if (pageIndex !== currentPage && pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex);
      // Reset auto page turn timer when manually scrolling
      resetAutoPageTurn();

      // Stop speech when manually changing pages
      if (isSpeaking) {
        stop();
      }
    }
  };

  const handleToggleVoice = () => {
    if (!isSpeaking) {
      // Start speaking current page
      speak(pages[currentPage].text);
    } else {
      // Stop speaking
      stop();
    }
  };

  const handleSpeedChange = (speed: number) => {
    changeSpeechRate(speed);
  };

  const handleAutoPageTurnToggle = () => {
    setAutoPageTurn(!autoPageTurn);
  };

  const handleClose = () => {
    if (fromMiniGame) {
      // ミニゲームから来た場合は絵本生成画面に戻る
      router.push('/');
    } else {
      // その他の場合は前の画面に戻る
      router.back();
    }
  };

  // Auto-start reading on page change if auto mode is on
  useEffect(() => {
    if (autoPageTurn && !isSpeaking && pages[currentPage]) {
      // Small delay before auto-reading
      const timer = setTimeout(() => {
        speak(pages[currentPage].text);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPage, autoPageTurn, pages, speak, isSpeaking]);

  // Stop auto page turn when reaching the last page
  useEffect(() => {
    if (currentPage === pages.length - 1 && autoPageTurn) {
      setAutoPageTurn(false);
    }
  }, [currentPage, pages.length, autoPageTurn]);

  return (
    <View className="bg-primary-400 flex-1">
      {/* Header */}
      <SafeAreaView className="absolute left-0 right-0 top-0 z-20 bg-black/80">
        <View className="px-4 py-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleClose}
              className="rounded-full bg-white/20 p-3"
              activeOpacity={0.7}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <Text
              className="rounded-full bg-white/20 px-4 py-2 text-lg font-bold text-white"
              numberOfLines={1}>
              {title}
            </Text>

            <TouchableOpacity
              onPress={() => setShowControls(!showControls)}
              className={`rounded-full p-3 ${showControls ? 'bg-primary-500' : 'bg-white/20'}`}
              activeOpacity={0.7}>
              <Ionicons
                name={showControls ? 'volume-high' : 'volume-medium'}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Story Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1">
        {pages.map((page) => (
          <View
            key={page.id}
            className="relative"
            style={{ width: screenWidth, height: screenHeight }}>
            {/* Image Container */}
            <View className="flex-1 items-center justify-center p-4 pt-20">
              <Image
                source={page.image}
                style={{
                  width: screenWidth - 32,
                  height: screenHeight * 0.55,
                }}
                resizeMode="contain"
              />
            </View>
            {/* Text Overlay - 位置を調整 */}
            <View className="absolute bottom-32 left-0 right-0 bg-black/80 p-6">
              <Text className="text-center text-lg font-medium leading-7 text-white shadow-lg">
                {page.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Voice Controls - 位置を調整 */}
      {showControls && (
        <View className="absolute bottom-20 left-0 right-0 z-20 px-4">
          <VoiceControls
            isPlaying={isSpeaking}
            speechRate={speechRate}
            autoPageTurn={autoPageTurn}
            onToggleVoice={handleToggleVoice}
            onSpeedChange={handleSpeedChange}
            onAutoPageTurnToggle={handleAutoPageTurnToggle}
          />
        </View>
      )}

      {/* Page Indicators */}
      <View className="absolute bottom-0 left-0 right-0 z-10 pb-8">
        <View className="items-center">
          <View className="flex-row rounded-full bg-black/80 px-4 py-2 shadow-lg">
            {pages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (isSpeaking) stop();
                  handlePageChange(index);
                }}
                className="mx-1 p-1"
                activeOpacity={0.7}>
                <View
                  className={`h-2 w-2 rounded-full ${
                    index === currentPage ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <TouchableOpacity
          onPress={() => {
            if (isSpeaking) stop();
            handlePageChange(currentPage - 1);
          }}
          className="absolute left-4 z-10 rounded-full bg-black/60 p-3 shadow-lg"
          style={{ top: screenHeight / 2 - 25 }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      {currentPage < pages.length - 1 && (
        <TouchableOpacity
          onPress={() => {
            if (isSpeaking) stop();
            handlePageChange(currentPage + 1);
          }}
          className="absolute right-4 z-10 rounded-full bg-black/60 p-3 shadow-lg"
          style={{ top: screenHeight / 2 - 25 }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
