import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Story, useStory } from '@/context/StoryContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Book, Clock, Trash2 } from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;

export default function LibraryScreen() {
  const { stories, loadStory, deleteStory } = useStory();
  const { selectedChild } = useAuth();
  
  // Filter stories for the selected child
  const filteredStories = selectedChild 
    ? stories.filter(story => story.childId === selectedChild.id)
    : [];
  
  if (filteredStories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Book size={80} color={Colors.lightGray} />
        <Text style={styles.emptyText}>No stories yet</Text>
        <Text style={styles.emptySubtext}>
          Create your first story by going to the Create tab
        </Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.navigate('/(tabs)')}
        >
          <Text style={styles.createButtonText}>Create Story</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleStoryPress = (story: Story) => {
    loadStory(story.id);
    router.push('/(tabs)/chat');
  };
  
  const handleDeletePress = (storyId: string) => {
    deleteStory(storyId);
  };
  
  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(100 * index).springify()}
      style={styles.storyCard}
      onPress={() => handleStoryPress(item)}
    >
      <View style={styles.storyImageContainer}>
        <Image
          source={{ uri: item.pages.length > 0 
            ? item.pages[0].imageUrl 
            : item.character.imageUrl }}
          style={styles.storyImage}
        />
        <View style={styles.storyCharacterContainer}>
          <Image
            source={{ uri: item.character.imageUrl }}
            style={styles.characterImage}
          />
        </View>
      </View>
      
      <View style={styles.storyInfo}>
        <View style={styles.storyTitleRow}>
          <Text style={styles.storyTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item.id)}
          >
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.storyTheme}>
          {item.theme} • {item.style}
        </Text>
        
        <View style={styles.storyMeta}>
          <Clock size={12} color={Colors.darkGray} />
          <Text style={styles.storyDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        
        <View style={styles.pageCount}>
          <Text style={styles.pageCountText}>
            {item.pages.length} {item.pages.length === 1 ? 'page' : 'pages'}
          </Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Your Stories</Text>
      
      <FlatList
        data={filteredStories}
        renderItem={renderStoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
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
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
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
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  storyTheme: {
    fontFamily: 'ComicNeue-Regular',
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
    fontFamily: 'ComicNeue-Regular',
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
    fontFamily: 'ComicNeue-Regular',
    fontSize: 10,
    color: Colors.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  createButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.white,
  },
});