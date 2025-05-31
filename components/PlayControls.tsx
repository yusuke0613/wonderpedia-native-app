import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react-native';

import Colors from '@/constants/Colors';

interface PlayControlsProps {
  isPlaying: boolean;
  isSpeaking: boolean;
  onPlayPause: () => void;
  onSpeakToggle: () => void;
  onSettingsToggle: () => void;
}

export const PlayControls: React.FC<PlayControlsProps> = ({
  isPlaying,
  isSpeaking,
  onPlayPause,
  onSpeakToggle,
  onSettingsToggle,
}) => {
  return (
    <View style={styles.playControlsContainer}>
      <TouchableOpacity
        style={styles.playControlButton}
        onPress={onPlayPause}
        activeOpacity={0.7}
      >
        {isPlaying ? (
          <Pause size={24} color={Colors.primary} />
        ) : (
          <Play size={24} color={Colors.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playControlButton}
        onPress={onSpeakToggle}
        activeOpacity={0.7}
      >
        {isSpeaking ? (
          <VolumeX size={24} color={Colors.primary} />
        ) : (
          <Volume2 size={24} color={Colors.primary} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.playControlButton}
        onPress={onSettingsToggle}
        activeOpacity={0.7}
      >
        <Settings size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  playControlButton: {
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
});
