import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  SlideInRight,
  withSpring,
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
import { useStory } from '@/context/StoryContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Mic, Send, VolumeX, Volume2, BookOpen } from 'lucide-react-native';

const MOCK_RESPONSES = [
  "That's a great question! Let's explore that together.",
  "Hmm, I'm not sure. What do you think?",
  "Wow! I didn't know that. Tell me more!",
  "I think we should try going that way. What do you think?",
  "Oh no! We need to be careful here.",
  "Look what I found! Should we take it with us?",
  "I'm feeling a bit scared. Are you brave enough to continue?",
  "This reminds me of a story I once heard. Want me to tell you?",
  "What an amazing discovery! I've never seen anything like this before!",
  "I think we should ask for help. Do you know anyone who could help us?"
];

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
};

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const { currentStory } = useStory();
  const { selectedChild } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (currentStory && messages.length === 0) {
      const initialMessage = {
        id: '1',
        text: `Hi ${selectedChild?.name || 'there'}! I'm ${currentStory.character.name}. What would you like to talk about in our ${currentStory.theme} story?`,
        sender: 'character' as const,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      speakMessage(initialMessage.text);
    }
  }, [currentStory, selectedChild]);

  useEffect(() => {
    if (isGenerating) {
      rotation.value = withSequence(
        withTiming(360, { duration: 1000 }),
        withTiming(720, { duration: 1000 }),
        withTiming(1080, { duration: 1000 }),
      );
      
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          router.replace('/book-viewer');
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const spinningStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
    };
  });

  const handleMiniGameTap = () => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    setScore(prev => prev + 1);
  };

  const handleSend = () => {
    if (message.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    setIsTyping(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
      const responseText = MOCK_RESPONSES[randomIndex];
      
      const characterMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'character',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, characterMessage]);
      setIsTyping(false);
      
      speakMessage(responseText);
    }, 1500);
  };

  const speakMessage = (text: string) => {
    Speech.stop();
    
    if (Platform.OS === 'web') {
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    
    Speech.speak(text, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };
  
  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };
  
  const handleVoiceInput = () => {
    alert('Voice input coming soon!');
  };

  const handleGenerateBook = () => {
    setIsGenerating(true);
    setScore(0);
  };
  
  if (isGenerating) {
    return (
      <View style={styles.generatingContainer}>
        <Animated.View style={[styles.spinningBook, spinningStyle]}>
          <BookOpen size={80} color={Colors.primary} />
        </Animated.View>
        
        <Text style={styles.generatingText}>おはなしをつくっています...</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
        
        <View style={styles.miniGame}>
          <Text style={styles.miniGameText}>
            まっている間に...{'\n'}
            タップしてポイントをゲット！
          </Text>
          <Text style={styles.scoreText}>スコア: {score}</Text>
          <TouchableOpacity 
            style={styles.miniGameButton}
            onPress={handleMiniGameTap}
          >
            <Text style={styles.miniGameButtonText}>タップ！</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: currentStory.character.imageUrl }}
          style={styles.characterAvatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.characterName}>{currentStory.character.name}</Text>
          <Text style={styles.themeText}>{currentStory.theme} • {currentStory.style}</Text>
        </View>
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={isSpeaking ? stopSpeaking : () => speakMessage(messages[messages.length - 1]?.text || '')}
        >
          {isSpeaking ? (
            <VolumeX size={24} color={Colors.text} />
          ) : (
            <Volume2 size={24} color={Colors.text} />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <Animated.View
            key={msg.id}
            entering={msg.sender === 'user' ? FadeInUp.springify() : SlideInRight.springify()}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.characterBubble
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </Animated.View>
        ))}
        
        {isTyping && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.messageBubble, styles.characterBubble]}
          >
            <Text style={styles.typingIndicator}>
              {currentStory.character.name} is typing...
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateBook}
      >
        <BookOpen size={24} color={Colors.white} />
        <Text style={styles.generateButtonText}>おはなしをつくる</Text>
      </TouchableOpacity>
      
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.voiceButton}
          onPress={handleVoiceInput}
        >
          <Mic size={22} color={Colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={`Ask ${currentStory.character.name} something...`}
          placeholderTextColor={Colors.lightGray}
          multiline
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            message.trim() === '' && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={message.trim() === ''}
        >
          <Send size={20} color={message.trim() === '' ? Colors.lightGray : Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  noStoryText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  characterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  characterName: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
  },
  themeText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 12,
    color: Colors.darkGray,
  },
  speakerButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  characterBubble: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: (props, propName, componentName) => {
      if (propName === 'style' && componentName === 'userBubble') {
        return Colors.white;
      }
      return Colors.text;
    },
  },
  typingIndicator: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.darkGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  voiceButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.lightGray,
  },
  generateButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  generateButtonText: {
    fontFamily: 'ComicNeue-Bold',
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  generatingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinningBook: {
    marginBottom: 24,
  },
  generatingText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    width: width * 0.8,
    height: 20,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 40,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontFamily: 'ComicNeue-Bold',
    fontSize: 12,
    color: Colors.white,
    lineHeight: 20,
  },
  miniGame: {
    alignItems: 'center',
  },
  miniGameText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 16,
  },
  miniGameButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  miniGameButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.white,
  },
});