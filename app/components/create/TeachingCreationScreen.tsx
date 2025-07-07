import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import BackButton from '../ui/BackButton';
import MiniGameScreen from './MiniGameScreen';

interface TeachingCreationScreenProps {
  onBack: () => void;
  onStartCreate: (params: {
    characterId: string;
    characterName: string;
    characterImage: any;
    storyStyle: string;
    teachingGoal: string;
  }) => void;
}

type StoryStyle = 'adventure' | 'cute' | 'educational' | 'fantasy' | null;
type Character = 'bear' | 'cat' | 'dog' | null;

export default function TeachingCreationScreen({
  onBack,
  onStartCreate,
}: TeachingCreationScreenProps) {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<StoryStyle>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);
  const [teachingGoal, setTeachingGoal] = useState('');
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [hasCompletedMiniGame, setHasCompletedMiniGame] = useState(false);

  const canStart = selectedStyle && selectedCharacter && teachingGoal.trim().length > 0;

  const storyStyles = [
    {
      id: 'adventure' as const,
      label: 'えのぐ',
      image: require('../../../assets/images/create/01.png'),
    },
    {
      id: 'cute' as const,
      label: 'コミカル',
      image: require('../../../assets/images/create/02.png'),
    },
    {
      id: 'educational' as const,
      label: 'ノーマル',
      image: require('../../../assets/images/create/03.png'),
    },
    {
      id: 'fantasy' as const,
      label: 'ファンタジー',
      image: require('../../../assets/images/create/04.png'),
    },
  ];

  const characters = [
    {
      id: 'bear' as const,
      image: require('../../../assets/images/create/bear.png'),
      label: 'くま',
    },
    { id: 'cat' as const, image: require('../../../assets/images/create/cat.png'), label: 'ねこ' },
    { id: 'dog' as const, image: require('../../../assets/images/create/dog.png'), label: 'いぬ' },
  ];

  // ミニゲーム画面を表示
  if (showMiniGame && !hasCompletedMiniGame) {
    return (
      <MiniGameScreen
        duration={10000}
        onComplete={() => {
          // ミニゲーム終了後、絵本作成処理を実行
          setHasCompletedMiniGame(true);
          if (selectedCharacter && selectedStyle) {
            const character = characters.find((c) => c.id === selectedCharacter);
            const style = storyStyles.find((s) => s.id === selectedStyle);
            if (character && style) {
              onStartCreate({
                characterId: character.id,
                characterName: character.label,
                characterImage: character.image,
                storyStyle: style.label,
                teachingGoal: teachingGoal.trim(),
              });
            }
          }
        }}
      />
    );
  }

  return (
    <View className="bg-primary-400 flex-1">
      <SafeAreaView className="flex-1">
        <View className="bg-primary-400 flex-1 px-4">
          {/* ヘッダー */}
          <View className="py-4">
            <BackButton onPress={onBack} style={{ left: 0 }} />

            <Text className="mt-8 text-center text-xl font-bold">教えたいことをえほんにする</Text>
          </View>

          {/* どんなえがいい？セクション */}
          <View className="mb-4">
            <Text className=" mb-3 text-center text-base font-bold">どんなえがいい？</Text>

            <View>
              {/* 1行目 */}
              <View className="mb-2 flex-row justify-between">
                {storyStyles.slice(0, 2).map((style) => (
                  <View key={style.id} style={{ width: '48%' }}>
                    <TouchableOpacity
                      onPress={() => setSelectedStyle(style.id)}
                      className="rounded-2xl bg-white"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        height: 140,
                        padding: 8,
                        margin: 4,
                        borderWidth: selectedStyle === style.id ? 2 : 0,
                        borderColor: selectedStyle === style.id ? '#3B82F6' : 'transparent',
                      }}>
                      <View className="flex-1 items-center justify-center">
                        <Image
                          source={style.image}
                          style={{ width: 80, height: 80 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-primary-900 mt-1 text-center text-sm font-bold">
                        {style.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* 2行目 */}
              <View className="flex-row justify-between">
                {storyStyles.slice(2, 4).map((style) => (
                  <View key={style.id} style={{ width: '48%' }}>
                    <TouchableOpacity
                      onPress={() => setSelectedStyle(style.id)}
                      className="rounded-2xl bg-white"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        height: 140,
                        padding: 8,
                        margin: 4,
                        borderWidth: selectedStyle === style.id ? 2 : 0,
                        borderColor: selectedStyle === style.id ? '#3B82F6' : 'transparent',
                      }}>
                      <View className="flex-1 items-center justify-center">
                        <Image
                          source={style.image}
                          style={{ width: 80, height: 80 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-primary-900 mt-1 text-center text-sm font-bold">
                        {style.label}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* どのキャラをつかう？セクション */}
          <View className="m-2 mb-4">
            <Text className=" mb-3 text-center text-base font-bold">どのキャラをつかう？</Text>

            <View className="flex-row justify-around">
              {characters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  onPress={() => setSelectedCharacter(character.id)}
                  className="m-1 rounded-2xl bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    width: '30%',
                    height: 100,
                    padding: 8,
                    margin: 4,
                    borderWidth: selectedCharacter === character.id ? 2 : 0,
                    borderColor: selectedCharacter === character.id ? '#3B82F6' : 'transparent',
                  }}>
                  <View className="flex-1 items-center justify-center">
                    <Image
                      source={character.image}
                      style={{ width: 50, height: 50 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-primary-900 mt-1 text-center text-sm font-bold">
                    {character.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 教えたいことの入力セクション */}
          <View className="mb-6">
            <Text className=" mb-3 text-center text-base font-bold">
              この絵本で、お子さんに一番伝えたいことは何ですか？
            </Text>
            <TextInput
              value={teachingGoal}
              onChangeText={setTeachingGoal}
              placeholder="例：はみがきの大切さ、友達と仲良くする方法"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              className="text-primary-900 rounded-xl bg-white p-4 text-base"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* はじめるボタン */}
          <View>
            <TouchableOpacity
              onPress={() => {
                if (canStart) {
                  setShowMiniGame(true);
                }
              }}
              disabled={!canStart}
              className="rounded-xl py-4"
              style={{
                backgroundColor: canStart ? '#9CA3AF' : '#D1D5DB',
              }}>
              <Text className="text-center text-lg font-bold text-white">はじめる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
