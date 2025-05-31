import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { Link } from 'expo-router';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width * 0.9;

export default function AskBookScreen() {
  const { selectedChild } = useAuth();
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );

  const handleGoBack = () => {
    router.back();
  };

  if (!selectedChild) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>こどものプロフィールをえらんでね</Text>
      </SafeAreaView>
    );
  }

  // 利用可能な画像テーマの配列
  const imageOptions = [
    {
      id: 1,
      name: 'ふんわり',
      image: require('@/assets/images/create/01.png'),
    },
    {
      id: 2,
      name: 'ポップ',
      image: require('@/assets/images/create/02.png'),
    },
    {
      id: 3,
      name: 'ゆるキャラ',
      image: require('@/assets/images/create/03.png'),
    },
    {
      id: 4,
      name: 'ファンタジー',
      image: require('@/assets/images/create/04.png'),
    },
  ];

  // 利用可能なキャラクターの配列
  const characters = [
    { id: 1, emoji: '🦉', name: 'フクロウ先生' },
    { id: 2, emoji: '🐻', name: 'クマさん' },
    { id: 3, emoji: '🐰', name: 'ウサギさん' },
  ];

  // 選択されたテーマとキャラクターの情報
  const selectedTheme = selectedImageId
    ? imageOptions.find((option) => option.id === selectedImageId)
    : null;
  const selectedChar = selectedCharacter
    ? characters.find((char) => char.id === selectedCharacter)
    : null;

  // パラメータの生成
  const chatParams =
    selectedTheme && selectedChar
      ? {
          themeId: selectedTheme.id,
          themeName: selectedTheme.name,
          charId: selectedChar.id,
          charName: selectedChar.name,
          charEmoji: selectedChar.emoji,
        }
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ChevronLeft size={24} color="#333" />
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerBackground}>
            <Text style={styles.headerText}>わからないことをえほんにきく</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>どんな"え"がいい？</Text>
            <View style={styles.imageOptionsContainer}>
              <View style={styles.imageOptionsRow}>
                {imageOptions.slice(0, 2).map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.imageOption,
                      selectedImageId === option.id &&
                        styles.selectedImageOption,
                    ]}
                    onPress={() => setSelectedImageId(option.id)}
                  >
                    <Image source={option.image} style={styles.optionImage} />
                    <Text style={styles.optionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.imageOptionsRow}>
                {imageOptions.slice(2, 4).map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.imageOption,
                      selectedImageId === option.id &&
                        styles.selectedImageOption,
                    ]}
                    onPress={() => setSelectedImageId(option.id)}
                  >
                    <Image source={option.image} style={styles.optionImage} />
                    <Text style={styles.optionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.characterSection}>
            <Text style={styles.inputLabel}>
              じぶんでかいたキャラをつかう？
            </Text>
            <View style={styles.characterContainer}>
              {characters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterButton,
                    selectedCharacter === character.id &&
                      styles.selectedCharacter,
                  ]}
                  onPress={() => setSelectedCharacter(character.id)}
                >
                  <Text style={styles.characterEmoji}>{character.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <LinearGradient
            colors={['#E0A639', '#FF8976']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.startButton}
          >
            {chatParams ? (
              <Link
                href={{
                  pathname: '/(tabs)/chat',
                  params: chatParams,
                }}
                asChild
              >
                <TouchableOpacity style={styles.startButtonTouchable}>
                  <Text style={styles.startButtonText}>はじめる</Text>
                </TouchableOpacity>
              </Link>
            ) : (
              <TouchableOpacity
                style={styles.startButtonTouchable}
                disabled={true}
              >
                <Text style={[styles.startButtonText, { opacity: 0.5 }]}>
                  はじめる
                </Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7E9',
  },
  message: {
    fontFamily: 'ComicNeue-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  headerBackButtonContainer: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  headerTitleContainer: {
    flex: 1,
    paddingRight: 80,
  },
  headerBackground: {
    backgroundColor: '#F2BE45',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
  },
  headerText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  inputSection: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    backgroundColor: '#4EAFC5',
    color: 'white',
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  imageOptionsContainer: {
    width: '100%',
  },
  imageOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  imageOption: {
    width: '48%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  selectedImageOption: {
    borderWidth: 1,
    borderColor: '#4EAFC5',
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 2,
  },
  optionText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.text,
  },
  characterSection: {
    width: '100%',
    marginBottom: 20,
  },
  characterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-around',
  },
  characterButton: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCharacter: {
    borderWidth: 3,
    borderColor: '#4EAFC5',
  },
  characterEmoji: {
    fontSize: 40,
  },
  startButton: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
  },
  startButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 24,
    color: 'black',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
});
