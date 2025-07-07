import { View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CreateHeader from './CreateHeader';
import GradientButton from '../ui/GradientButton';
import { CreateType } from '../../constants/createTypes';

interface StoryInputScreenProps {
  createType: CreateType;
  prompt: string;
  onPromptChange: (text: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

export default function StoryInputScreen({
  createType,
  prompt,
  onPromptChange,
  isGenerating,
  onGenerate,
  onBack,
}: StoryInputScreenProps) {
  const canGenerate = prompt.trim() && !isGenerating;

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <CreateHeader createType={createType} onBack={onBack} />

          {/* 入力エリア */}
          <View className="flex-1 justify-center px-6 pb-6">
            <View className="rounded-3xl bg-white/80 p-6 shadow-lg">
              <Text className="mb-3 text-center text-xl font-bold text-primary-800">
                {createType.emoji} おはなしの たねを かこう！
              </Text>

              <TextInput
                className="mb-4 min-h-[150] rounded-2xl bg-primary-50 p-4 text-lg"
                placeholder={createType.placeholder}
                placeholderTextColor="#9CA3AF"
                multiline
                value={prompt}
                onChangeText={onPromptChange}
                textAlignVertical="top"
                style={{ fontSize: 18 }}
              />

              <GradientButton
                onPress={onGenerate}
                disabled={!canGenerate}
                colors={createType.colors}
                className="items-center rounded-full px-6 py-4"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6,
                }}>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="magic-staff" size={24} color="white" />
                  <Text className="ml-2 text-xl font-bold text-white">
                    {isGenerating ? 'まほうを かけてるよ...' : 'えほんを つくる！'}
                  </Text>
                </View>
              </GradientButton>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
