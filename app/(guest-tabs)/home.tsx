import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// @ts-expect-error - expoルーターの型定義エラーを一時的に無視
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import Login from '@/components/Login';

// スライダーのコンテンツ
interface SlideItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const slideData: SlideItem[] = [
  {
    id: '1',
    title: 'お子様だけの物語',
    description: 'お子様の興味や好みに合わせたオリジナルの絵本を作成します',
    icon: 'book-outline',
  },
  {
    id: '2',
    title: 'AIとの会話で創作',
    description: 'AIキャラクターとの会話を通じて物語を発展させていきます',
    icon: 'chatbubbles-outline',
  },
  {
    id: '3',
    title: '読み上げ機能',
    description:
      '作成した物語は自動読み上げができ、お子様の読書体験をサポートします',
    icon: 'mic-outline',
  },
  {
    id: '4',
    title: '簡単操作',
    description: '直感的な操作で、どなたでも簡単に絵本作成ができます',
    icon: 'finger-print-outline',
  },
];

// スライダーのドットインジケーター
const Pagination = ({ data, index }: { data: SlideItem[]; index: number }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => (
        <View
          key={i}
          style={[
            styles.paginationDot,
            index === i
              ? styles.paginationDotActive
              : styles.paginationDotInactive,
          ]}
        />
      ))}
    </View>
  );
};

// スライドアイテムレンダリング
const SlideItem = ({ item }: { item: SlideItem }) => {
  return (
    <View style={styles.slideItemContainer}>
      <View style={styles.slideIconContainer}>
        <Ionicons name={item.icon} size={40} color="#E9785E" />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </View>
  );
};

// スライダーコンポーネント
const AppIntroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = Dimensions.get('window');

  // 自動スライド用のタイマー
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slideData.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  // スクロール時のインデックス変更
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        ref={flatListRef}
        data={slideData}
        renderItem={({ item }) => <SlideItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <Pagination data={slideData} index={currentIndex} />
    </View>
  );
};

// メインのHomeScreen
export default function HomeScreen() {
  const router = useRouter();
  // @ts-expect-error - 型定義の問題を一時的に無視
  const { isAuthenticated } = useAuth();

  // 既にログインしている場合はメインタブに遷移
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        {/* ロゴ */}
        <Text style={styles.logoText}>Wonderpedia</Text>

        {/* アプリ紹介スライダー */}
        <AppIntroSlider />

        {/* 登録案内メッセージ */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            お子様にあった絵本を作るために{'\n'}
            お子様の情報
            <Text style={styles.smallText}>（年齢や趣味など）</Text>
            {'\n'}
            をご登録ください
          </Text>
        </View>

        {/* 登録ボタン */}
        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.8}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.registerButtonText}>
            お子様の情報を登録
            <Text style={styles.smallRegisterText}>（新規登録）</Text>
          </Text>
        </TouchableOpacity>

        {/* 区切り線 */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>または</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ログインフォーム */}
        <Login />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E9785E',
    textAlign: 'center',
    marginBottom: 10,
  },
  // スライダー関連のスタイル
  sliderContainer: {
    height: height * 0.22, // 画面高さの22%に制限
    marginBottom: 15,
  },
  slideItemContainer: {
    width: width - 40, // スクロールビューのパディングを考慮
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  slideIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(233, 120, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#E9785E',
  },
  paginationDotInactive: {
    backgroundColor: '#ccc',
  },
  // サービス説明エリア
  serviceInfoBox: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  // 登録案内メッセージ
  messageContainer: {
    width: '100%',
    backgroundColor: 'rgba(233, 185, 73, 0.1)',
    borderWidth: 1,
    borderColor: '#E9B949',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#333',
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
  // 登録ボタン
  registerButton: {
    width: '100%',
    backgroundColor: '#E9785E',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallRegisterText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  // シンプルなログインボタン
  simpleLoginButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  simpleLoginButtonText: {
    color: '#E9785E',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // 区切り線
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
  },
  // ログインフォーム
  loginFormContainer: {
    width: '100%',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#E9D949',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#E9785E',
    fontSize: 12,
  },
});
