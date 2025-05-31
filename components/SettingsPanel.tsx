import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

import Colors from '@/constants/Colors';

interface SettingsPanelProps {
  autoPlay: boolean;
  readingSpeed: number;
  autoPageTurnSpeed: number;
  onAutoPlayChange: (value: boolean) => void;
  onReadingSpeedChange: (value: number) => void;
  onAutoPageTurnSpeedChange: (value: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  autoPlay,
  readingSpeed,
  autoPageTurnSpeed,
  onAutoPlayChange,
  onReadingSpeedChange,
  onAutoPageTurnSpeedChange,
}) => {
  const handleReadingSpeedChange = (increment: boolean) => {
    const change = increment ? 0.1 : -0.1;
    const newValue = increment
      ? Math.min(1.5, readingSpeed + change)
      : Math.max(0.5, readingSpeed + change);
    onReadingSpeedChange(newValue);
  };

  const handlePageTurnSpeedChange = (increment: boolean) => {
    const change = increment ? 1 : -1;
    const newValue = increment
      ? Math.min(10, autoPageTurnSpeed + change)
      : Math.max(3, autoPageTurnSpeed + change);
    onAutoPageTurnSpeedChange(newValue);
  };

  return (
    <View style={styles.settingsPanel}>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>自動再生</Text>
        <Switch
          value={autoPlay}
          onValueChange={onAutoPlayChange}
          trackColor={{ false: '#ccc', true: Colors.secondary }}
          thumbColor={autoPlay ? Colors.primary : '#f4f3f4'}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>読み上げ速度</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>遅い</Text>
          <View style={styles.customSlider}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleReadingSpeedChange(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((readingSpeed - 0.5) / 1) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleReadingSpeedChange(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderValue}>速い</Text>
        </View>
        <Text style={styles.speedValue}>{readingSpeed.toFixed(1)}x</Text>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>ページめくり間隔</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>短い</Text>
          <View style={styles.customSlider}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handlePageTurnSpeedChange(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View
                style={[
                  styles.sliderFill,
                  { width: `${((autoPageTurnSpeed - 3) / 7) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handlePageTurnSpeedChange(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderValue}>長い</Text>
        </View>
        <Text style={styles.speedValue}>{autoPageTurnSpeed}秒</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsPanel: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  sliderValue: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'center',
  },
  speedValue: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  customSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
