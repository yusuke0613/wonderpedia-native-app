import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Book, MessageCircle, Rocket } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.8;

export default function HomeScreen() {
  const { selectedChild } = useAuth();

  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>こどものプロフィールをえらんでね</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: 'https://images.pexels.com/photos/1139613/pexels-photo-1139613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
        }}
        style={styles.logo}
      />
      
      <Text style={styles.greeting}>
        こんにちは、{selectedChild.name}！
      </Text>
      
      <View style={styles.buttonContainer}>
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/library')}
          >
            <Book size={32} color={Colors.white} />
            <Text style={styles.buttonText}>ほんだな</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.secondary }]}
            onPress={() => router.push('/')}
          >
            <MessageCircle size={32} color={Colors.white} />
            <Text style={styles.buttonText}>わからないことをきく</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.accent }]}
            onPress={() => router.push('/')}
          >
            <Rocket size={32} color={Colors.white} />
            <Text style={styles.buttonText}>じぶんでおはなしをつくる</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 40,
  },
  message: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: BUTTON_WIDTH,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.white,
    marginLeft: 16,
  },
});