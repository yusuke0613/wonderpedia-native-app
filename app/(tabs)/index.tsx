import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOut
} from 'react-native-reanimated';
import { CHARACTERS, Character, STYLES, StoryStyle, THEMES, StoryTheme, useStory } from '@/context/StoryContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { ChevronRight } from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CreateScreen() {
  const { selectedChild } = useAuth();
  const { createStory } = useStory();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('My Adventure');
  const [theme, setTheme] = useState<StoryTheme | null>(null);
  const [style, setStyle] = useState<StoryStyle | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  
  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select a child profile first</Text>
      </View>
    );
  }
  
  const handleCreateStory = () => {
    if (theme && style && character && title) {
      createStory(title, theme, style, character, selectedChild.id);
      router.push('/(tabs)/chat');
    }
  };
  
  const renderThemeItem = ({ item }: { item: StoryTheme }) => (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(100 * Object.keys(THEMES).indexOf(item)).springify()}
      exiting={FadeOut}
      style={[
        styles.themeItem,
        theme === item && styles.selectedItem
      ]}
      onPress={() => setTheme(item)}
    >
      <Image 
        source={{ uri: THEMES[item] }}
        style={styles.themeImage} 
      />
      <Text style={styles.themeLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
    </AnimatedTouchableOpacity>
  );
  
  const renderStyleItem = ({ item }: { item: StoryStyle }) => (
    <AnimatedTouchableOpacity
      entering={FadeInDown.delay(100 * Object.keys(STYLES).indexOf(item)).springify()}
      exiting={FadeOut}
      style={[
        styles.styleItem,
        style === item && styles.selectedItem
      ]}
      onPress={() => setStyle(item)}
    >
      <Text style={styles.styleLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
      <Text style={styles.styleDescription}>{STYLES[item]}</Text>
    </AnimatedTouchableOpacity>
  );
  
  const renderCharacterItem = ({ item }: { item: Character }) => (
    <AnimatedTouchableOpacity
      entering={FadeInRight.delay(100 * CHARACTERS.indexOf(item)).springify()}
      exiting={FadeOut}
      style={[
        styles.characterItem,
        character?.id === item.id && styles.selectedItem
      ]}
      onPress={() => setCharacter(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.characterImage}
      />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text style={styles.characterType}>{item.type}</Text>
        <Text style={styles.characterDescription}>{item.description}</Text>
      </View>
    </AnimatedTouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.stepDot, step === i && styles.activeStepDot]}>
            <Text style={[styles.stepNumber, step === i && styles.activeStepNumber]}>{i}</Text>
          </View>
        ))}
      </View>
      
      {step === 1 && (
        <Animated.View 
          entering={FadeInDown} 
          style={styles.stepContainer}
        >
          <Text style={styles.stepTitle}>Choose a theme</Text>
          <Text style={styles.stepDescription}>
            Where would you like your story to take place?
          </Text>
          
          <FlatList
            data={Object.keys(THEMES) as StoryTheme[]}
            renderItem={renderThemeItem}
            keyExtractor={item => item}
            contentContainerStyle={styles.themesContainer}
          />
          
          {theme && (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => setStep(2)}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <ChevronRight size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
      
      {step === 2 && (
        <Animated.View 
          entering={FadeInDown} 
          style={styles.stepContainer}
        >
          <Text style={styles.stepTitle}>Choose a style</Text>
          <Text style={styles.stepDescription}>
            What kind of story would you like to create?
          </Text>
          
          <FlatList
            data={Object.keys(STYLES) as StoryStyle[]}
            renderItem={renderStyleItem}
            keyExtractor={item => item}
            contentContainerStyle={styles.stylesContainer}
          />
          
          {style && (
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={() => setStep(3)}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <ChevronRight size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
      
      {step === 3 && (
        <Animated.View 
          entering={FadeInDown} 
          style={styles.stepContainer}
        >
          <Text style={styles.stepTitle}>Choose a character</Text>
          <Text style={styles.stepDescription}>
            Who will be the main character in your story?
          </Text>
          
          <FlatList
            data={CHARACTERS}
            renderItem={renderCharacterItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.charactersContainer}
            horizontal={false}
          />
          
          {character && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateStory}
            >
              <Text style={styles.createButtonText}>Start Story</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  message: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepDot: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    color: Colors.darkGray,
    fontFamily: 'ComicNeue-Bold',
  },
  activeStepNumber: {
    color: Colors.white,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'ComicNeue-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'ComicNeue-Regular',
    color: Colors.darkGray,
    marginBottom: 24,
  },
  themesContainer: {
    paddingBottom: 60,
  },
  themeItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  themeImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  themeLabel: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
  },
  stylesContainer: {
    paddingBottom: 60,
  },
  styleItem: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  styleLabel: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  styleDescription: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  charactersContainer: {
    paddingBottom: 80,
  },
  characterItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  characterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    marginBottom: 2,
  },
  characterType: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 4,
  },
  characterDescription: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.darkGray,
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    color: Colors.white,
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    marginRight: 8,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  createButtonText: {
    color: Colors.white,
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
  },
});