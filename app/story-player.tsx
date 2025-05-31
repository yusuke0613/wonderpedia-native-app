import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  Volume2,
  VolumeX,
  ArrowLeft,
  Home,
  Share,
  Edit3,
  Mic,
} from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { useLocalSearchParams, router, Stack } from 'expo-router';
import * as Speech from 'expo-speech';
import { Story, StoryPage, useStory } from '@/context/StoryContext';

const { width, height } = Dimensions.get('window');

export default function StoryPlayerScreen() {
  const params = useLocalSearchParams();
  const { stories, loadStory } = useStory();

  const [story, setStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true); // 自動めくり
  const [readingSpeed, setReadingSpeed] = useState(0.8); // 0.5 - 1.5
  const [volume, setVolume] = useState(0.8); // 0.0 - 1.0
  const [autoPageTurnSpeed, setAutoPageTurnSpeed] = useState(5); // 秒単位 (3-10秒)
  const autoPlayTimerRef = useRef<number | null>(null);

  // 会話から生成された絵本の場合の一時データ
  const [generatedPages, setGeneratedPages] = useState<StoryPage[]>([]);
  const [generatedTitle, setGeneratedTitle] = useState('');

  // URLパラメータから情報を取得
  const storyId = params.storyId as string;
  const fromChat = params.fromChat === 'true';
  const newStory = params.newStory === 'true';
  const themeId = params.themeId as string;
  const themeName = params.themeName as string;
  const charId = params.charId as string;
  const charEmoji = params.charEmoji as string;
  const conversation = params.conversation as string;

  // 絵本データの読み込み
  useEffect(() => {
    if (fromChat && conversation) {
      try {
        // 会話データから絵本を生成
        const parsedConversation = JSON.parse(conversation);
        const title = `${themeName || ''}と${charEmoji || ''}の対話`;
        setGeneratedTitle(title);

        // 会話を絵本のページに変換
        const pages: StoryPage[] = parsedConversation
          .filter((msg: any) => msg.text && msg.text.trim() !== '')
          .map((msg: any, index: number) => ({
            id: `page-${index}`,
            content: msg.text,
            imageUrl:
              msg.sender === 'character'
                ? 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                : 'https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          }));

        setGeneratedPages(pages);

        // 自動再生を開始
        setTimeout(() => {
          setIsPlaying(true);
        }, 500);
      } catch (error) {
        console.error('会話データの解析エラー:', error);
        Alert.alert('エラー', '絵本の生成に失敗しました。');
        router.back();
      }
    } else if (storyId) {
      // 既存の絵本を読み込む
      const loadedStory = loadStory(storyId);
      if (loadedStory) {
        setStory(loadedStory);
      } else {
        Alert.alert('エラー', '絵本が見つかりませんでした。');
        router.back();
      }
    } else {
      Alert.alert('エラー', '絵本情報が不足しています。');
      router.back();
    }
  }, [storyId, fromChat, conversation]);

  // コンポーネントのアンマウント時にタイマーとスピーチをクリーンアップ
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      Speech.stop();
    };
  }, []);

  // 自動再生の制御
  useEffect(() => {
    const currentStoryPages = fromChat ? generatedPages : story?.pages || [];
    if (currentStoryPages.length === 0) return;

    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (isPlaying && autoPlay) {
      // 現在のページのテキストを読み上げる
      speakCurrentPage();

      // 読み上げ時間 + 追加の表示時間後に次のページへ
      const pageText = currentStoryPages[currentPage]?.content || '';
      const textLength = pageText.length;
      // 文字数に基づいて読み上げ時間を計算（日本語の場合、1文字あたり約0.2秒）
      const readingTime = Math.max(3000, (textLength * 200) / readingSpeed);

      // 自動ページめくりのタイマーをセット
      autoPlayTimerRef.current = setTimeout(() => {
        goToNextPage();
      }, readingTime + autoPageTurnSpeed * 1000) as unknown as number;
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [
    isPlaying,
    currentPage,
    autoPlay,
    readingSpeed,
    autoPageTurnSpeed,
    story,
    generatedPages,
  ]);

  const goToNextPage = () => {
    const totalPages = fromChat
      ? generatedPages.length
      : story?.pages.length || 0;

    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (isPlaying) {
      // 最後のページに達したら再生を停止
      setIsPlaying(false);
      Alert.alert('お知らせ', '絵本の最後に到達しました');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // 停止処理
      setIsPlaying(false);
      Speech.stop();
      setIsSpeaking(false);
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    } else {
      // 再生開始
      setIsPlaying(true);
    }
  };

  const speakCurrentPage = () => {
    const currentStoryPages = fromChat ? generatedPages : story?.pages || [];
    if (!currentStoryPages[currentPage]) return;

    const pageText = currentStoryPages[currentPage].content || '';
    if (pageText.trim() === '') return;

    Speech.stop();
    setIsSpeaking(true);

    Speech.speak(pageText, {
      language: 'ja-JP',
      rate: readingSpeed,
      onDone: () => {
        setIsSpeaking(false);
      },
      onError: () => {
        setIsSpeaking(false);
      },
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // スライダー値を変更するヘルパー関数
  const handleReadingSpeedChange = (value: number) => {
    setReadingSpeed(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handleBackPress = () => {
    // 音声停止
    Speech.stop();

    // ホーム画面に戻る
    router.push('/(tabs)/home');
  };

  const handleSharePress = () => {
    Alert.alert('共有', '絵本を共有する機能は準備中です。');
  };

  // 表示するページデータを取得
  const currentStoryPages = fromChat ? generatedPages : story?.pages || [];
  const totalPages = currentStoryPages.length;
  const currentTitle = fromChat ? generatedTitle : story?.title || '';

  // ページナビゲーション用のグリッドを生成
  const generatePageGrid = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    if (isPlaying) {
      speakCurrentPage();
    }
  };

  // ページがない場合のローディング表示
  if (totalPages === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: '絵本を読む',
            headerLeft: () => (
              <TouchableOpacity
                onPress={handleBackPress}
                style={styles.headerBackButton}
              >
                <Home size={24} color="#333" />
                <Text style={styles.headerBackText}>ホームへ</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>絵本を準備しています...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: currentTitle,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.headerBackButton}
            >
              <Home size={24} color="#333" />
              <Text style={styles.headerBackText}>ホームへ</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 上部トグルボタン */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={[styles.toggleButton, autoPlay && styles.toggleButtonActive]}
          onPress={() => setAutoPlay(true)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              autoPlay && styles.toggleButtonTextActive,
            ]}
          >
            しどうでめくる
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !autoPlay && styles.toggleButtonActive]}
          onPress={() => setAutoPlay(false)}
        >
          <Text
            style={[
              styles.toggleButtonText,
              !autoPlay && styles.toggleButtonTextActive,
            ]}
          >
            じぶんでめくる
          </Text>
        </TouchableOpacity>
      </View>

      {/* 中央の再生エリア */}
      <View style={styles.centerPlayArea}>
        {isSpeaking ? (
          <View style={styles.speakingIndicator}>
            <View style={styles.waveContainer}>
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <View key={item} style={styles.waveBar} />
              ))}
            </View>
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.centerControlButton}>
                <Edit3 size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.centerControlButton}>
                <Mic size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.playButtonLarge}
            onPress={togglePlayPause}
          >
            {isPlaying ? (
              <Pause size={60} color="#FFF" />
            ) : (
              <Play size={60} color="#FFF" style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* 下部スライダーコントロール */}
      <View style={styles.sliderControls}>
        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>おとのおおきさ</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleVolumeChange(Math.max(0, volume - 0.1))}
            >
              <Text style={styles.sliderButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.sliderTrack}>
              <View
                style={[styles.sliderFill, { width: `${volume * 100}%` }]}
              />
              <View style={[styles.sliderThumb, { left: `${volume * 90}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() => handleVolumeChange(Math.min(1, volume + 0.1))}
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sliderRow}>
          <Text style={styles.sliderLabel}>よむはやさ</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleReadingSpeedChange(Math.max(0.5, readingSpeed - 0.1))
              }
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
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${((readingSpeed - 0.5) / 1) * 90}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.sliderButton}
              onPress={() =>
                handleReadingSpeedChange(Math.min(1.5, readingSpeed + 0.1))
              }
            >
              <Text style={styles.sliderButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ページグリッドナビゲーション */}
      <View style={styles.pageGridContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pageGrid}
        >
          {generatePageGrid().map((pageIndex) => (
            <TouchableOpacity
              key={pageIndex}
              style={[
                styles.pageGridItem,
                currentPage === pageIndex && styles.pageGridItemActive,
              ]}
              onPress={() => goToPage(pageIndex)}
            >
              <Text
                style={[
                  styles.pageGridItemText,
                  currentPage === pageIndex && styles.pageGridItemTextActive,
                ]}
              >
                {pageIndex + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 停止ボタン */}
      <TouchableOpacity style={styles.stopButton} onPress={handleBackPress}>
        <Text style={styles.stopButtonText}>ていし</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: Colors.text,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    minWidth: 120,
  },
  toggleButtonActive: {
    backgroundColor: '#F2BE45',
  },
  toggleButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  toggleButtonTextActive: {
    color: '#333',
  },
  centerPlayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  playButtonLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  speakingIndicator: {
    alignItems: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: 30,
  },
  waveBar: {
    width: 8,
    height: 40,
    backgroundColor: '#999',
    marginHorizontal: 2,
    borderRadius: 4,
  },
  centerControls: {
    flexDirection: 'row',
    gap: 20,
  },
  centerControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderControls: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#FFF',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sliderLabel: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: '#333',
    width: 100,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: '#333',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 15,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#F2BE45',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  pageGridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
  },
  pageGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
  },
  pageGridItem: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageGridItemActive: {
    backgroundColor: '#333',
  },
  pageGridItemText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 14,
    color: '#666',
  },
  pageGridItemTextActive: {
    color: '#FFF',
  },
  stopButton: {
    marginHorizontal: 30,
    marginVertical: 20,
    paddingVertical: 15,
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    alignItems: 'center',
  },
  stopButtonText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 18,
    color: '#FFF',
  },
});
