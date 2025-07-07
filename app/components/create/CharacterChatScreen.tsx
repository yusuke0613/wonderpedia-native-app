import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BackButton from '../ui/BackButton';

interface CharacterChatScreenProps {
  characterId: string;
  characterImage: any;
  characterName: string;
  storyStyle: string;
  onBack: () => void;
  onGenerateStory: (messages: Message[]) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'character';
  timestamp: Date;
}

export default function CharacterChatScreen({
  characterImage,
  characterName,
  onBack,
  onGenerateStory,
}: CharacterChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `こんにちは！${characterName}じゃ。\nきみの しつもんに こたえるよ。\nなにが しりたいかな？`,
      sender: 'character',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // メッセージ数をカウント（キャラクターの初回メッセージを除く）
  const userMessageCount = messages.filter((m) => m.sender === 'user').length;
  const canGenerateStory = userMessageCount >= 1;

  useEffect(() => {
    // 新しいメッセージが追加されたらスクロール
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  useEffect(() => {
    // 録音ボタンのアニメーション
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isRecording]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');

    // キャラクターの返信をシミュレート
    setTimeout(() => {
      const characterResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getCharacterResponse(userMessageCount, inputText),
        sender: 'character',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, characterResponse]);
    }, 1000);
  };

  const getCharacterResponse = (messageCount: number, userMessage?: string): string => {
    const selectedCharacterName = characterName || 'はかせ';

    // 「空はなんで青いの？」の自然な対話形式
    if (messageCount === 0) {
      const message = userMessage?.toLowerCase() || '';

      if (message.includes('空') && (message.includes('青') || message.includes('あお'))) {
        return `やあ、いいところに きがついたのう！\nそれは とっても すてきな ぎもんだ。\n\nたいようの ひかりはね、ほんとうは いろんな いろが まざって できておるんじゃ。にじと おなじじゃな。`;
      }

      return `やあ、すごい しつもんだのう！\nそれについて、${selectedCharacterName}が おしえてあげよう。\nまず、なにが いちばん しりたいかな？`;
    }

    if (messageCount === 1) {
      const message = userMessage?.toLowerCase() || '';

      if (message.includes('にじ') || message.includes('虹')) {
        return `そうじゃ！その いろんな いろの なかで、『あおいろの ひかり』だけが、くうきの なかで あちこちに ちらばるのが だいすき なんじゃよ。\n\nあおいろの ひかりが、まるで ちいさな ボールみたいに、そら いっぱいに ぱーっと ひろがるんじゃ。`;
      }

      return `なるほど、なるほど。\nそれはね、とっても ふしぎな ことなんじゃ。\nもう すこし くわしく きいてみるかい？`;
    }

    if (messageCount === 2) {
      const message = userMessage?.toLowerCase() || '';

      if (message.includes('ボール') || message.includes('ぼーる')) {
        return `そうじゃ！だから きみの めには、そら ぜんたいが きれいな あおに みえるんじゃよ。ふしぎじゃのう。\n\nこの ふしぎな おはなし、えほんに してみるかい？`;
      }

      return `よく りかいできたのう！\nこの すてきな はっけんを、えほんに して みんなに おしえてあげよう。\nえほんを つくってみるかい？`;
    }

    if (messageCount >= 3) {
      return `うむ！すばらしい！\nきみの しつもんから、とても すてきな えほんが できそうじゃ。\n「えほんをつくる」ボタンを おしてみるのじゃ🌟`;
    }

    return `ありがとう！すてきな えほんを つくってみよう！`;
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // 実際の音声録音ロジックはここに実装
    if (isRecording) {
      // 録音停止して、仮のテキストを設定
      setInputText('ねえ、はかせ！そらは なんで あおいの？');
    }
  };

  return (
    <View className="bg-primary-400 flex-1">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          {/* ヘッダー */}
          <View
            className="bg-white px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}>
            <BackButton onPress={onBack} />
            <View className="mt-2 flex-row items-center justify-center">
              <View className="bg-primary-100 rounded-full p-2">
                <Image
                  source={characterImage}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-primary-800 ml-3 text-2xl font-black">
                {characterName}とおはなし
              </Text>
              <Text className="ml-2 text-2xl">💬</Text>
            </View>
          </View>

          {/* 説明エリア */}
          <View
            className="bg-primary-50 mx-4 mt-2 rounded-xl px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <View className="items-center">
              <Text className="text-primary-800 text-base font-black">
                {userMessageCount === 0 ? 'しりたいことをきいてね！' : 'えほんがつくれるよ！'}
              </Text>
              {userMessageCount === 0 ? (
                <Text className="text-primary-600 mt-1 text-sm font-medium">
                  1つのしつもんでAIがえほんをつくります ✨
                </Text>
              ) : (
                <Text className="text-key-600 mt-1 text-sm font-bold">
                  したのボタンでえほんせいせい 📖🌟
                </Text>
              )}
            </View>
          </View>

          {/* チャットエリア */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-2"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                className={
                  message.sender === 'user'
                    ? 'mb-3 flex-row justify-end'
                    : 'mb-3 flex-row justify-start'
                }>
                {message.sender === 'character' && (
                  <View className="bg-primary-200 mr-2 h-10 w-10 items-center justify-center rounded-full">
                    <Image
                      source={characterImage}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                )}
                <View
                  className={
                    message.sender === 'user'
                      ? 'bg-primary-600 rounded-2xl px-5 py-4'
                      : 'rounded-2xl bg-white px-5 py-4'
                  }
                  style={{
                    maxWidth: '80%',
                    ...(message.sender === 'character'
                      ? {
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }
                      : {
                          shadowColor: '#2563EB',
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.2,
                          shadowRadius: 6,
                          elevation: 5,
                        }),
                  }}>
                  <Text
                    className={
                      message.sender === 'user'
                        ? 'text-lg font-black text-white'
                        : 'text-primary-800 text-lg font-bold'
                    }
                    style={{ lineHeight: 24 }}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}

            {/* 絵本生成ボタン */}
            {canGenerateStory && (
              <View className="mx-4 my-6">
                <TouchableOpacity
                  onPress={() => onGenerateStory(messages)}
                  className="bg-key-500 w-full overflow-hidden rounded-3xl py-6"
                  style={{
                    shadowColor: '#F97316',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 15,
                  }}>
                  <View className="items-center">
                    <View className="mb-2 flex-row items-center">
                      <Text className="text-2xl">✨</Text>
                      <Text className="text-2xl">📖</Text>
                      <Text className="text-2xl">🌟</Text>
                    </View>
                    <Text className="text-3xl font-black text-white">えほんをつくる！</Text>
                    <Text className="mt-1 text-lg font-bold text-white opacity-90">
                      AIがすてきなえほんをつくります
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* 入力エリア */}
          <View
            className="bg-white px-4 py-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}>
            {!isRecording ? (
              // 通常の入力モード
              <View className="flex-row items-center">
                <View className="bg-primary-50 mr-4 flex-1 overflow-hidden rounded-2xl">
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="しつもんをかいてね..."
                    placeholderTextColor="#6B7280"
                    className="text-primary-800 px-5 py-4 text-lg font-medium"
                    style={{ minHeight: 56 }}
                    onSubmitEditing={sendMessage}
                  />
                </View>

                <TouchableOpacity
                  onPress={toggleRecording}
                  className="bg-primary-600 mr-3 h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    shadowColor: '#7C3AED',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}>
                  <Ionicons name="mic" size={32} color="white" />
                </TouchableOpacity>

                {inputText.trim() && (
                  <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-primary-600 h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      shadowColor: '#2563EB',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}>
                    <MaterialIcons name="send" size={28} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              // 録音モード
              <View className="items-center py-6">
                <Text className="text-primary-800 mb-6 text-xl font-black">
                  おはなしをきいてるよ... 🎤
                </Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    onPress={toggleRecording}
                    className="bg-secondary-500 h-28 w-28 items-center justify-center rounded-3xl"
                    style={{
                      shadowColor: '#EF4444',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 15,
                    }}>
                    <View className="bg-secondary-600 h-24 w-24 items-center justify-center rounded-3xl">
                      <MaterialIcons name="stop" size={48} color="white" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                <Text className="text-primary-700 mt-4 text-lg font-bold">
                  おわったらボタンをおしてね
                </Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
