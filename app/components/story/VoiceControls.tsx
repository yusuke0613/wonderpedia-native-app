import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceControlsProps {
  isPlaying: boolean;
  speechRate: number;
  autoPageTurn: boolean;
  onToggleVoice: () => void;
  onSpeedChange: (speed: number) => void;
  onAutoPageTurnToggle: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isPlaying,
  speechRate,
  autoPageTurn,
  onToggleVoice,
  onSpeedChange,
  onAutoPageTurnToggle,
}) => {
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5];

  return (
    <View className="rounded-2xl bg-black/90 p-4 shadow-lg">
      {/* Play/Pause Button */}
      <View className="mb-4 items-center">
        <TouchableOpacity
          onPress={onToggleVoice}
          className={`rounded-full p-4 ${isPlaying ? 'bg-secondary-500' : 'bg-primary-500'}`}
          activeOpacity={0.7}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="white" />
        </TouchableOpacity>
        <Text className="mt-2 text-white">{isPlaying ? '停止' : '再生'}</Text>
      </View>

      {/* Speed Control */}
      <View className="mb-4">
        <Text className="mb-2 text-center text-white">再生速度</Text>
        <View className="flex-row justify-center space-x-2">
          {speedOptions.map((speed) => (
            <TouchableOpacity
              key={speed}
              onPress={() => onSpeedChange(speed)}
              className={`rounded-full px-3 py-2 ${
                speechRate === speed ? 'bg-primary-500' : 'bg-white/20'
              }`}
              activeOpacity={0.7}>
              <Text className="text-white">{speed}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Auto Page Turn */}
      <View className="items-center">
        <TouchableOpacity
          onPress={onAutoPageTurnToggle}
          className={`flex-row items-center rounded-full px-4 py-2 ${
            autoPageTurn ? 'bg-primary-500' : 'bg-white/20'
          }`}
          activeOpacity={0.7}>
          <Ionicons
            name={autoPageTurn ? 'play-forward' : 'play-forward-outline'}
            size={20}
            color="white"
          />
          <Text className="ml-2 text-white">自動ページ送り</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
