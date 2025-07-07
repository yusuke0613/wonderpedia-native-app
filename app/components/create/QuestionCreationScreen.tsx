import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import BackButton from '../ui/BackButton';

interface QuestionCreationScreenProps {
  onBack: () => void;
  onStartCreate: (params: {
    characterId: string;
    characterName: string;
    characterImage: any;
    storyStyle: string;
  }) => void;
}

type StoryStyle = 'adventure' | 'cute' | 'educational' | 'fantasy' | null;
type Character = 'bear' | 'cat' | 'dog' | null;

export default function QuestionCreationScreen({
  onBack,
  onStartCreate,
}: QuestionCreationScreenProps) {
  const [selectedStyle, setSelectedStyle] = useState<StoryStyle>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(null);

  const canStart = selectedStyle && selectedCharacter;

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

  return (
    <View className="bg-primary-400 flex-1">
      <SafeAreaView className="flex-1">
        <View className="px-4　bg-primary-400 flex-1">
          {/* ヘッダー */}
          <View className=" py-4">
            <BackButton onPress={onBack} style={{ left: 0 }} />

            <Text className=" mt-8 text-center text-xl font-bold">
              わからないことをえほんにきく
            </Text>
          </View>

          {/* どんなえがかいい？セクション */}
          <View className="mb-6">
            <Text className=" mb-4 text-center text-base font-bold">どんなえがかいい？</Text>

            <View>
              {/* 1行目 */}
              <View className="mb-3 flex-row justify-between">
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
                        height: 180,
                        padding: 12,
                        borderWidth: selectedStyle === style.id ? 2 : 0,
                        borderColor: selectedStyle === style.id ? '#3B82F6' : 'transparent',
                      }}>
                      <View className="flex-1 items-center justify-center">
                        <Image
                          source={style.image}
                          style={{ width: 120, height: 120 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="mt-2 text-center text-sm font-bold">{style.label}</Text>
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
                        height: 180,
                        padding: 12,
                        borderWidth: selectedStyle === style.id ? 2 : 0,
                        borderColor: selectedStyle === style.id ? '#3B82F6' : 'transparent',
                      }}>
                      <View className="flex-1 items-center justify-center">
                        <Image
                          source={style.image}
                          style={{ width: 120, height: 120 }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="mt-2 text-center text-sm font-bold">{style.label}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* しんでかいたキャラをつかう？セクション */}
          <View className="m-2 mb-6">
            <Text className="mb-4 text-center text-base font-bold">どのキャラをつかう？</Text>

            <View className="flex-row justify-around">
              {characters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  onPress={() => setSelectedCharacter(character.id)}
                  className="m-2 rounded-2xl bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    width: '30%',
                    height: 120,
                    padding: 12,
                    margin: 6,
                    borderWidth: selectedCharacter === character.id ? 2 : 0,
                    borderColor: selectedCharacter === character.id ? '#3B82F6' : 'transparent',
                  }}>
                  <View className="flex-1 items-center justify-center">
                    <Image
                      source={character.image}
                      style={{ width: 60, height: 60 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-primary-900 mt-2 text-center text-sm font-bold">
                    {character.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* はじめるボタン */}
          <View>
            <TouchableOpacity
              onPress={() => {
                if (canStart && selectedCharacter && selectedStyle) {
                  const character = characters.find((c) => c.id === selectedCharacter);
                  const style = storyStyles.find((s) => s.id === selectedStyle);
                  if (character && style) {
                    onStartCreate({
                      characterId: character.id,
                      characterName: character.label,
                      characterImage: character.image,
                      storyStyle: style.label,
                    });
                  }
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
