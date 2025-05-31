import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert as RNAlert,
} from 'react-native';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react-native';
import * as Speech from 'expo-speech';

import { Story } from '@/context/StoryContext';
import { StoryViewerHeader } from '@/components/StoryViewerHeader';
import { StoryPageView } from '@/components/StoryPageView';
import { PlayControls } from '@/components/PlayControls';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useSpeechControl } from '@/hooks/useSpeechControl';
import { useAutoPlay } from '@/hooks/useAutoPlay';

interface StoryViewerModalProps {
  visible: boolean;
  story: Story | null;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  visible,
  story,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const {
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
  } = useSpeechControl(story, currentPage);

  const { goToNextPage, goToPrevPage } = useAutoPlay({
    story,
    currentPage,
    setCurrentPage,
    isPlaying,
    setIsPlaying,
    autoPlay,
    readingSpeed,
    autoPageTurnSpeed,
    speakCurrentPage,
  });

  if (!story) return null;

  const totalPages = story.pages.length;

  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      Speech.stop();
    } else {
      setIsPlaying(true);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StoryViewerHeader
          title={story.title}
          currentPage={currentPage}
          totalPages={totalPages}
          onClose={onClose}
        />

        <View style={styles.bookContainer}>
          {story.pages.length > 0 ? (
            <StoryPageView
              page={story.pages[currentPage]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={goToPrevPage}
              onNext={goToNextPage}
            />
          ) : (
            <View style={styles.emptyPageContainer}>
              <Text style={styles.emptyPageText}>
                この絵本にはまだページがありません
              </Text>
            </View>
          )}
        </View>

        <PlayControls
          isPlaying={isPlaying}
          isSpeaking={isSpeaking}
          onPlayPause={togglePlayPause}
          onSpeakToggle={isSpeaking ? stopSpeaking : speakCurrentPage}
          onSettingsToggle={handleSettingsToggle}
        />

        {showSettings && (
          <SettingsPanel
            autoPlay={autoPlay}
            readingSpeed={readingSpeed}
            autoPageTurnSpeed={autoPageTurnSpeed}
            onAutoPlayChange={setAutoPlay}
            onReadingSpeedChange={setReadingSpeed}
            onAutoPageTurnSpeedChange={setAutoPageTurnSpeed}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  bookContainer: {
    flex: 1,
    padding: 12,
    paddingBottom: 8,
  },
  emptyPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyPageText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
