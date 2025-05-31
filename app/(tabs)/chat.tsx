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
  SafeAreaView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
// @ts-expect-error - expo-routerの型定義エラーを一時的に無視
import { useLocalSearchParams, useNavigation, router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Speech from 'expo-speech';
// @ts-expect-error - expo-avの型定義エラーを一時的に無視
import { Audio } from 'expo-av';
import { useStory } from '@/context/StoryContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import {
  Send,
  Volume2,
  VolumeX,
  Mic,
  Book,
  X,
  BookOpen,
  Star,
  Sparkles,
} from 'lucide-react-native';

const MOCK_RESPONSES = [
  'それはね、恐竜の時代は今から約6500万年前に終わったんだよ。地球に大きな隕石が落ちてきたのがきっかけと言われているんだ。',
  '星の数？夜空に見える星は肉眼で約6000個ぐらいだけど、宇宙全体には数え切れないほどたくさんの星があるんだよ！',
  '虹はね、太陽の光が水滴に当たって、光が分かれることでできるんだ。赤、橙、黄、緑、青、藍、紫の7色に見えるよ。',
  'どうして空は青いのかな？それは太陽の光が空気に当たると、青い光が一番散らばりやすいからなんだ。',
  'うみの深さは場所によって違うよ。一番深いところはマリアナ海溝で、約11,000メートルもあるんだ！富士山より高いね！',
  'なぜ人は寝るの？それはね、脳や体を休ませて、次の日に元気に活動するためなんだ。寝ている間に成長もするんだよ。',
  '雨はどうやってふるの？それは雲の中の水蒸気が冷やされて水滴になって、重くなって落ちてくるんだよ。',
  'どうして昼と夜があるの？地球が自分で回っていて、太陽に面している側が昼、反対側が夜になるんだよ。',
];

// 質問の例
const EXAMPLE_QUESTIONS = [
  'なぜ空は青いの？',
  '恐竜はどうして絶滅したの？',
  '雨はどうして降るの？',
  '虹はどうやってできるの？',
  'どうして昼と夜があるの？',
  '星はなんで光るの？',
  'うみの中には何がいるの？',
];

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
};

const { width } = Dimensions.get('window');

