import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import Animated, { 
  FadeIn,
  FadeInRight,
  SlideInRight 
} from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, X, Volume2, VolumeX, Play, Pause } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useStory } from '@/context/StoryContext';
import * as Speech from 'expo-speech';

const { width, height } = Dimensions.get('window');

// Mock story generation based on theme and style
const generateStoryText = (theme: string, style: string, pageNumber: number) => {
  const storyParts = {
    space: [
      "In the vast expanse of the cosmos, a tiny spaceship twinkled like a distant star.",
      "The mysterious planet loomed ahead, its purple atmosphere swirling with unknown gases.",
      "Inside a crater, they discovered glowing crystals that pulsed with strange energy."
    ],
    ocean: [
      "Beneath the azure waves, schools of rainbow fish danced in the sunlight.",
      "A hidden cave revealed ancient treasures covered in shimmering pearls.",
      "The friendly dolphin led them to a magical underwater garden."
    ],
    forest: [
      "Deep in the enchanted forest, the trees whispered ancient secrets.",
      "A clearing revealed a circle of glowing mushrooms and dancing fireflies.",
      "The wise old owl shared stories of the forest's magic."
    ]
  };

  return storyParts[theme]?.[pageNumber] || "Our adventure continues...";
};

export default function BookViewerScreen() {
  const { currentStory } = useStory();
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [generatedPages, setGeneratedPages] = useState([]);

  useEffect(() => {
    if (currentStory) {
      // Generate initial story pages if none exist
      if (!currentStory.pages || currentStory.pages.length === 0) {
        const newPages = Array(3).fill(null).map((_, index) => ({
          id: `page-${index}`,
          content: generateStoryText(currentStory.theme, currentStory.style, index),
          imageUrl: `https://images.pexels.com/photos/${1169754 + index}/pexels-photo-${1169754 + index}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`
        }));
        setGeneratedPages(newPages);
      }
    }
  }, [currentStory]);

  useEffect(() => {
    if (autoPlay && !isReading && currentPage < (currentStory?.pages?.length || generatedPages.length) - 1) {
      const timer = setTimeout(() => {
        handleNextPage();
      }, 5000); // Wait 5 seconds after speech ends before moving to next page
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isReading, currentPage]);

  if (!currentStory) {
    router.replace('/(tabs)');
    return null;
  }

  const pages = currentStory.pages?.length > 0 ? currentStory.pages : generatedPages;
  const currentPageData = pages[currentPage];

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      if (isReading) {
        Speech.stop();
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      if (isReading) {
        Speech.stop();
      }
    }
  };

  const toggleReading = async () => {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
    } else {
      setIsReading(true);
      try {
        await Speech.speak(currentPageData.content, {
          language: 'ja-JP',
          pitch: 1.0,
          rate: 0.8,
          onDone: () => setIsReading(false),
          onError: () => setIsReading(false)
        });
      } catch (error) {
        console.error('Speech error:', error);
        setIsReading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'fade'
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.title}>{currentStory.title}</Text>
        
        <Text style={styles.pageNumber}>
          {currentPage + 1} / {pages.length}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Animated.View 
          entering={FadeInRight.springify()}
          style={styles.pageContainer}
        >
          <Image
            source={{ 
              uri: currentPageData?.imageUrl || 
                'https://images.pexels.com/photos/1139613/pexels-photo-1139613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.pageImage}
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.pageText}>
              {currentPageData?.content || 'Loading story...'}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleReading}
        >
          {isReading ? (
            <VolumeX size={24} color={Colors.primary} />
          ) : (
            <Volume2 size={24} color={Colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? (
            <Pause size={24} color={Colors.primary} />
          ) : (
            <Play size={24} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === 0 && styles.navButtonDisabled
          ]}
          onPress={handlePrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft 
            size={24} 
            color={currentPage === 0 ? Colors.lightGray : Colors.primary} 
          />
          <Text style={[
            styles.navButtonText,
            currentPage === 0 && styles.navButtonTextDisabled
          ]}>
            まえ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentPage === pages.length - 1 && styles.navButtonDisabled
          ]}
          onPress={handleNextPage}
          disabled={currentPage === pages.length - 1}
        >
          <Text style={[
            styles.navButtonText,
            currentPage === pages.length - 1 && styles.navButtonTextDisabled
          ]}>
            つぎ
          </Text>
          <ChevronRight 
            size={24}
            color={currentPage === pages.length - 1 ? Colors.lightGray : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    ...Platform.select({
      web: {
        paddingTop: 20
      }
    })
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16
  },
  pageNumber: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.darkGray,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  pageContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageImage: {
    width: '100%',
    height: height * 0.4,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
  },
  pageText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    lineHeight: 28,
    color: Colors.text,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 30,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  navButtonDisabled: {
    backgroundColor: Colors.lightBackground,
  },
  navButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: Colors.lightGray,
  },
});