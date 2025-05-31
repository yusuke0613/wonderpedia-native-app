import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { Story, useStory } from '@/context/StoryContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

import { StoryCard } from '@/components/StoryCard';
import { EmptyLibrary } from '@/components/EmptyLibrary';
import { StoryViewerModal } from '@/components/StoryViewModal';

const CARD_WIDTH =
  require('react-native').Dimensions.get('window').width * 0.42;

export default function LibraryScreen() {
  const { stories, loadStory, deleteStory } = useStory();
  const { selectedChild } = useAuth();
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // 選択された子供の絵本をフィルタリング
  const filteredStories = selectedChild
    ? stories.filter((story) => story.childId === selectedChild.id)
    : [];

  const handleStoryPress = useCallback((story: Story) => {
    setSelectedStory(story);
    setViewerVisible(true);
  }, []);

  const handleContinueStory = useCallback(
    (story: Story) => {
      loadStory(story.id);
      router.push('/(tabs)/chat');
    },
    [loadStory]
  );

  const handleDeletePress = useCallback(
    (storyId: string) => {
      deleteStory(storyId);
    },
    [deleteStory]
  );

  const closeViewer = useCallback(() => {
    setViewerVisible(false);
    setSelectedStory(null);
  }, []);

  const renderStoryItem = useCallback(
    ({ item, index }: { item: Story; index: number }) => (
      <StoryCard
        story={item}
        index={index}
        onPress={handleStoryPress}
        onContinue={handleContinueStory}
        onDelete={handleDeletePress}
      />
    ),
    [handleStoryPress, handleContinueStory, handleDeletePress]
  );

  if (filteredStories.length === 0) {
    return <EmptyLibrary />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>あなたの絵本</Text>

      <FlatList
        data={filteredStories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(_, index) => ({
          length: 200,
          offset: 200 * Math.floor(index / 2),
          index,
        })}
      />

      <StoryViewerModal
        visible={viewerVisible}
        story={selectedStory}
        onClose={closeViewer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
});
