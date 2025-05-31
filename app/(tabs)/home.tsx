import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.9;

export default function HomeScreen() {
  const { selectedChild } = useAuth();

  if (!selectedChild) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>こどものプロフィールをえらんでね</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.characterButton}>
          <View style={styles.characterIcon}>
            <Text style={styles.owlIcon}>🦉</Text>
          </View>
          <Text style={styles.characterText}>キャラ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.characterButton}>
          <View style={styles.characterIcon}>
            <Text style={styles.owlIcon}>🦉</Text>
          </View>
          <Text style={styles.characterText}>キャラ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>えほんだな</Text>
        </View>

        <View style={styles.createSection}>
          <Text style={styles.createTitle}>えほんをつくる</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/create')}
          >
            <Text style={styles.optionText}>わからないことを</Text>
            <Text style={styles.optionTextBold}>えほんにきく</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.optionText}>おはなしをかんがえて</Text>
            <Text style={styles.optionTextBold}>つくる</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>ポイント</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navText}>みんなのえほん</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  characterButton: {
    alignItems: 'center',
  },
  characterIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4EB6C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  owlIcon: {
    fontSize: 30,
  },
  characterText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  messageContainer: {
    backgroundColor: '#F6E79C',
    width: BUTTON_WIDTH,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  messageText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  createSection: {
    backgroundColor: '#F6D44C',
    width: BUTTON_WIDTH,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  createTitle: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  optionTextBold: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 20,
    color: Colors.text,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: BUTTON_WIDTH,
    marginTop: 20,
  },
  navButton: {
    borderWidth: 1,
    borderColor: '#F6D44C',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
  },
  navText: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    color: Colors.text,
  },
});