// 例文スライダーコンポーネント
const ExampleSlider = ({
  onSelectExample,
}: {
  onSelectExample: (text: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // 自動スクロール
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % EXAMPLE_QUESTIONS.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleLabel}>質問の例：</Text>
      <FlatList
        ref={flatListRef}
        data={EXAMPLE_QUESTIONS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exampleItem}
            onPress={() => onSelectExample(item)}
          >
            <Text style={styles.exampleText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.paginationContainer}>
        {EXAMPLE_QUESTIONS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              currentIndex === i
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// 絵本作成中の待機画面コンポーネント
const BookCreationLoadingScreen = ({
  visible,
  onClose,
  onComplete,
  charEmoji,
}: {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
  charEmoji: string;
}) => {
  const [progress, setProgress] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  // 絵本作成の進行状況を更新
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          // 完了後、少し待ってから次の画面に遷移
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150); // 約15秒で完了

    return () => clearInterval(interval);
  }, [visible, onComplete]);

  // 回転アニメーション
  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1, // 無限に繰り返し
        false
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(0.9, { duration: 1000 })
        ),
        -1,
        true
      );
    }

    return () => {
      rotation.value = 0;
      scale.value = 1;
    };
  }, [visible]);

  // ミニゲーム：星をタップするゲーム
  useEffect(() => {
    if (!gameActive || !visible) return;

    // 1秒ごとにランダムな位置に星を追加
    const interval = setInterval(() => {
      const { width, height } = Dimensions.get('window');
      const newStar = {
        id: Date.now(),
        x: Math.random() * (width - 60),
        y: Math.random() * (height / 2 - 60) + 100,
        size: Math.random() * 20 + 20,
      };

      setStars((prev) => [...prev, newStar]);

      // 3秒後に星を消す
      setTimeout(() => {
        setStars((prev) => prev.filter((star) => star.id !== newStar.id));
      }, 3000);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive, visible]);

  // 星をタップした時の処理
  const handleStarPress = (id: number) => {
    setGameScore((prev) => prev + 10);
    setStars((prev) => prev.filter((star) => star.id !== id));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  // スタイルを直接定義
  const modalStyles = StyleSheet.create({
    loadingModalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingModalContent: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: 15,
      top: 15,
      zIndex: 10,
    },
    loadingTitle: {
      fontFamily: 'ComicNeue-Bold',
      fontSize: 24,
      color: Colors.text,
      marginBottom: 20,
      marginTop: 10,
    },
    loadingIconContainer: {
      width: 100,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    loadingEmoji: {
      fontSize: 40,
      position: 'absolute',
    },
    bookIcon: {
      position: 'absolute',
      opacity: 0.7,
    },
    progressBarContainer: {
      width: '100%',
      height: 15,
      backgroundColor: '#E0E0E0',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
    },
    progressBar: {
      height: '100%',
      backgroundColor: Colors.primary,
    },
    progressText: {
      fontFamily: 'ComicNeue-Regular',
      fontSize: 16,
      color: Colors.text,
      marginBottom: 20,
    },
    loadingHint: {
      fontFamily: 'ComicNeue-Regular',
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      marginTop: 20,
      paddingHorizontal: 10,
    },
    gameContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    gameTitle: {
      fontFamily: 'ComicNeue-Bold',
      fontSize: 16,
      color: Colors.text,
      marginBottom: 10,
    },
    gameButton: {
      backgroundColor: '#FFD700',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    gameButtonText: {
      fontFamily: 'ComicNeue-Bold',
      fontSize: 14,
      color: Colors.text,
    },
    gameArea: {
      width: '100%',
      height: 200,
      position: 'relative',
    },
    star: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.loadingModalContainer}>
        <View style={modalStyles.loadingModalContent}>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>

          <Text style={modalStyles.loadingTitle}>絵本を作成中...</Text>

          <Animated.View
            style={[modalStyles.loadingIconContainer, animatedStyle]}
          >
            <Text style={modalStyles.loadingEmoji}>{charEmoji}</Text>
            <BookOpen
              size={40}
              color={Colors.primary}
              style={modalStyles.bookIcon}
            />
          </Animated.View>

          <View style={modalStyles.progressBarContainer}>
            <View
              style={[modalStyles.progressBar, { width: `${progress}%` }]}
            />
          </View>
          <Text style={modalStyles.progressText}>{progress}%</Text>

          {progress > 10 && progress < 90 && (
            <View style={modalStyles.gameContainer}>
              <Text style={modalStyles.gameTitle}>
                {gameActive
                  ? `星をタップしてね！ スコア: ${gameScore}`
                  : '待っている間に遊びましょう！'}
              </Text>

              {!gameActive ? (
                <TouchableOpacity
                  style={modalStyles.gameButton}
                  onPress={() => setGameActive(true)}
                >
                  <Text style={modalStyles.gameButtonText}>
                    ミニゲームを始める
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={modalStyles.gameArea}>
                  {stars.map((star) => (
                    <TouchableOpacity
                      key={star.id}
                      style={[
                        modalStyles.star,
                        {
                          left: star.x,
                          top: star.y,
                          width: star.size,
                          height: star.size,
                        },
                      ]}
                      onPress={() => handleStarPress(star.id)}
                    >
                      <Sparkles size={star.size} color="#FFD700" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <Text style={modalStyles.loadingHint}>
            {progress < 50
              ? 'キャラクターがあなたの質問から絵本を作っています...'
              : 'もうすぐ完成します！少々お待ちください...'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentStory } = useStory();
  const { selectedChild } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showCreateBookButton, setShowCreateBookButton] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // URLパラメータから情報を取得
  const themeId = params.themeId as string;
  const themeName = params.themeName as string;
  const charId = params.charId as string;
  const charName = params.charName as string;
  const charEmoji = params.charEmoji as string;

  // 画面のタイトルを設定
  useEffect(() => {
    if (charName && navigation.setOptions) {
      navigation.setOptions({
        headerTitle: `${charEmoji} ${charName}とおしゃべり`,
      });
    }
  }, [charName, charEmoji, navigation]);

  useEffect(() => {
    // 初期メッセージまたは選択されたキャラクターがない場合のデフォルトメッセージ
    if (messages.length === 0) {
      const initialMessage = {
        id: '1',
        text: `こんにちは${selectedChild?.name || 'きみ'}！${
          charName || 'わたし'
        }だよ。なにか知りたいことある？質問してね！`,
        sender: 'character' as const,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);

      speakMessage(initialMessage.text);
    }
  }, [selectedChild, charName, themeName]);

  // メッセージ数に基づいて絵本作成ボタンの表示を制御
  useEffect(() => {
    // ユーザーからのメッセージが3つ以上あれば絵本作成ボタンを表示
    const userMessageCount = messages.filter((m) => m.sender === 'user').length;
    if (userMessageCount >= 3 && !showCreateBookButton) {
      setShowCreateBookButton(true);
    }
  }, [messages]);

  const speakMessage = (text: string) => {
    if (!isSpeechEnabled) return;

    Speech.stop();

    if (Platform.OS === 'web') {
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    Speech.speak(text, {
      language: 'ja-JP',
      pitch: 1.0,
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  const startVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      setIsRecording(true);

      // 音声認識の権限確認
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('音声入力には録音の許可が必要です');
        setIsRecording(false);
        return;
      }

      // 実際のアプリでは音声認識APIと連携
      // デモ用のタイマー（実際には音声認識結果を受け取る）
      setTimeout(() => {
        // デモ用に例文からランダムに選択
        const randomExample =
          EXAMPLE_QUESTIONS[
            Math.floor(Math.random() * EXAMPLE_QUESTIONS.length)
          ];
        setMessage(randomExample);
        setIsRecording(false);
      }, 2000);
    } catch (error) {
      console.error('音声入力エラー:', error);
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (message.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    setIsTyping(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
      const responseText = MOCK_RESPONSES[randomIndex];

      const characterMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'character',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, characterMessage]);
      setIsTyping(false);

      speakMessage(responseText);

      // 自動スクロール
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);

    // 送信後にスクロール
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleCreateBook = () => {
    // 音声を停止
    stopSpeaking();

    // 絵本作成中の画面を表示
    setShowLoadingModal(true);
  };

  const handleBookCreationComplete = () => {
    // 絵本作成完了後の処理
    setShowLoadingModal(false);

    // 絵本閲覧画面に遷移
    router.push({
      pathname: '/story-player',
      params: {
        fromChat: 'true',
        newStory: 'true',
        storyId: `chat-story-${Date.now()}`, // 一意のID生成
        themeId,
        themeName,
        charId,
        charEmoji,
        // 会話内容も渡す
        conversation: JSON.stringify(
          messages.map((m) => ({
            text: m.text,
            sender: m.sender,
          }))
        ),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <Text style={styles.headerText}>わからないことをえほんにきく</Text>
        </View>
        <TouchableOpacity style={styles.soundToggle} onPress={toggleSpeech}>
          {isSpeechEnabled ? (
            <Volume2 size={24} color={Colors.primary} />
          ) : (
            <VolumeX size={24} color={Colors.darkGray} />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <Animated.View
              key={msg.id}
              entering={FadeInUp.duration(300)}
              style={[
                styles.messageBubble,
                msg.sender === 'user'
                  ? styles.userBubble
                  : styles.characterBubble,
              ]}
            >
              {msg.sender === 'character' && (
                <Text style={styles.charIconText}>{charEmoji}</Text>
              )}
              <Text
                style={[
                  styles.messageText,
                  msg.sender === 'user'
                    ? styles.userMessageText
                    : styles.characterMessageText,
                ]}
              >
                {msg.text}
              </Text>
            </Animated.View>
          ))}

          {isTyping && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={[styles.messageBubble, styles.characterBubble]}
            >
              <Text style={styles.charIconText}>{charEmoji}</Text>
              <Text style={[styles.messageText, styles.typingIndicator]}>
                考え中...
              </Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* 絵本作成ボタン */}
        {showCreateBookButton && (
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={styles.createBookButtonContainer}
          >
            <TouchableOpacity
              style={styles.createBookButton}
              onPress={handleCreateBook}
            >
              <Book size={20} color="white" style={styles.createBookIcon} />
              <Text style={styles.createBookText}>この会話から絵本を作る</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 例文スライダー */}
        <ExampleSlider onSelectExample={(text) => setMessage(text)} />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="なにについてしりたい？"
            placeholderTextColor="#A7A7A7"
            multiline
          />

          <TouchableOpacity
            style={[styles.voiceButton, isRecording && styles.recordingButton]}
            onPress={startVoiceInput}
          >
            {isRecording ? (
              <ActivityIndicator color="red" size="small" />
            ) : (
              <Mic size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() === '' && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={message.trim() === ''}
          >
            <Send
              size={20}
              color={message.trim() === '' ? '#CCCCCC' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 絵本作成中の待機画面 */}
      <BookCreationLoadingScreen
        visible={showLoadingModal}
        onClose={() => setShowLoadingModal(false)}
        onComplete={handleBookCreationComplete}
        charEmoji={charEmoji || '📚'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7E9',
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
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
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  // 音声トグルボタン
  soundToggle: {
    position: 'absolute',
    right: 15,
    top: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  themeContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#E8F4F8',
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  themeText: {
    fontFamily: 'ComicNeue-Bold',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  themeEmoji: {
    fontSize: 20,
    marginRight: 5,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: '#E8E8E8',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  characterBubble: {
    backgroundColor: '#4EAFC5',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  charIconText: {
    fontSize: 24,
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#333333',
  },
  characterMessageText: {
    color: 'white',
  },
  typingIndicator: {
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 40,
    maxHeight: 100,
    fontFamily: 'ComicNeue-Regular',
    fontSize: 16,
  },
  // 音声入力ボタン
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  recordingButton: {
    backgroundColor: '#FFEEEE',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4EAFC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  // 例文スライダー
  exampleContainer: {
    padding: 10,
    backgroundColor: '#F0F8FF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  exampleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'ComicNeue-Regular',
  },
  exampleItem: {
    width: width - 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  exampleText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'ComicNeue-Bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
  },
  paginationDotInactive: {
    backgroundColor: '#ccc',
  },
  // 絵本作成ボタン
  createBookButtonContainer: {
    padding: 10,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  createBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  createBookIcon: {
    marginRight: 8,
  },
  createBookText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ComicNeue-Bold',
  },
});
