import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Story } from '@/context/StoryContext';
import Colors from '@/constants/Colors';
import { formatDate } from '@/utils/dateUtils';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
const CARD_WIDTH =
  require('react-native').Dimensions.get('window').width * 0.42;

interface StoryCardProps {
  story: Story;
  index: number;
  onPress: (story: Story) => void;
  onContinue: (story: Story) => void;
  onDelete: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = React.memo(
  ({ story, index, onPress, onContinue, onDelete }) => {
    return (
      <AnimatedTouchableOpacity
        entering={FadeInDown.delay(100 * index).springify()}
        style={styles.storyCard}
        onPress={() => onPress(story)}
        activeOpacity={0.8}
      >
        <View style={styles.storyImageContainer}>
          <Image
            source={
              story.pages.length > 0
                ? story.pages[0].imageUrl
                : { uri: story.character.imageUrl }
            }
            style={styles.storyImage}
            resizeMode="cover"
          />
          <View style={styles.storyCharacterContainer}>
            <Image
              source={{ uri: story.character.imageUrl }}
              style={styles.characterImage}
            />
          </View>
        </View>

        <View style={styles.storyInfo}>
          <View style={styles.storyTitleRow}>
            <Text style={styles.storyTitle} numberOfLines={1}>
              {story.title}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(story.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Trash2 size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.storyTheme} numberOfLines={1}>
            {story.theme} • {story.style}
          </Text>

          <View style={styles.storyMeta}>
            <Clock size={12} color={Colors.darkGray} />
            <Text style={styles.storyDate}>{formatDate(story.createdAt)}</Text>
          </View>

          <View style={styles.pageCount}>
            <Text style={styles.pageCountText}>
              {story.pages.length} ページ
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => onContinue(story)}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>続きを作る</Text>
          </TouchableOpacity>
        </View>
      </AnimatedTouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  storyCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyCharacterContainer: {
    position: 'absolute',
    right: 8,
    bottom: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  characterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  storyInfo: {
    padding: 12,
    paddingTop: 16,
  },
  storyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    color: Colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  storyTheme: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  storyDate: {
    fontSize: 12,
    color: Colors.darkGray,
    marginLeft: 4,
  },
  pageCount: {
    marginTop: 8,
    backgroundColor: Colors.lightBackground,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageCountText: {
    fontSize: 10,
    color: Colors.darkGray,
  },
  continueButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
